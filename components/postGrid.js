import Link from "next/link";
import styles from "../sass/components/PostGrid.module.scss";
import TextColoredBackground from "./textColoredBackground";
import PostGridItemV2 from "./postGridItemV2";
import React from "react";

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

const PostGrid = ({ posts, heading, subHeading }) => (
  <React.Fragment>
    {heading && <h2 className={styles.heading}>{heading}</h2>}
    {subHeading && <p>{subHeading}</p>}
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
  </div>
  </React.Fragment>
  
);

export default PostGrid;
