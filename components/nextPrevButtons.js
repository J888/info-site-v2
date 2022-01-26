import {
  Section
} from "react-bulma-components";
import Link from "next/link";
import styles from "../sass/components/NextPrevButtons.module.scss";

const NextPrevButtons = ({ data, hideTitles }) => 
  <Section className={styles.nextPrevArticleContainer}>
    {data?.PrevPost?.Slug ? (
      <div>
        <Link href={data?.PrevPost?.Slug}>
          {"< " + (hideTitles ? 'Newer article' : data?.PrevPost?.Title)}
        </Link>
      </div>
    ) : (
      <p></p>
    )}

    {data?.NextPost?.Slug ? (
      <div>
        <Link href={data?.NextPost?.Slug}>
          {(hideTitles ? 'Older article' : data?.NextPost?.Title) + " >"}
        </Link>
      </div>
    ) : (
      <p></p>
    )}
  </Section>

export default NextPrevButtons;
