import styles from "../sass/components/Logo.module.scss";
import Link from "next/link";

const Logo = ({logoUrl}) => (
  <Link href="/" passHref>
    <a>
      <img className={styles.logoImg} src={logoUrl}/>
    </a>
  </Link>
);

export default Logo;
