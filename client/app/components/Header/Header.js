"use client"

import React from "react"
import styles from "./Header.module.css"
import { createComponent } from "@lit-labs/react"
import { Header as HeaderWC } from "../melange/components/Header/Header"
import { NavMain as NavMainWC } from "../melange/components/NavMain/NavMain"

const Header = createComponent({
  react: React,
  tagName: "wc-header",
  elementClass: HeaderWC,
})
const NavMain = createComponent({
  react: React,
  tagName: "wc-nav-main",
  elementClass: NavMainWC,
})

const HeaderComponent = () => {
  return (
    <header className="wm-site-header js-wm-site-header wm-site-header--no-margin">
      <div className="wm-skip-links js-wm-skip-links wm-h-vh">
        <a href="#content" className="wm-btn wm-btn--small js-wm-skip-link">
          Zum Inhalt springen
        </a>
        <a
          href="https://www.wien.gv.at/info/barrierefreiheit.html"
          className="wm-btn wm-btn--small wm-btn--i js-wm-skip-link"
        >
          Barrierefreiheit auf wien.gv.at
        </a>
      </div>
      <div className="wm-site-header__inner">
        <div className="wm-site-header__title">
          <a href="/" className="wm-link--unstyled">
            Microsite Title
          </a>
        </div>
        <span className="wm-site-header__logo">
          <a
            className="wm-site-header__logo-link"
            href="/pattern-library/templates/startseite/"
          >
            <span className="wm-h-vh">Startseite wien.gv.at</span>
            <svg
              viewBox="0 0 311 142"
              width="80"
              className="wm-logo"
              aria-hidden="true"
              focusable="false"
            >
              <path
                className="wm-logo__image"
                fill="#FF0000"
                d="M55.3 53.6V15.3H14.2c0 13.3 1 26.2 2.9 38.3h38.2zM55.3 65.7h-36c6.9 32.7 20.2 57.1 36 62.2V65.7zM67.3 53.6V15.3h41.1c0 13.3-1 26.2-2.9 38.3H67.3zM67.3 65.7h36c-6.9 32.7-20.2 57.1-36 62.2V65.7z"
              />
              <path
                className="wm-logo__text"
                fill="#292929"
                d="M153.5 65.2c-2.4 0-4.7-.3-6.9-1s-4.4-1.7-6.6-3.1l1.3-8.4h.3c2.1 1.6 4.1 2.7 6.2 3.3 2.1.6 4 .9 5.7.9 5 0 7.5-1.9 7.5-5.6 0-1.3-.4-2.5-1.1-3.5-.7-1-2-2.1-3.8-3.1l-6-3.4c-3.5-1.9-5.9-4-7.4-6.2s-2.2-4.7-2.2-7.4c0-4.2 1.4-7.5 4.2-9.9 2.8-2.4 6.6-3.6 11.3-3.6 4.3 0 8.3 1.1 11.9 3.2l-1.3 8.1h-.3c-1.4-1-3-1.7-4.9-2.2-1.9-.5-3.6-.7-5.3-.7-4.4 0-6.6 1.7-6.6 5 0 1.2.4 2.3 1.1 3.3.8 1 2.2 2.1 4.4 3.3l5.3 2.9c3.3 1.8 5.8 3.8 7.3 6s2.3 4.8 2.3 7.8c0 4.5-1.5 8-4.5 10.6-2.8 2.5-6.8 3.7-11.9 3.7zM183.8 64c-1.6-2.2-2.7-4.6-3.5-7.4-.8-2.8-1.2-6-1.2-9.5V39h-5.7v-7.6h5.7v-9.7h9v9.7h7.7l-1.3 7.6H188v7.4c0 3.7.5 6.9 1.5 9.6 1 2.7 2.4 5.3 4.3 7.6v.4h-10zM209 64.6c-3.2 0-5.7-.8-7.5-2.5-1.9-1.7-2.8-4-2.8-7.1 0-3.1 1.1-5.5 3.2-7.3 2.2-1.8 5.1-2.8 8.8-3.2l9.1-.9v-.1c0-1.8-.5-3.1-1.5-4-1-.9-2.8-1.4-5.4-1.4-1.9 0-3.9.2-5.9.7-2 .5-3.6 1-4.8 1.6h-.4l1.3-7.7c1.4-.6 3.1-1 5.1-1.5 2-.4 4.2-.6 6.4-.6 4.9 0 8.5 1.1 10.8 3.4 2.3 2.3 3.4 5.6 3.4 10v10.4c0 1.7.1 3.4.4 5 .2 1.6.6 3 1.2 4.2v.4h-8.5c-.3-.6-.5-1.5-.7-2.4-.2-1-.3-1.9-.4-2.7h-.4c-.8 1.6-2.3 2.9-4.3 4s-4.4 1.7-7.1 1.7zm-1.1-10.3c0 1 .3 1.8.9 2.4.6.6 1.7 1 3.1 1 2.3 0 4.1-.7 5.6-2s2.2-3.1 2.2-5.2v-.8l-6.9.8c-1.7.2-3 .6-3.8 1.1-.7.6-1.1 1.5-1.1 2.7zM260.9 64v-4.9h-.4c-1 1.8-2.4 3.2-4.3 4.2s-4 1.5-6.4 1.5c-2.9 0-5.4-.7-7.6-2.1-2.2-1.4-3.9-3.4-5.1-6-1.2-2.6-1.8-5.6-1.8-9 0-3.4.6-6.4 1.8-9 1.2-2.6 2.9-4.5 5.1-6 2.2-1.4 4.7-2.1 7.6-2.1 2.2 0 4.2.4 6 1.3 1.8.9 3.2 2.1 4.2 3.6h.5V15.3h9.1V64h-8.7zm-8.1-7c2.5 0 4.4-.9 5.9-2.6 1.5-1.7 2.2-4 2.2-6.7 0-2.8-.7-5.1-2.2-6.7-1.5-1.7-3.5-2.5-5.9-2.5-2.5 0-4.5.8-5.9 2.5-1.5 1.6-2.2 3.9-2.2 6.8 0 2.8.7 5.1 2.2 6.7 1.4 1.6 3.3 2.5 5.9 2.5zM284.9 64c-1.6-2.2-2.7-4.6-3.5-7.4-.8-2.8-1.2-6-1.2-9.5V39h-5.7v-7.6h5.7v-9.7h9v9.7h7.7l-1.3 7.6h-6.4v7.4c0 3.7.5 6.9 1.5 9.6 1 2.7 2.4 5.3 4.3 7.6v.4h-10.1zM161.6 126.1h-11c-1.1-2.4-2.3-5.4-3.5-9-1.3-3.6-2.5-7.5-3.6-11.9-1.2-4.4-2.2-8.9-3.1-13.7-.9-4.7-1.5-9.4-1.8-14.1h9.9c.3 4.3.9 8.8 1.7 13.5.8 4.7 1.7 9.2 2.8 13.7 1.1 4.4 2.2 8.5 3.4 12.2h.5l9.9-33h7.3l9.9 33h.5c1.2-3.7 2.3-7.8 3.3-12.2 1-4.4 1.9-9 2.7-13.7.8-4.7 1.3-9.2 1.7-13.5h9.7c-.3 4.7-1 9.4-1.8 14.1-.9 4.7-1.9 9.3-3.1 13.7-1.2 4.4-2.4 8.3-3.6 11.9-1.3 3.6-2.4 6.6-3.5 9h-11l-8.2-27.4h-.7l-8.4 27.4zM213.1 88.3c-1.7 0-3.1-.5-4.2-1.6s-1.6-2.4-1.6-4 .5-3 1.6-4 2.5-1.6 4.2-1.6c1.7 0 3.1.5 4.2 1.6 1.1 1 1.6 2.4 1.6 4s-.5 2.9-1.6 4c-1.1 1-2.5 1.6-4.2 1.6zm-4.6 37.8V93.4h9.1v32.7h-9.1zM241.4 126.9c-3.6 0-6.6-.7-9.2-2.1-2.6-1.4-4.6-3.4-5.9-5.9-1.4-2.6-2.1-5.5-2.1-9 0-3.6.7-6.7 2.2-9.3 1.5-2.6 3.5-4.6 6-5.9 2.6-1.4 5.5-2.1 8.7-2.1 4.8 0 8.5 1.5 11.2 4.4 2.7 2.9 4 7 4 12.2v2l-22.5 2.5c.6 2 1.7 3.4 3.2 4.2 1.6.8 3.5 1.2 5.7 1.2 2.1 0 4.2-.3 6.4-.8 2.1-.6 3.7-1.2 4.8-1.9h.5l-1.3 7.8c-1.2.6-2.9 1.2-5.1 1.8-2.1.6-4.3.9-6.6.9zm-.5-27c-2 0-3.7.6-5 1.9-1.3 1.2-2.1 3.1-2.4 5.6l13.9-1.6c-.3-2-1-3.5-2.1-4.4-1.3-1-2.7-1.5-4.4-1.5zM262.6 126.1V93.4h8.2V99h.4c.8-1.9 2.2-3.4 4.1-4.6 1.9-1.1 4.1-1.7 6.6-1.7 3.8 0 6.8 1.3 9 3.8s3.3 6.1 3.3 10.6v19.1h-9.1v-17.9c0-5.1-2.1-7.7-6.3-7.7-2.1 0-3.8.8-5.1 2.3-1.3 1.5-1.9 3.5-1.9 6v17.3h-9.2z"
              />
            </svg>
          </a>
        </span>
      </div>
      <div
        data-wm-nav-main-wrapper
        className="wm-nav-wrapper wm-nav-wrapper--init  wm-nav-wrapper--h wm-nav-wrapper--flieder "
      >
        <div className="wm-nav-wrapper__inner wm-nav-wrapper__inner--h">
          <nav
            className="wm-nav-main  wm-nav-main--h"
            data-wm-nav-main="true"
            aria-labelledby="mainnav_title"
          >
            <span hidden id="mainnav_title">
              Hauptmenü
            </span>
            <a
              href="/pattern-library/pages/inhalt/menue/"
              className="wm-nav-main__toggle wm-nav-main-btn"
              data-wm-nav-main-toggle
            >
              <span className="wm-nav-main-btn__text wm-nav-main-btn__text--burger wm-h-vh wm-nav-main-btn__text--hidden">
                Menü
              </span>
              <span>
                {/* <svg
                  className="wm-icon wm-nav-main-btn__icon wm-nav-main-btn__icon--open"
                  width="28"
                  height="28"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use xlink:href="/assets/130/icons/svg/sprite.symbol.svg#burger" />
                </svg>
                <svg
                  className="wm-icon wm-nav-main-btn__icon wm-nav-main-btn__icon--close"
                  width="28"
                  height="28"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use xlink:href="/assets/130/icons/svg/sprite.symbol.svg#close" />
                </svg> */}
              </span>
            </a>
            <div className="wm-nav-main__header" data-wm-nav-main-header></div>
            <div
              className="wm-nav-main__inner"
              data-wm-nav-main-inner
              tabIndex="-1"
            >
              <div className="wm-nav-main__content" id="nav_content">
                <div className="wm-nav-main__lists">
                  <ol className="wm-nav-main__list wm-nav-main__list--1 ">
                    <li>
                      <a href="/#ebook" className="wm-nav-main__link">
                        <span>eBook</span>
                      </a>
                    </li>
                    <li>
                      <a href="/#eaudio" className="wm-nav-main__link">
                        <span>eAudio</span>
                      </a>
                    </li>
                    <li>
                      <a href="/#emagazine" className="wm-nav-main__link">
                        <span>eMagazine</span>
                      </a>
                    </li>
                    <li>
                      <a href="/#ePaper" className="wm-nav-main__link">
                        <span>ePaper</span>
                      </a>
                    </li>
                    <li>
                      <a href="/#eLlarning" className="wm-nav-main__link">
                        <span>eLearning</span>
                      </a>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default HeaderComponent
