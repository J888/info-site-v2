import styles from "../sass/components/Footer.module.scss";
import Logo from "./logo";
import { SocialIcon } from "react-social-icons";
import { Heading } from "react-bulma-components";

type Props = {
  logoUrl: string;
  tagline: string;
  twitterUsername: string;
  siteName?: string;
};

const Footer = ({ logoUrl, twitterUsername, tagline, siteName }: Props) => (
  <footer className={styles.footer}>
    <div className={styles.logo}>
    {logoUrl && logoUrl.length > 0 && <Logo logoUrl={logoUrl}/> }
    {(logoUrl === undefined || logoUrl.length === 0) && <Heading>{siteName}</Heading>}
    </div>
    <div>{`© ${new Date().getFullYear()} - ${tagline}`}</div>
    <div className={styles.twitterIcon}>
      <SocialIcon
        url={`https://twitter.com/${twitterUsername}`}
        bgColor={"rgb(77, 77, 77)"}
        style={{ height: 26, width: 26 }}
      />
    </div>
  </footer>
);

export default Footer;
