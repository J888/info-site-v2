// import { Button } from "bootstrap";
import Head from "next/head";
import { Block } from "react-bulma-components";
import Nav from "./navbar";
// import styles from "../sass/components/MainWrapper.scss"

import styles from "../styles/Home.module.css";
import { SocialIcon } from "react-social-icons";

export default function MainWrapper(props) {

  return (
    <div>
      <Head>
        <title>{props.pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <link
            href="https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap"
            rel="stylesheet"
          />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />{" "}
        {/* needed for react bootstrap responsiveness */}
        {/* <style data-href="https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap">
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap');
        </style> */}
      </Head>

      <Nav siteName={props.siteName}/>
      <Block/>
      <main className={styles.mainSection}>
        {props.children}
      </main>

      <footer className={styles.footer}>
        <div>{'© 2021'}</div>
        <div className={styles.twitterIcon}>
          <SocialIcon
            url="https://twitter.com/NFTmusician"
            bgColor={"rgb(77, 77, 77)"}
            style={{ height: 26, width: 26 }}
          />
        </div>
      </footer>
    </div>
  );
}
