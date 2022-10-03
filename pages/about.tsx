import React from "react";
import MainWrapper from "../components/mainWrapper";
import { getSiteConfig } from "../util/s3Util";
import Billboard from "../components/billboard";
import { SiteConfig } from "../interfaces/SiteConfig";

type Props = {
  siteConfig: SiteConfig
};

const About = ({
  siteConfig
}: Props) => {
  const AboutParagraphs = (
    <React.Fragment>
      {siteConfig.pageData.about.description}
    </React.Fragment>
  );

  return (
    <MainWrapper
      title={`About`}
      description={`The about page for ${siteConfig.site.name}`}
      siteConfig={siteConfig}
    >
      <Billboard title={"About"} bodyComponent={AboutParagraphs} />
    </MainWrapper>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  const siteConfig = await getSiteConfig();

  return {
    props: {
      siteConfig
    },
  };
}

export default About;
