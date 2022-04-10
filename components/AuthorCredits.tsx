import styles from "../sass/components/AuthorCredits.module.scss";

type Props = {
  authorName?: string;
  twitterUsername: string;
}

const AuthorCredits = ({ authorName, twitterUsername }: Props) => (
  <div className={styles.authorCreditsContainer}>
    <img src="/icons/author-icon-small.png" className={styles.authorImage} alt={`Image of ${authorName || `unknown`}`}/>
    <div className={styles.authorDescription}>
      <p>Written by {authorName || `unknown`}.</p>
      <a href={`https://twitter.com/${twitterUsername}`}>@{twitterUsername} </a>
    </div>
  </div>
);

export default AuthorCredits;
