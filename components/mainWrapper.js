import Head from "next/head";
import { Block } from "react-bulma-components";
import Nav from "./navbar";
import Footer from "./footer";
import styles from "../sass/components/MainWrapper.module.scss"

export default function MainWrapper(props) {

  return (
    <div>
      <Head>
        <title>{props.pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />

        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"true"}/>

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />{" "}
        {/* needed for react bootstrap responsiveness */}

        <meta name="description" content={props.description}/>

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

      <Nav
        siteName={props.siteName}
        twitterUsername={props.twitterUsername}
        navLinks={props.navLinks}
        navLogoUrl={props.navLogoUrl}
        background={props.navBackground}
      />
      <Block/>
      <main className={styles.mainSection}>
        {props.children}
      </main>

      <Footer
        logoUrl={props.navLogoUrl}
        twitterUsername={props.twitterUsername}
        tagline={props.footerTagline}
      />
    </div>
  );
}
