import { Columns, Heading, Navbar } from "react-bulma-components";
import Link from "next/link";
import LinkWrapper from "./linkWrapper";
import styles from "../sass/components/NavBar.module.scss";
import { SocialIcon } from 'react-social-icons';

const Nav = ({ siteName }) => (
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
            url="https://twitter.com/NFTmusician"
            bgColor={"rgb(77, 77, 77)"}
            style={{ height: 33, width: 33 }}
          />
        </div>
      </Columns.Column>
    </Columns>
    {/* <div className={styles.section1}>
      <Link href="/" className={styles.navItem}>
        Home
      </Link>
      <Link href="/categories" className={styles.navItem}>
        Categories
      </Link>
      <Link href="news" className={styles.navItem}>
        News
      </Link>
      <Link href="about" className={styles.navItem}>
        About
      </Link>
    </div>
    <div className={styles.section2}>
      <Heading>{siteName}</Heading>
    </div>
    <div className={styles.section3}>Socials</div> */}
  </nav>
);

export default Nav;
