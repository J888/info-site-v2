# Description

This project aims to allow developers to easily create a blog about anything using a configuration-driven design.

The app is designed to pull publicly-facing data at build time. Most pages will use pre-fetched data. This makes the application extremely fast and secure.

## Goals
- Website performance
- Security
- A custom-built content management system

## Requirements to create a blog with this app
1. An AWS account with the ability to create resources
2. A server with nodeJS installed.

As of now, this project requires significant technical knowledge.

## Administration

The `/admin` page provides an interface to create, update, and delete content. You must log in as the admin user to do so.

## Development To-Do Items

- Make fonts configurable
- "highlighted" tweets section - show a set of tweets (with react twitter embed component)
  - configurable in site config. And if they're not present then don't display anything.
- Warning: data for page "/" is 201 kB, this amount of data can reduce performance.
       -  https://nextjs.org/docs/messages/large-page-data 
- Add "Back to top" button on articles. Useful if article is long.
- Make the background color of the navbar a config item.
- Admin
  - image upload:
    - compress photos before upload
  - Make article list searchable/filterable by title on admin page.
  - add part numbers to keep track when adding new parts
- configuration UI to configure the site config:
  - add a version and lastUpdatedAt field to it
  - detect issues (duplicates, blanks)

## Local Development: Set ENV VARS

`Create a file `.env.local` in the root of this project and fill in values

```
GOOGLE_ANALYTICS_VIEW_ID=
GOOGLE_CLIENT_EMAIL=
GOOGLE_CLIENT_ID=
GOOGLE_PRIVATE_KEY=
GOOGLE_ANALYTICS_PROPERTY_ID=

SECRET_COOKIE_PASSWORD=
SITE_NAME_LOWERCASE=
BLOG_POSTS_DYNAMO_TABLE_NAME=

DIGITAL_OCEAN_APP_ID=
DIGITAL_OCEAN_API_BASE_URL=
DIGITAL_OCEAN_PAT=

DISQUS_SHORTNAME=

S3_REGION=
SITE_FOLDER_S3=
STATIC_FILES_S3_BUCKET=
IMG_S3_BUCKET=

SITE_BASE_URL=

```

## Run dev server

Set env vars `LOCAL_POSTS_DIR`

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production server
```bash
npm run build
npm run start
```

## Stack

- This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
- TypeScript for type safety. Define the shape of data to catch bugs early. Configured with `.tsconfig.json`
- Bulma-React component library
- S3 for file storage
- Dynamo DB for storing articles (content and metadata both)
- Iron-session for storing session info
- Disqus for comments
- Google Analytics for view count

## Authentication

To modify content, an admin user is authenticated using the crypto library.

The admin user is the only user for now. Support for additional non-admin users may be added in the future.

### Derive hash:

```javascript

// Generate salt + hash
const crypto = require("crypto");
const args = process.argv.slice(2);
const salt = crypto.randomBytes(16).toString("hex");
const derived = crypto.scryptSync(args[0], salt, 64).toString("hex");
// store the salt and derived hash somewhere safe

// Check if there's a match
const hash = 'hash stored somewhere'
const salt = 'salt stored somewhere'
const derived = crypto.scryptSync(password, salt, 64).toString("hex");

if (derived === hash) {
       // you've got a match
}
```

## Disqus
- Disqus will auto-close discussions after 30 days.
   - To disable this, go into the site config and change 30 to 0.

## Integration Tests

Cypress is the framework used for integration testing. Run tests with Cypress Runner UI:

```sh
$ ./node_modules/.bin/cypress open
```

Or, run tests headless:

```sh
# Serve a production build of the site
$ npm run build && npm start

# In another terminal window, prep cypress by downloading siteConfig and posts locally so cypress can read the file straight up
$ npm run prep-cypress-local
# Run the integration tests
$ npm run cy:headless
```
