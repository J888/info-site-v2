import { Columns } from "react-bulma-components";
import React from "react";
import MainWrapper from "../components/mainWrapper";
import { getSiteConfig } from "../util/s3Util";
import PostGrid from "../components/postGrid";
import { getBlogPostsWithPrevNext } from "../util/dynamoDbUtil";
import { PostDataWithNextPrev } from "../interfaces/PostData";
import { SiteConfig } from "../interfaces/SiteConfig";

type Props = {
  postsDynamo: Array<PostDataWithNextPrev>;
  siteSubject: string;
  siteConfig: SiteConfig;
}

const AllPosts = ({
  postsDynamo,
  siteSubject,
  siteConfig
}: Props) => {
  return (
    <MainWrapper
      title={`All - ${postsDynamo.length} Results - ${siteSubject}`}
      description={`A grid of all blog posts available on the website`}
      siteConfig={siteConfig}
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
  const siteSubject = siteConfig.site.subject;

  return {
    props: {
      postsDynamo,
      siteSubject,
      siteConfig
    },
  };
}

export default AllPosts;
