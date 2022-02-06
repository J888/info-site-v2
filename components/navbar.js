import { useState } from "react";
import Link from "next/link";
import styles from "../sass/components/NavBar.module.scss";
import Logo from "../components/logo";

const NavV2 = ({ navLinks, navLogoUrl, background }) => {
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
          <Logo logoUrl={navLogoUrl}/>
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
