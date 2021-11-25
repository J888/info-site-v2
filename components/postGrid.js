import { Heading, Navbar } from "react-bulma-components";
import Link from "next/link";
import LinkWrapper from "./linkWrapper";
import styles from "../sass/components/PostGrid.module.scss";

const PostGridItem = ({ link, imageUrl, title, category, createdAt }) => (
  <article className={styles.gridItem}>
    <div className={styles.imageWrapper}>
      <Link href={link} passHref>
        <a>
          <img src={imageUrl}></img>
        </a>
      </Link>
    </div>

    <div className={styles.gridItemText}>
      <Link href={link} passHref>
        <a>
          <div className={styles.gridItemTextMeta}>
            {category} |{" "}
            {new Date(createdAt).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
          </div>
        </a>
      </Link>

      <Link href={link} passHref>
        <a>
          <h1 className={styles.gridItemTextTitle}>{title}</h1>
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
