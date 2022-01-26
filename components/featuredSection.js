import styles from "../sass/components/FeaturedSection.module.scss";
import Link from "next/link";

const FeaturedSection = ({posts, titleText}) => (
  <div className={styles.featuredSection}>
    <div className={styles.itemsContainer}>
      {
        posts.map(p => {
          let slug=`/posts/${p.Category}/${p.PostId}`;
          return (
            <div className={styles.item} key={slug}>
              <Link href={slug} passHref>
                <a>
                  <img src={p.ImageS3Url} alt={p.Title} className={styles.featuredSectionItemImage}/>
                  
                  <div className={styles.itemTitle}>
                    <h3 className={styles.itemTitleText}>{p.Title}</h3>
                  </div>
                </a>
              </Link>
            </div>
            
          )
        })
      }
    </div>

    <div className={styles.titleContainer}>
      <h2>{titleText}</h2>
    </div>
  </div>
);

export default FeaturedSection;
