import { Columns, Heading } from "react-bulma-components";
import React from "react";
import MainWrapper from "../components/mainWrapper";
import { getSiteFile } from "../util/s3Util";
import Billboard from "../components/billboard";

const About = ({ siteConfig }) => {
  const { site, pageData} = siteConfig;
  return (
    <MainWrapper pageTitle={`About`} siteName={site.name} description={`The about page for ${site.name}`}>
      <Billboard
        title={"About"}
        body={pageData.about.description}
      />
    </MainWrapper>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  const siteConfig = await getSiteFile(process.env.STATIC_FILES_S3_BUCKET, process.env.SITE_FOLDER_S3, `siteConfig.json`);

  return {
    props: {
      siteConfig
    },
  };
}

export default About;
