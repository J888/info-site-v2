import { Columns } from "react-bulma-components";
import React from "react";
import MainWrapper from "../components/mainWrapper";
import { getSiteConfig } from "../util/s3Util";
import PostGrid from "../components/postGrid";
import { getBlogPostsWithPrevNext } from "../util/dynamoDbUtil";
import { PostDataWithNextPrev } from "../interfaces/PostData";
import { NavBackground, NavLink } from "../interfaces/Nav";

type Props = {
  footerTagline: string;
  navBackground: NavBackground;
  navLinks: Array<NavLink>;
  navLogoUrl: string;
  postsDynamo: Array<PostDataWithNextPrev>;
  siteName: string;
  siteSubject: string;
  twitterUsername: string;
}

const AllPosts = ({
  postsDynamo,
  siteSubject,
  siteName,
  twitterUsername,
  navLinks,
  navLogoUrl,
  navBackground,
  footerTagline,
}: Props) => {
  return (
    <MainWrapper
      twitterUsername={twitterUsername}
      pageTitle={`All - ${postsDynamo.length} Results - ${siteSubject}`}
      siteName={siteName}
      description={`A grid of all blog posts available on the website`}
      navLinks={navLinks}
      navLogoUrl={navLogoUrl}
      navBackground={navBackground}
      footerTagline={footerTagline}
    >
      <Columns>
        <Columns.Column size={1}></Columns.Column>
        <Columns.Column size={7} style={{ width: "100%" }}>
          <PostGrid posts={postsDynamo} heading={`All Posts`} />
        </Columns.Column>
        <Columns.Column size={3}></Columns.Column>
      </Columns>
    </MainWrapper>
  );
};

export async function getStaticProps() {
  const postsDynamo = await getBlogPostsWithPrevNext(
    process.env.BLOG_POSTS_DYNAMO_TABLE_NAME
  );
  const siteConfig = await getSiteConfig();
  const twitterUsername = siteConfig.socialMedia.username.twitter;
  const siteSubject = siteConfig.site.subject;
  const siteName = siteConfig.site.name;
  const navLinks = siteConfig.nav.links;
  const navLogoUrl = siteConfig.nav.logoUrl;
  const navBackground = siteConfig.nav.background;
  const footerTagline = siteConfig.footer.tagline;

  return {
    props: {
      postsDynamo,
      siteSubject,
      siteName,
      twitterUsername,
      navLinks,
      navLogoUrl,
      navBackground,
      footerTagline,
    },
  };
}

export default AllPosts;
