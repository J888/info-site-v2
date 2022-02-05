import React from "react";
import MainWrapper from "../components/mainWrapper";
import { getSiteConfig } from "../util/s3Util";
import Billboard from "../components/billboard";

const About = ({ site, pageData, socialMedia, navLinks, navLogoUrl }) => {
  
  const AboutParagraphs = 
    <React.Fragment>
      {
        pageData.about.description.map(part, i => <p key={`part-${i}`}>{part}</p>)
      }
    </React.Fragment>

  return (
    <MainWrapper
      twitterUsername={socialMedia.username.twitter}
      pageTitle={`About`}
      siteName={site.name}
      description={`The about page for ${site.name}`}
      navLinks={navLinks}
      navLogoUrl={navLogoUrl}
    >
      <Billboard title={"About"} bodyComponent={AboutParagraphs}/>
    </MainWrapper>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  const siteConfig = await getSiteConfig();
  const { site, pageData, socialMedia } = siteConfig;
  const navLinks = siteConfig.nav.links;
  const navLogoUrl = siteConfig.nav.logoUrl;

  return {
    props: {
      site, pageData, socialMedia, navLinks, navLogoUrl
    },
  };
}

export default About;
