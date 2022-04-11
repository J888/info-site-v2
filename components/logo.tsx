import styles from "../sass/components/Logo.module.scss";
import Link from "next/link";

type Props = {
  logoUrl: string;
};

const Logo = ({logoUrl}: Props) => (
  <Link href="/" passHref>
    <a>
      <img className={styles.logoImg} src={logoUrl} alt={"Site Logo"}/>
    </a>
  </Link>
);

export default Logo;
