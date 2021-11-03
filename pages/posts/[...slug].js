import MainWrapper from "../../components/mainWrapper";
import {
  Block,
  Card,
  Columns,
  Container,
  Content,
  Heading,
  Image,
  Message,
  Section,
  Tag,
} from "react-bulma-components";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import NextImage from "next/image";
import styles from "../../sass/components/Post.module.scss";
import { getPostsS3 } from "../../util/getPosts";
import PostListWide from "../../components/postListWide";
import React from "react";
import rehypeRaw from 'rehype-raw'
import { getSiteFile } from "../../util/s3Util";
import LinkWrapper from "../../components/linkWrapper";
import postContentStyles from "../../sass/components/PostContent.module.scss"

const PostContent = ({ data }) => (
  <Columns>
    <Columns.Column size={2}></Columns.Column>
    <Columns.Column size={8}>
      <div className={postContentStyles.postContent}>
        <Heading className={postContentStyles.mainTitle}>{data?.title}</Heading>
        <Content>
          <Container>
            <Image src={data?.image?.s3Url} size={2} />
          </Container>
          <Container className={styles.publishedDate}>
            <Tag.Group gapless>
              <Tag color="info">Published</Tag>
              <Tag>{data?.createdAt}</Tag>
            </Tag.Group>
            <Tag.Group>
              {data?.tags?.map((tag) => (
                // <LinkWrapper href={`/tags/${tag}`} key={tag} wrapInAnchor={true}>
                <Tag key={tag} clickable>
                  <LinkWrapper
                    href={`/tags/${tag}`}
                    key={tag}
                    wrapInAnchor={true}
                  >
                    {/* {tag} */}
                    <div className={postContentStyles.tagListItem}>
                      {tag}
                    </div>
                  </LinkWrapper>
                </Tag>

                // </LinkWrapper>
              ))}
            </Tag.Group>
          </Container>

          <Section>
            {data?.parts?.map((part, i) => {
              let toRender;

              if (part.type == "MARKDOWN") {
                toRender = (
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}  className={postContentStyles.mainContent}>
                    {part.fileContents}
                  </ReactMarkdown>
                );
              } else if (part.type == "IMAGE") {
                toRender = (
                  <Container>
                    <NextImage
                      objectFit="cover"
                      src={part.s3Url}
                      alt="pic alt"
                      height="550"
                      width="700"
                    />
                  </Container>
                );
              }

              return (
                <React.Fragment key={`part-${i}`}>{toRender}</React.Fragment>
              );
            })}

            {data?.parts == undefined && <Section>Post has no content</Section>}
          </Section>
        </Content>
      </div>

      <Block>
        <Card>
          <Message>
            <Message.Header>Related</Message.Header>
          </Message>

          <Card.Content>No data</Card.Content>
        </Card>
      </Block>

      <Block>
        <Card>
          <Message>
            <Message.Header>Trending Now</Message.Header>
          </Message>

          <Card.Content>No data</Card.Content>
        </Card>
      </Block>
    </Columns.Column>
    <Columns.Column size={2}></Columns.Column>
  </Columns>
);

const Post = ({ data, postsByCategory, category, siteConfig }) => {
  return (
    <MainWrapper pageTitle={`page ${data?.title}`} siteName={siteConfig?.site?.name}>
      {data && <PostContent data={data} />}
      {postsByCategory && (
        <PostListWide
          posts={postsByCategory}
          heading={`${postsByCategory.length} posts with category '${category}'`}
        />
      )}
      <Block></Block>
    </MainWrapper>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  const posts = await getPostsS3(process.env.STATIC_FILES_S3_BUCKET, process.env.SITE_FOLDER_S3);
  console.log(posts[0].parts)
  const [category, id] = params.slug;
  const siteConfig = await getSiteFile(process.env.STATIC_FILES_S3_BUCKET, process.env.SITE_FOLDER_S3, `siteConfig.json`);

  if (category && !id) {
    // if no post id is given e.g. /posts/category/
    return {
      props: {
        postsByCategory: posts.filter((post) => post.category == category),
        category,
        siteConfig
      },
    };
  }

  
  return {
    props: {
      data: posts.filter((post) => post.id == id)[0],
      siteConfig
    },
  };
}

export async function getStaticPaths() {
  const posts = await getPostsS3(process.env.STATIC_FILES_S3_BUCKET, process.env.SITE_FOLDER_S3);

  return {
    paths: posts.map((post) => `/posts/${post.category}/${post.id}`) || [],
    fallback: true,
  };
}

export default Post;
