import styles from "../sass/components/Logo.module.scss";
import Link from "next/link";
import { Heading } from "react-bulma-components";

type Props = {
  logoUrl: string;
  siteName: string;
};

const Logo = ({ logoUrl, siteName }: Props) => (
  <Link href="/" passHref>
    <a>
      {logoUrl && logoUrl.length > 0 && (
        <img className={styles.logoImg} src={logoUrl} alt={"Site Logo"} />
      )}
      {(logoUrl === undefined || logoUrl.length === 0) && (
        <Heading>{siteName}</Heading>
      )}
    </a>
  </Link>
);

export default Logo;
