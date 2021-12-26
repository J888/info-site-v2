import { Columns, Heading } from "react-bulma-components";
import Link from "next/link";
import styles from "../sass/components/NavBar.module.scss";
import { SocialIcon } from 'react-social-icons';

const Nav = ({ siteName, twitterUsername, navLinks }) => (
  <nav className={styles.navBar}>
    <Columns className={styles.navBarItems}>
      <Columns.Column size={2} className={styles.navBarColumn1}>
        <Heading>
          <Link href="/" passHref>
            <a>{siteName}</a>
          </Link>
        </Heading>
      </Columns.Column>

      <Columns.Column size={9} className={styles.navBarColumn2}>
        <div className={styles.section1}>
          {
            navLinks.map(navLink => 
              <Link href={navLink.href} className={styles.navItem} key={`nav-link-${navLink.href}`}>
                {navLink.label}
              </Link>
            )
          }
        </div>
      </Columns.Column>

      <Columns.Column size={1} className={styles.navBarColumn3}>
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
