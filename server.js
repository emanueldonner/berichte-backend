const fs = require("fs-extra")
const path = require("path")
const Eleventy = require("@11ty/eleventy")
const archiver = require("archiver")
const sanitize = require("sanitize-filename")
const { exec } = require("child_process")
const serveHandler = require("serve-handler")
const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "SYS:dd.mm.yyyy HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
}
const fastify = require("fastify")({
  logger: envToLogger["development"] ?? true,
})

const connectionStore = require("./server/connectionStore.js")

module.exports = function (fastify, ops, next) {
  next()
}

const PUBLIC_DIR = path.join(__dirname, "public")

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true })
}

fastify.register(require("@fastify/multipart"), {
  // attachFieldsToBody: true,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
})
fastify.register(require("@fastify/websocket"))
// Defining websoclket route
fastify.register(async function (fastify) {
  fastify.route({
    method: "GET",
    url: "/log",
    handler: (request, reply) => {
      reply.send("This is a WebSocket route")
    },
    wsHandler: (connection, request) => {
      console.log("client connected")
      connection.socket.send(
        JSON.stringify({ msg: "Verbindung zum Server hergestellt." })
      )
      connection.socket.on("message", (message) => {
        console.log(`Received message: ${message}`)
      })

      connectionStore.addConnection(connection.socket)
      connection.socket.on("close", () => {
        connectionStore.removeConnection(connection.socket)
      })
    },
  })
})
fastify.post("/upload", async function (request, reply) {
  try {
    connectionStore.broadcastMessage({
      msg: "Dokument wird hochgeladen...",
    })
    const file = await request.file()
    console.log("file", file.file)
    if (!file) {
      throw new Error("No file uploaded")
    }
    console.log("mime", file.mimetype)
    if (
      file.mimetype !==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      throw new Error("Invalid file type")
    }

    const nameWithoutExt = sanitize(path.parse(file.filename).name)
    const dir = `output/${nameWithoutExt}`

    const uploadDir = path.join(PUBLIC_DIR, dir)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const savePath = path.join(uploadDir, file.filename)
    await fs.promises.writeFile(savePath, file.file)

    reply.status(200).send({
      message: "Dokument erfolgreich upgeloadet.",
      status: "success",
      path: uploadDir,
      filename: file.filename,
    })
  } catch (error) {
    reply.status(500).send({ message: error.message })
  }
})

fastify.post("/parse", async function (request, reply) {
  try {
    console.log("parse body", request.body)
    connectionStore.broadcastMessage({
      msg: "Dokument wird verarbeitet...",
    })
    const { filename, path } = request.body
    if (!fs.existsSync(`${path}/build`)) {
      fs.mkdirSync(`${path}/build`, { recursive: true })
      fs.chmod(`${path}/build`, 0o775, (err) => {
        if (err) {
          console.error(err)
        }
      })
    }
    await exec(`cp -r ./public/template/. ${path}/build`)
    await exec(`npm install --prefix ${path}/build`)
    connectionStore.broadcastMessage({
      msg: "Files aus dem Template kopiert...",
    })
    await exec(
      `./server/office-parser/parse.mjs -n ${path}/build/src ${path}/${filename}`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`)
          return
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`)
          return
        }
        // console.log(`stdout: ${stdout}`)
        console.log("data type", typeof stdout)
        // Send log message to connected clients
        fastify.websocketServer.clients.forEach((client) => {
          console.log("sending to client")
          const logLines = stdout.split("\n")
          logLines.forEach((logLine) => {
            if (logLine.trim() !== "") {
              try {
                const logObject = JSON.parse(logLine)
                client.send(
                  JSON.stringify({
                    event: "parselog",
                    body: logObject,
                  })
                )
              } catch (parseError) {
                console.error("Error parsing log line:", parseError)
              }
            }
          })
          // client.send(JSON.stringify(stdout))
        })
        buildSite(path, request.body)
      }
    )
    reply.status(200).send({
      message: "Dokument erfolgreich verarbeitet.",
      status: "success",
      path: path,
    })
  } catch (error) {
    reply.status(500).send({ message: error.message })
  }
})

const replaceSettings = async (body) => {
  try {
    const folder = body.path
    fs.readFile(
      `${folder}/build/src/_data/project.js`,
      "utf8",
      function (err, data) {
        if (err) {
          return console.log("settings error: ", err)
        }
        /* 
      Überschreibe optionale und erforderliche Felder aus dem Frontend.
      Falls Felder erweitert werden: 
      - innerhalb des Formulars (im Frontend) erweitern und
      - project.js (Pfad: /raw/src/_data/project.js) muss ebenfalls erweitert werden und
      - var result = result.replace(/XXX_XXX/g, `"${body.xxx_xxx}"`); muss ebenfalls erweitert werden!
      -- ACHTUNG: result kann "string" oder boolean Werte haben
      */
        let result = data.replace(/SITE_TITLE/g, `"${body.site_title}"`)
        result = result.replace(/STAGE_TITLE/g, `"${body.stage_title}"`)
        result = result.replace(/STAGE_DESC/g, `"${body.stage_description}"`)
        result = result.replace(/SITE_COLOR/g, `"${body.site_color}"`)
        result = result.replace(/SITE_DESC/g, `"${body.site_description}"`)
        // HEADER_MENU option has to be Boolean
        result = result.replace(/HEADER_MENU/g, `${body.header_menu}`)
        // SKIP_FIRST_CHAPTER option has to be Boolean
        result = result.replace(
          /SKIP_FIRST_CHAPTER/g,
          `${body.skip_first_chapter}`
        )
        result = result.replace(/SITE_LANG/g, `"${body.site_lang}"`)

        if (body.site_search == "hidden") {
          result = result.replace(/SITE_SEARCH/g, `"${body.site_search}"`)
        } else {
          result = result.replace(/SITE_SEARCH/g, `${body.site_search}`)
        }

        if (body.site_path) {
          result = result.replace(/SITE_PATH/g, `"${body.site_path}"`)
        } else {
          result = result.replace(/SITE_PATH/g, "'/'")
        }
        // Die Datei project.js wird mit den nun ersetzten Daten, kommend aus dem Frontend, beschrieben.
        fs.writeFile(
          `${folder}/build/src/_data/project.js`,
          result,
          "utf8",
          function (err) {
            if (err) return console.log(err)
          }
        )
      }
    )
    return
  } catch (err) {
    console.log(err)
  }
}

const rewritePaths = async (folder) => {
  fs.readFile(`${folder}/.eleventy.js`, "utf8", function (err, data) {
    if (err) {
      return console.log(err)
    }

    var result = data.replace(/REPLACEME/g, `"${folder}"`)

    fs.writeFile(`${folder}/.eleventy.js`, result, "utf8", function (err) {
      if (err) return console.log(err)
    })
  })
}

const buildSite = async (dirPath, settingsToReplace) => {
  try {
    const buildPath = path.join(dirPath, "build")
    connectionStore.broadcastMessage({
      msg: "Starte Eleventy Build...",
    })
    await replaceSettings(settingsToReplace)
    console.log("between replaced settings", buildPath)
    await rewritePaths(buildPath)
    console.log("after replaced settings")
    const eleventyConfigPath = path.join(buildPath, ".eleventy.js")
    console.log("Eleventy config path:", eleventyConfigPath)
    const srcFolder = path.join(buildPath, "src")
    const siteFolder = path.join(buildPath, "_site")
    // const elev = new Eleventy(srcFolder, siteFolder, {
    //   quietMode: false,
    //   configPath: eleventyConfigPath,
    // })
    exec(
      `npx @11ty/eleventy --input=${srcFolder} --output=${siteFolder} --config=${eleventyConfigPath}`
    )
    console.log("Eleventy build started...")
    // await elev.write()
    console.log("Eleventy build completed successfully.")
    connectionStore.broadcastMessage({
      msg: "Eleventy Build erfolgreich abgeschlossen.",
    })
    // const currentDirectoryName = path.basename(dirPath)
    // const currentDirectoryPath = path.dirname(dirPath)
    // const zipFileName = `${currentDirectoryName}.zip`
    // const zipPath = path.join(currentDirectoryPath, zipFileName)
    // compressDirectory(dirPath, zipPath)
    // connectionStore.broadcastMessage({
    //   msg: `Zip-Datei erfolgreich erstellt: ${zipPath}`,
    //   fileUrl: zipPath,
    // })
  } catch (error) {
    return "Failed to build Eleventy site: " + error.message
  }
}

fastify.post("/compress", async (request, reply) => {
  try {
    const fullPath = request.body.path
    console.log("fullpath:", fullPath)
    const currentDirectoryName = path.basename(fullPath)
    const fileName = `${currentDirectoryName}.zip`
    const outputPath = path.join(fullPath, fileName)

    await compressDirectory(fullPath, outputPath)
    console.log("zip: ", outputPath)
    reply.code(200).send({
      msg: "Zip-Datei erfolgreich erstellt.",
      zipBaseDir: currentDirectoryName,
    })
    // reply
    //   .header("Content-Type", "application/zip")
    //   .header("Content-Disposition", `attachment; filename=${fileName}`)
    //   .send(fs.createReadStream(outputPath))
  } catch (error) {
    reply.code(500).send({ error: "Failed to compress the directory." })
  }
})

const compressDirectory = async (directoryPath, outputPath) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath)
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Sets the compression level.
    })

    // output.on("finish", () => resolve())
    // output.on("end", () => resolve())
    output.on("close", () => resolve())
    archive.on("error", (err) => reject(err))

    archive.pipe(output)
    archive.directory(directoryPath, false)
    archive.finalize()
    console.log("compression finished")
  })
}

fastify.get("/download/:zipBaseDir", async (request, reply) => {
  try {
    const zipBaseDir = request.params.zipBaseDir
    const fileName = `${zipBaseDir}.zip`
    const dirPath = path.join(__dirname, "public", "output")
    const filePath = path.join(dirPath, zipBaseDir, fileName)

    if (!fs.existsSync(filePath)) {
      reply.code(404).send({ error: "File not found." })
      return
    }

    reply
      .header("Content-Type", "application/zip")
      .header("Content-Disposition", `attachment; filename=${fileName}`)
      .send(fs.createReadStream(filePath))
  } catch (error) {
    reply.code(500).send({ error: "Failed to download the file." })
  }
})

fastify.all("/*", async (request, reply) => {
  const folder = path.join(__dirname, ".next")
  if (process.env.NODE_ENV === "production") {
    await serveHandler(reply.raw, request.raw, {
      public: folder,
    })
  } else {
    reply.status(404).send("Not found")
  }
})
// Run the server!
fastify.listen({ port: process.env.PORT || 5000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
