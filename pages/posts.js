import { Columns } from "react-bulma-components";
import React from "react";
import MainWrapper from "../components/mainWrapper";
import { getSiteConfig } from "../util/s3Util";
import PostGrid from "../components/postGrid";
import { getBlogPostsWithPrevNext } from "../util/dynamoDbUtil";

const AllPosts = ({ postsDynamo, siteSubject, siteName, twitterUsername }) => {
  return (
    <MainWrapper
      twitterUsername={twitterUsername}
      pageTitle={`All - ${postsDynamo.length} Results - ${siteSubject}`}
      siteName={siteName}
      description={`A grid of all blog posts available on the website`}
    >
      <Columns>
        <Columns.Column size={1}></Columns.Column>
        <Columns.Column size={7} style={{ width: "100%" }}>
          <PostGrid posts={postsDynamo} heading={`All Posts`}/>
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

  return {
    props: {
      postsDynamo,
      siteSubject,
      siteName,
      twitterUsername,
    },
  };
}

export default AllPosts;
