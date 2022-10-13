const blankConfig = () => ({
  site: {
    subject: "",
    baseUrl: "",
    name: "Untitled",
    statements: {
      purpose: {
        short: "",
        long: "",
      },
    },
  },
  categories: [],
  pageData: {
    about: {
      description: "Hi, I'm the about page.",
    },
  },
  featuredSection: {
    titleText: "Featured posts",
    postIds: [],
  },
  nav: {
    logoUrl:
      "https://gamboge888-public.s3.us-east-2.amazonaws.com/defaults/default-LOGO.png",
    background: {
      url: "https://gamboge888-public.s3.us-east-2.amazonaws.com/defaults/default-NAV_BKGRD.jpg",
      size: "30rem",
    },
    links: [],
  },
  footer: {
    tagline: "Thanks for reading!",
  },
  socialMedia: {
    username: {
      twitter: "",
    },
  },
  faviconUrl:
    "https://nftblog1-images.s3.us-east-2.amazonaws.com/assets/favicon.ico",
  integrations: {
    google: {
      analytics: {
        clientEmail:
          "",
        clientId: "",
        propertyId: "",
        viewId: "",
        enabled: false,
      },
    },
    disqus: {
      shortname: "",
    },
  },
});

export { blankConfig };
