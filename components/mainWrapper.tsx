import Head from "next/head";
import { Block } from "react-bulma-components";
import Nav from "./navbar";
import Footer from "./footer";
import styles from "../sass/components/MainWrapper.module.scss"
import { ReactNode } from "react";
import { SiteConfig } from "../interfaces/SiteConfig";

type Props = {
  children?: ReactNode;
  description: string;
  siteConfig: SiteConfig,
  title: string;
};

export default function MainWrapper({ children, siteConfig, title, description }: Props) {
  const {
    faviconUrl,
    footer: {
      tagline: footerTagline
    },
    site: { name: siteName },
    nav: {
      background: navBackground,
      links: navLinks,
      logoUrl: navLogoUrl
    },
    socialMedia: {
      username: {
        twitter: twitterUsername
      }
    }
  } = siteConfig;

  return (
    <div>
      <Head>
        <title>{title}</title>
        <link rel="icon" href={faviconUrl} />

        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"true"}/>

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />{" "}
        {/* needed for react bootstrap responsiveness */}

        <meta name="description" content={description}/>

        <meta property="og:title" content={title}/>
        <meta property="og:description" content={description}/>
        {/* { props.imageUrl && <meta property="og:image" content={props.imageUrl}/> } */}

        <meta name="twitter:title" content={title}/>
        <meta name="twitter:description" content={description}/>
        {/* { props.imageUrl && <meta name="twitter:image" content={props.imageUrl}/> } */}

        <meta name="twitter:card" content="summary_large_image"/> {/* The card type . . . one of “summary”, “summary_large_image”, “app”, or “player”. */}

        {/* <!--  Non-Essential, But Recommended --> */}
        <meta property="og:site_name" content={siteName}/>
        <meta name="twitter:image:alt" content={`${title} image`}/>
      </Head>

      <Nav
        navLinks={navLinks}
        navLogoUrl={navLogoUrl}
        background={navBackground}
        siteName={siteName}
      />
      <Block/>
      <main className={styles.mainSection}>
        {children}
      </main>

      <Footer
        logoUrl={navLogoUrl}
        twitterUsername={twitterUsername}
        tagline={footerTagline}
        siteName={siteName}
      />
    </div>
  );
}
