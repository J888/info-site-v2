
## Server Requirements
- NodeJS must be installed, a 17.x version. I prefer to use nvm to manage node versions
- Image magick for image compression
- The aws cli

## Development To-Do Items

- Theming/coloring based on settings
- add some toasts for when things have been saved. (basically replace all the 'alerts')
- Make disqus completely optional
- Make fonts configurable
- "highlighted" tweets section - show a set of tweets (with react twitter embed component)
  - configurable in site config. And if they're not present then don't display anything.
- Warning: data for page "/" is 201 kB, this amount of data can reduce performance.
       -  https://nextjs.org/docs/messages/large-page-data 
- Add "Back to top" button on articles. Useful if article is long.
- Make the background color of the navbar a config item.
- Publish page
  - Make article list searchable/filterable by title on admin page.
  - add part numbers to keep track when adding new parts
- configuration UI to configure the site config:
  - add a version and lastUpdatedAt field to it
  - ability to delete array items
  - ability to re-order array items
- temp modal notifications when things are saved from publishing side
- allow a non-admin user to change their own (and only their own) password
- publish page:
  - allow (non-admin) user to delete articles they create
  - highlight articles I've written 


## Run it Locally: Set ENV VARS
Option 1: Run with mock data

```sh
$ MOCK_DATA=true MOCK_DATA_POST_COUNT=50 npm run dev
```

Option 2: `Create a file `.env.local` in the root of this project and fill in values

```
GOOGLE_PRIVATE_KEY=

SECRET_COOKIE_PASSWORD=
BLOG_POSTS_DYNAMO_TABLE_NAME=

S3_REGION=
SITE_IDENTIFIER=
STATIC_FILES_BUCKET=
PUBLIC_FILES_BUCKET=

SITE_BASE_URL=

```

## Run Development Server

```sh
$ npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build and Startup
```sh
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

## Other

- Copies of state objects are created for this reason. https://stackoverflow.com/a/56266640

> . You've changed one of its values but it's still the same [object], and I suspect React doesn't see any reason to re-render because state hasn't changed;

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
