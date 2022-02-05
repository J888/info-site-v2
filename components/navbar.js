import { useState } from "react";
import { Columns, Heading } from "react-bulma-components";
import Link from "next/link";
import styles from "../sass/components/NavBar.module.scss";
import { SocialIcon } from 'react-social-icons';
import Logo from "../components/logo";

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

const NavV2 = ({ siteName, twitterUsername, navLinks, navLogoUrl }) => {
  const [showNav, setShowNav] = useState(false);
  console.log(`siteName: ${siteName}`)

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.header}>
        <div className={styles.siteName}>
          <Logo logoUrl={navLogoUrl}/>
        </div>
        <img
          src="/icons/icons8-menu-48.png"
          className={styles.menuButton}
          onClick={() => { setShowNav(!showNav) }}
          alt={"Menu open icon"}
        />
      </div>

      <nav className={`${styles.navBarV2} ${showNav ? styles.slideIntoView : ''}`}>
        <div className={styles.navBarV2Content}>
          <div>
            <img
              src="/icons/white-close-window-icon.png"
              className={styles.navCloseButton}
              onClick={() => {setShowNav(false) }}
              alt={"Menu close icon"}
            />
          </div>

          {
            navLinks && 
            <div className={styles.navBarV2Items}>
              <div className={styles.siteNameInPanel}>
                <Logo logoUrl={navLogoUrl}/>
              </div>
              {
                navLinks.map(navLink => 
                  <Link href={navLink.href} className={styles.navItem} key={`nav-link-${navLink.href}`}>
                    {navLink.label}
                  </Link>
                )
              }
            </div>
          }
          
        </div>
      </nav>

    </div>    
  )
};

export default NavV2;
