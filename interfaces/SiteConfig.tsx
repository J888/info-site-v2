import { NavBackground, NavLink } from "./Nav";

export interface SiteConfig {
  faviconUrl: string;
  footer: {
    tagline: string;
  }
  nav: {
    background: NavBackground;
    links: Array<NavLink>;
    logoUrl: string;
  }
  pageData: {
    about: {
      description: Array<string>
    }
  }
  socialMedia: {
    username: {
      twitter: string
    }
  }
  site: {
    subject: string;
    baseUrl: string;
    name: string;
    statements: {
      purpose: {
        short: string;
        long: string;
      }
    }
  }
}
