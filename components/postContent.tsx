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
import styles from "../sass/components/Post.module.scss";
import React from "react";
import rehypeRaw from 'rehype-raw'
import LinkWrapper from "./linkWrapper";
import postContentStyles from "../sass/components/PostContent.module.scss"
import AuthorCredits from "./AuthorCredits";
import NextPrevButtons from "./nextPrevButtons";
import { Tweet } from "react-twitter-widgets";
import HorizontalGoogleAd from "./google-ads/HorizontalGoogleAd";
import { PostDataWithNextPrev } from "../interfaces/PostData";

type Props = {
  data: PostDataWithNextPrev;
  twitterUsername: string;
  views: number;
};

const PostContent = ({ data, views, twitterUsername }: Props) => (
  <Columns>
    <Columns.Column size={2}></Columns.Column>
    <Columns.Column size={8}>
      <div className={postContentStyles.postContent}>
        <Container>
          <NextPrevButtons data={data} hideTitles/>
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
                  <Tag key={tag}>
                    <LinkWrapper
                      href={`/tags/${tag}`}
                      key={tag}
                      wrapInAnchor={true}
                    >
                      <div className={postContentStyles.tagListItem}>{tag}</div>
                    </LinkWrapper>
                  </Tag>
                ))}
              </Tag.Group>
              <AuthorCredits authorName={data.AuthorName} twitterUsername={twitterUsername}/>
              <div style={{marginTop: `1.6rem`}}>
                {views !== undefined && (
                  <div className={styles.viewCount}>
                    <img src="/icons/eye1.png" className={styles.viewCountIcon} alt={"View count icon"}/>{" "}
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

          <HorizontalGoogleAd/>

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
              } else if (part.Type == "TWEET_SINGLE") {
                toRender = (
                  <Tweet
                    tweetId={part.Contents}
                    options={{ align: "center", width: "40rem" }}
                  />
                )
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
            <Message.Header>Trending in &quot;{data?.Category}&quot;</Message.Header>
          </Message>

          <Card.Content>No data</Card.Content>
        </Card>
      </Block>
    </Columns.Column>
    <Columns.Column size={2}></Columns.Column>
  </Columns>
);

export default PostContent;
