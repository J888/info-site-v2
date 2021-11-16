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
import useSWR from "swr";

const PostContent = ({ data, views }) => (
  <Columns>
    <Columns.Column size={2}></Columns.Column>
    <Columns.Column size={8}>
      <div className={postContentStyles.postContent}>
        <Heading className={postContentStyles.mainTitle}>{data?.title}</Heading>
        <Content>
          <Container className={postContentStyles.mainImageContainer}>
            {/* <Image src={data?.image?.s3Url} size={2} /> */}
            <NextImage
              objectFit="cover"
              src={data?.image?.s3Url}
              alt={data?.title}
              // layout="fill"
              height="1100"
              width="1100"
              priorty="true"
            />
          </Container>
          <Container className={styles.publishedDate}>
            <div className={styles.viewCountDateContainer}>
              <Tag.Group gapless className={styles.publishedDateTagGroup}>
                <Tag color="info">Published</Tag>
                <Tag>{data?.createdAt}</Tag>
              </Tag.Group>

              {views !== undefined && (
                <div className={styles.viewCount}>
                  <img src="/icons/eye1.png" className={styles.viewCountIcon} />{" "}
                  <span>{views < 1 ? 1 : views}</span>
                </div>
              )}

              {/* placeholder */}
              {views === undefined && (
                <div className={styles.viewCount}>
                  {`Loading views...`}
                </div>
              )}
            </div>

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
                    <div className={postContentStyles.tagListItem}>{tag}</div>
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
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    className={postContentStyles.mainContent}
                  >
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

          <Section className={postContentStyles.nextPrevArticleContainer}>
            {data?.prevPost?.slug ? (
              <div>
                <Link href={data?.prevPost?.slug}>
                  {"< " + data?.prevPost?.title}
                </Link>
              </div>
            ) : (
              <p></p>
            )}

            {data?.nextPost?.slug ? (
              <div>
                <Link href={data?.nextPost?.slug}>
                  {data?.nextPost?.title + " >"}
                </Link>
              </div>
            ) : (
              <p></p>
            )}
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
            <Message.Header>Trending in "{data?.category}"</Message.Header>
          </Message>

          <Card.Content>No data</Card.Content>
        </Card>
      </Block>
    </Columns.Column>
    <Columns.Column size={2}></Columns.Column>
  </Columns>
);

const Post = ({ postData, postsByCategory, category, siteConfig, slug }) => {

  const { data: pageViewData, error } = useSWR(
    `/api/page-views?slug=${encodeURIComponent(slug)}`,
    async (url) => {
      const res = await fetch(url);
      return res.json();
    }
  );
  
  return (
    <MainWrapper pageTitle={`${postData?.title}`} siteName={siteConfig?.site?.name} description={postData?.description} imageUrl={postData?.image?.s3Url}>
      {postData && <PostContent data={postData} views={pageViewData?.views} />}
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
      postData: posts.filter((post) => post.id == id)[0],
      siteConfig,
      slug: `/posts/${params.slug[0]}/${params.slug[1]}`
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
