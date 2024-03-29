const fp = require("fastify-plugin")
const fs = require("fs-extra")
const path = require("path")
const sanitize = require("sanitize-filename")

// Route für den Upload von Dokumenten
async function uploadRoute(fastify, options) {
	fastify.post("/upload", {
		// Swagger-Schema-Definition auf Deutsch
		schema: {
			description: "Dokument hochladen",
			tags: ["Datei-Upload"],
			summary: "Lädt ein Dokument auf den Server hoch",

			response: {
				200: {
					description: "Erfolgreicher Upload",
					type: "object",
					properties: {
						message: { type: "string", description: "Nachricht" },
						status: { type: "string", description: "Status" },
						path: { type: "string", description: "Pfad" },
						filename: { type: "string", description: "Dateiname" },
					},
				},
				500: {
					description: "Upload fehlgeschlagen",
					type: "object",
					properties: {
						message: { type: "string", description: "Fehlermeldung" },
					},
				},
			},
		},
		handler: async function (request, reply) {
			const { PUBLIC_DIR } = options
			try {
				// Startet Upload-Prozess und informiert Clients
				fastify.connectionStore.broadcastMessage({
					msg: "Dokument wird hochgeladen...",
				})
				const file = await request.file()
				console.log("file", file.file)
				if (!file) {
					throw new Error("No file uploaded")
				}
				console.log("mime", file.mimetype)
				// Überprüft, ob die Datei ein Word-Dokument ist
				if (
					file.mimetype !==
					"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
				) {
					throw new Error("Invalid file type")
				}

				// Ermittelt den Dateinamen und erstellt den Upload-Ordner
				const nameWithoutExt = sanitize(path.parse(file.filename).name)
				const dir = `output/${nameWithoutExt}`

				const uploadDir = path.join(PUBLIC_DIR, dir)
				if (!fs.existsSync(uploadDir)) {
					fs.mkdirSync(uploadDir, { recursive: true })
				}

				// Speichert die Datei im Upload-Ordner
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
		},
	})
}

module.exports = fp(uploadRoute)
