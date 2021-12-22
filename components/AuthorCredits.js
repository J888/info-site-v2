import styles from "../sass/components/AuthorCredits.module.scss";

const AuthorCredits = ({ authorName, twitterUsername }) => (
  <div className={styles.authorCreditsContainer}>
    <img src="/icons/author-icon-small.png" className={styles.authorImage}></img>
    <div className={styles.authorDescription}>
      <p>Written by {authorName || `unknown`}.</p>
      <a href={`https://twitter.com/${twitterUsername}`}>@{twitterUsername} </a>
    </div>
  </div>
);

export default AuthorCredits;
