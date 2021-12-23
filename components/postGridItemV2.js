import { Tag } from "react-bulma-components";
import Link from "next/link";
import LinkWrapper from "./linkWrapper";
import styles from "../sass/components/PostGrid.module.scss";
import TextColoredBackground from "./textColoredBackground";
import { firstWordsWithEllipses } from "../util/textUtil";

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

      <Link href={link} passHref>
        <a>
          <h3 className={styles.gridItemTextTitleV2}>{firstWordsWithEllipses(title, 14)}</h3>
        </a>
      </Link>

      <div className={styles.gridItemTextV2}>
        <Link href={link} passHref>
          <a>
            <p className={styles.gridItemTextDescV2}>{firstWordsWithEllipses(description, 14)}</p>
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

export default PostGridItemV2;
