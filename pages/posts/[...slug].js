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
import PostListWide from "../../components/postListWide";
import React from "react";
import rehypeRaw from 'rehype-raw'
import { getSiteFile } from "../../util/s3Util";
import LinkWrapper from "../../components/linkWrapper";
import postContentStyles from "../../sass/components/PostContent.module.scss"
import useSWR from "swr";
import { getBlogPostsWithPrevNext } from "../../util/dynamoDbUtil";
import AuthorCredits from "../../components/AuthorCredits";

const NextPrevButtons = ({ data }) => 
  <Section className={postContentStyles.nextPrevArticleContainer}>
    {data?.PrevPost?.Slug ? (
      <div>
        <Link href={data?.PrevPost?.Slug}>
          {"< " + data?.PrevPost?.Title}
        </Link>
      </div>
    ) : (
      <p></p>
    )}

    {data?.NextPost?.Slug ? (
      <div>
        <Link href={data?.NextPost?.Slug}>
          {data?.NextPost?.Title + " >"}
        </Link>
      </div>
    ) : (
      <p></p>
    )}
  </Section>

const PostContent = ({ data, views }) => (
  <Columns>
    <Columns.Column size={2}></Columns.Column>
    <Columns.Column size={8}>
      <div className={postContentStyles.postContent}>
        <Container>
          <NextPrevButtons data={data}/>
        </Container>
        {/* <Heading className={postContentStyles.mainTitle}>{data?.Title}</Heading> */}
        <Content>
          <Container className={postContentStyles.imageAndPostInfoContainer}>
            <div className={postContentStyles['imageAndPostInfoContainer-leftSide']}>
              <Image src={data?.ImageS3Url} size={1} alt={data?.Title} />
              <div className={styles.postInfoTagGroupsContainer}>
                <Tag.Group hasAddons className={styles.publishedDateTagGroup}>
                  <Tag color="dark">
                    {new Date(data?.CreatedAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Tag>

                  <Tag>
                    <Link href={`/posts/${data?.Category}`}>
                      {data?.Category?.charAt(0).toUpperCase() + data?.Category?.slice(1)}
                    </Link>
                  </Tag>
                </Tag.Group>
              </div>
            </div>
            <div className={postContentStyles['imageAndPostInfoContainer-rightSide']}>
              <Heading className={postContentStyles.mainTitle}>{data?.Title}</Heading>
              <Tag.Group>
                {data?.Tags?.map((tag) => (
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
                ))}
              </Tag.Group>
              <AuthorCredits authorName={`NFTMusician`} twitterUsername={`NFTMusician`}/>
              <div style={{marginTop: `1.6rem`}}>
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
            </div>
          </Container>
          {/* <Container className={postContentStyles.mainImageContainer}>
            <Image src={data?.ImageS3Url} size={1} alt={data?.Title} />
          </Container> */}
          <Container className={styles.publishedDate}>
            <div className={styles.viewCountDateContainer}>
              {/* <div className={styles.postInfoTagGroupsContainer}>
                <Tag.Group hasAddons className={styles.publishedDateTagGroup}>
                  <Tag color="dark">
                    {new Date(data?.CreatedAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Tag>

                  <Tag>
                    <Link href={`/posts/${data?.Category}`}>
                      {data?.Category?.charAt(0).toUpperCase() + data?.Category?.slice(1)}
                    </Link>
                  </Tag>
                </Tag.Group>
              </div> */}

              
            </div>

          </Container>

          <Section>
            {data?.Parts?.map((part, i) => {
              let toRender;

              if (part.Type == "MARKDOWN") {
                toRender = (
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    className={postContentStyles.mainContent}
                  >
                    {part.Contents}
                  </ReactMarkdown>
                );
              } else if (part.Type == "IMAGE") {
                toRender = (
                  <Container className={postContentStyles.imagePartContainer}>
                    {/* <NextImage
                      objectFit="cover"
                      src={part.Contents}
                      alt="pic alt"
                      height="550"
                      width="700"
                    /> */}

                    <Image src={part.Contents} size={2} alt={`image-part-${i}`} className={postContentStyles.imageInPost} />
                  </Container>
                );
              }

              return (
                <React.Fragment key={`part-${i}`}>{toRender}</React.Fragment>
              );
            })}

            {data?.Parts == undefined && <Section>Post has no content</Section>}
          </Section>
          <NextPrevButtons data={data}/>
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
            <Message.Header>Trending in "{data?.Category}"</Message.Header>
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

  let capitalizedCategory = category?.substring(0,1)?.toUpperCase() + category?.substring(1);
  let pageTitle = postData?.Title !== undefined ? postData?.Title : `Read ${postsByCategory?.length} ${capitalizedCategory} Posts`

  return (
    <MainWrapper pageTitle={pageTitle} siteName={siteConfig?.site?.name} description={postData?.Description} imageUrl={postData?.ImageS3Url}>
      {postData && <PostContent data={postData} views={pageViewData?.views} />}
      {postsByCategory && (
        <PostListWide
          posts={postsByCategory}
          heading={`Read ${postsByCategory.length} '${capitalizedCategory}' posts`}
        />
      )}
      <Block></Block>
    </MainWrapper>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  const postsDynamo = await getBlogPostsWithPrevNext(process.env.BLOG_POSTS_DYNAMO_TABLE_NAME);

  const [category, id] = params.slug;
  const siteConfig = await getSiteFile(process.env.STATIC_FILES_S3_BUCKET, process.env.SITE_FOLDER_S3, `siteConfig.json`);

  if (category && !id) {
    // if no post id is given e.g. /posts/category/
    return {
      props: {
        postsByCategory: postsDynamo.filter((post) => post.Category == category),
        category,
        siteConfig
      },
    };
  }

  return {
    props: {
      postData: postsDynamo.filter((post) => post.PostId == id)[0],
      siteConfig,
      slug: `/posts/${params.slug[0]}/${params.slug[1]}`
    },
  };
}

export async function getStaticPaths() {
  const postsDynamo = await getBlogPostsWithPrevNext(process.env.BLOG_POSTS_DYNAMO_TABLE_NAME);

  return {
    paths: postsDynamo.map((post) => `/posts/${post.Category}/${post.PostId}`) || [],
    fallback: true,
  };
}

export default Post;
