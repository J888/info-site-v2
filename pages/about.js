import React from "react";
import MainWrapper from "../components/mainWrapper";
import { getSiteConfig } from "../util/s3Util";
import Billboard from "../components/billboard";

const About = ({ site, pageData, socialMedia, navLinks }) => {
  
  const AboutParagraphs = 
    <React.Fragment>
      {
        pageData.about.description.map(part => <p>{part}</p>)
      }
    </React.Fragment>

  return (
    <MainWrapper
      twitterUsername={socialMedia.username.twitter}
      pageTitle={`About`}
      siteName={site.name}
      description={`The about page for ${site.name}`}
      navLinks={navLinks}
    >
      <Billboard title={"About"} bodyComponent={AboutParagraphs}/>
    </MainWrapper>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  const siteConfig = await getSiteConfig();
  const { site, pageData, socialMedia } = siteConfig;
  const navLinks = siteConfig.nav.links;

  return {
    props: {
      site, pageData, socialMedia, navLinks
    },
  };
}

export default About;
