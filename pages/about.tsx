import React from "react";
import MainWrapper from "../components/mainWrapper";
import { getSiteConfig } from "../util/s3Util";
import Billboard from "../components/billboard";
import { NavBackground, NavLink } from "../interfaces/Nav";

type Props = {
  footerTagline: string;
  navBackground: NavBackground;
  navLinks: Array<NavLink>;
  navLogoUrl: string;
  pageData: {
    about: {
      description: Array<string>;
    };
  };
  site: {
    name: string;
  };
  socialMedia: {
    username: {
      twitter: string;
    };
  };
};

const About = ({
  site,
  pageData,
  socialMedia,
  navLinks,
  navLogoUrl,
  footerTagline,
  navBackground,
}: Props) => {
  const AboutParagraphs = (
    <React.Fragment>
      {pageData.about.description.map((part, i) => (
        <p key={`part-${i}`}>{part}</p>
      ))}
    </React.Fragment>
  );

  return (
    <MainWrapper
      twitterUsername={socialMedia.username.twitter}
      pageTitle={`About`}
      siteName={site.name}
      description={`The about page for ${site.name}`}
      navLinks={navLinks}
      navLogoUrl={navLogoUrl}
      footerTagline={footerTagline}
      navBackground={navBackground}
    >
      <Billboard title={"About"} bodyComponent={AboutParagraphs} />
    </MainWrapper>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  const siteConfig = await getSiteConfig();
  const { site, pageData, socialMedia } = siteConfig;
  const navLinks = siteConfig.nav.links;
  const navLogoUrl = siteConfig.nav.logoUrl;
  const footerTagline = siteConfig.footer.tagline;
  const navBackground = siteConfig.nav.background;

  return {
    props: {
      site,
      pageData,
      socialMedia,
      navLinks,
      navLogoUrl,
      footerTagline,
      navBackground,
    },
  };
}

export default About;
