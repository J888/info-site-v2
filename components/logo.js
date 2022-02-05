import styles from "../sass/components/Logo.module.scss";
import Link from "next/link";

const Logo = ({logoUrl}) => (
  <Link href="/" passHref>
    <a>
      <img className={styles.logoImg} src={logoUrl} alt={"Site Logo"}/>
    </a>
  </Link>
);

export default Logo;
