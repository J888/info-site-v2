import { Heading, Navbar, Tag } from "react-bulma-components";
import Link from "next/link";
import LinkWrapper from "./linkWrapper";
import styles from "../sass/components/PostGrid.module.scss";
import TextColoredBackground from "./textColoredBackground";
import { firstWords } from "../util/textUtil";

const PostGridItem = ({ link, imageUrl, title, category, createdAt }) => (
  <article className={styles.gridItem}>
    <div className={styles.imageWrapper}>
      <Link href={link} passHref>
        <a>
          <img src={imageUrl} alt={title}></img>
        </a>
      </Link>
    </div>

    <div className={styles.gridItemText}>
      <Link href={link} passHref>
        <a>
          <div className={styles.gridItemTextMeta}>
            <TextColoredBackground>
              {category}
            </TextColoredBackground>

            <span style={{marginLeft: '0.5rem'}}>
              {new Date(createdAt).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            {/* {category} |{" "}
            {new Date(createdAt).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "} */}
          </div>
        </a>
      </Link>

      <Link href={link} passHref>
        <a>
          <h3 className={styles.gridItemTextTitle}>{title}</h3>
        </a>
      </Link>
    </div>
  </article>
);

const PostGridItemV2 = ({ description, link, imageUrl, tags, title, category, createdAt }) => (
  <article className={styles.gridItem}>
    <div className={styles.imageWrapper}>
      <Link href={link} passHref>
        <a>
          <img src={imageUrl} alt={title}></img>
        </a>
      </Link>
    </div>

    <div className={styles.postGridItemV2TextContent}>
      <div className={styles.gridItemV2CatAndDateContainer}>
        <span className={styles.gridItemV2PublishedDate}>
          {new Date(createdAt).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
        <TextColoredBackground>
          {category}
        </TextColoredBackground>
      </div>

      <div>
        <h3 className={styles.gridItemTextTitleV2}>{firstWords(title, 14)}{`...`}</h3>

      </div>

      <div className={styles.gridItemTextV2}>
        <Link href={link} passHref>
          <a>
            <p className={styles.gridItemTextDescV2}>{firstWords(description, 14)}{`...`}</p>
          </a>
        </Link>
        <Link href={link} passHref>
          <div className={styles.gridItemTextMetaV2}>
            <Tag.Group className={styles.postGridItemV2TagGroup}>
              {tags.map((tag) => (
                <Tag clickable key={tag}>
                  <LinkWrapper wrapInAnchor={true} href={`/tags/${tag}`}>
                    #{tag}
                  </LinkWrapper>
                </Tag>
              ))}
            </Tag.Group>
          </div>
        </Link>
      </div>
    </div>
  </article>
);

const PostGrid = ({ posts }) => (
  <div className={styles.postGrid}>
    {posts.map((post) => (
      <PostGridItemV2
        description={post.Description}
        link={`/posts/${post.Category}/${post.PostId}`}
        imageUrl={post.ImageS3Url}
        tags={post.Tags?.slice(0,4).filter(t => t.length <= 17)}
        title={post.Title}
        category={post.Category?.charAt(0).toUpperCase() + post.Category?.slice(1)}
        createdAt={post.CreatedAt}
        key={post.PostId}
      />
    ))}

    {/* <PostGridItem />
    <PostGridItem /> */}
  </div>
);

export default PostGrid;
