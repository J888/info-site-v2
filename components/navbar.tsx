import { useState } from "react";
import Link from "next/link";
import styles from "../sass/components/NavBar.module.scss";
import Logo from "./logo";
import { NavBackground, NavLink } from "../interfaces/Nav";
import { Heading } from "react-bulma-components";

type Props = {
  background?: NavBackground;
  navLinks: Array<NavLink>;
  logoUrl: string;
  siteName?: string;
};

const NavV2 = ({ navLinks, logoUrl, background, siteName }: Props) => {
  const [showNav, setShowNav] = useState(false);

  const stylesNavbarV2 = background !== undefined ? {
    backgroundImage: `url("${background.url}")`,
    backgroundBlendMode: 'darken',
    backgroundSize: background.size
  } : {}

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.header}>
        <div className={styles.siteName}>
          {logoUrl && logoUrl.length > 0 && <Logo logoUrl={logoUrl}/> }
          {(logoUrl === undefined || logoUrl.length === 0) && <Heading>{siteName}</Heading>}
        </div>
        <img
          src="/icons/icons8-menu-48.png"
          className={styles.menuButton}
          onClick={() => { setShowNav(!showNav) }}
          alt={"Menu open icon"}
        />
      </div>

      <nav
        className={`${styles.navBarV2} ${showNav ? styles.slideIntoView : ''}`}
        style={stylesNavbarV2}
      >
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
              {logoUrl && logoUrl.length > 0 && <Logo logoUrl={logoUrl}/> }
              {(logoUrl === undefined || logoUrl.length === 0) && <Heading>{siteName}</Heading>}
              </div>
              {
                navLinks.map(navLink => 
                  <Link href={navLink.href} key={`nav-link-${navLink.href}`}>
                    <a className={styles.navItem}>{navLink.label}</a>
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
