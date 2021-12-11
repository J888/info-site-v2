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


        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Lato&display=swap" rel="stylesheet"></link>

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />{" "}
        {/* needed for react bootstrap responsiveness */}
        {/* <style data-href="https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap">
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap');
        </style> */}

        <meta property="og:title" content={props.pageTitle}/>
        <meta property="og:description" content={props.description}/>
        { props.imageUrl && <meta property="og:image" content={props.imageUrl}/> }

        <meta name="twitter:title" content={props.pageTitle}/>
        <meta name="twitter:description" content={props.description}/>
        { props.imageUrl && <meta name="twitter:image" content={props.imageUrl}/> }

        <meta name="twitter:card" content="summary_large_image"/> {/* The card type . . . one of “summary”, “summary_large_image”, “app”, or “player”. */}

        {/* <!--  Non-Essential, But Recommended --> */}
        <meta property="og:site_name" content={props.siteName}/>
        <meta name="twitter:image:alt" content={`${props.pageTitle} image`}/>
      </Head>

      <Nav siteName={props.siteName}/>
      <Block/>
      <main className={styles.mainSection}>
        {props.children}
      </main>

      <footer className={styles.footer}>
        <div>{`© ${new Date().getFullYear()} | Powered by NextJS`}</div>
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
