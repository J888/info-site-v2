import { Heading, Navbar } from "react-bulma-components";
import Link from "next/link";
import LinkWrapper from "./linkWrapper";
import styles from "../sass/components/PostGrid.module.scss";
import TextColoredBackground from "./textColoredBackground";

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

const PostGrid = ({ posts }) => (
  <div className={styles.postGrid}>
    {posts.map((post) => (
      <PostGridItem
        link={`/posts/${post.Category}/${post.PostId}`}
        imageUrl={post.ImageS3Url}
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
