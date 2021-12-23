import { Columns, Heading } from "react-bulma-components";
import Link from "next/link";
import styles from "../sass/components/NavBar.module.scss";
import { SocialIcon } from 'react-social-icons';

const Nav = ({ siteName, twitterUsername }) => (
  <nav className={styles.navBar}>
    <Columns className={styles.navBarItems}>
      <Columns.Column size={3} className={styles.navBarColumn1}>
        <div className={styles.section1}>
          <Link href="/" className={styles.navItem}>
            Front Page
          </Link>
          <Link href="/posts/news" className={styles.navItem}>
            News
          </Link>
          <Link href="/about" className={styles.navItem}>
            About
          </Link>
        </div>
      </Columns.Column>

      <Columns.Column size={6} className={styles.navBarColumn2}>
        <Heading>
          <Link href="/" passHref>
            <a>{siteName}</a>
          </Link>
        </Heading>
      </Columns.Column>

      <Columns.Column size={3} className={styles.navBarColumn3}>
        <div className={styles.section3}>
          <SocialIcon
            url={`https://twitter.com/${twitterUsername}`}
            bgColor={"rgb(77, 77, 77)"}
            style={{ height: 33, width: 33 }}
          />
        </div>
      </Columns.Column>
    </Columns>
  </nav>
);

export default Nav;
