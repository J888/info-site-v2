import Link from "next/link";
import { Columns } from "react-bulma-components";
import styles from "../sass/components/ImagePostGrid.module.scss";

const ImagePostGrid = ({ posts, heading }) => (
  <Columns>
    <Columns.Column size={3}></Columns.Column>
    <Columns.Column size={7}>
      <h2 className={styles.gridHeading}>{heading}</h2>
      <div className={styles.imagePostGrid}>
        {posts.map((post) => (
          <Link
            href={`/posts/${post.Category}/${post.PostId}`}
            key={post.Title.replace(/\s/g, "")}
            passHref
          >
            <a>
              <div className={styles.gridItem}>
                <img src={post.ImageS3Url} className={styles.image} />

                <h3 className={styles.gridItemTitle}>{post.Title}</h3>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Columns.Column>
    <Columns.Column size={2}></Columns.Column>
  </Columns>
);

export default ImagePostGrid;
