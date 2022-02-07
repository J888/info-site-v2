### ToDo

- "highlighted" tweets section - show a set of tweets (with react twitter embed component)
  - configurable in site config. And if they're not present then don't display anything.
- Warning: data for page "/" is 201 kB, this amount of data can reduce performance.
       -  https://nextjs.org/docs/messages/large-page-data 
- Add "Back to top" button on articles. Useful if article is long.
- Transfer this to a generic repo
  - update host app config
- Make the background color of the navbar a config item.
- Admin
  - drag/drop picture upload that also compresses it.
  - Make article list searchable/filterable by title on admin page.

# ENV VARS

```
export AWS_ACCESS_KEY_ID= \
       AWS_SECRET_ACCESS_KEY= \
       S3_REGION=us-east-2 \
       SITE_FOLDER_S3= \
       STATIC_FILES_S3_BUCKET= \
       IMG_S3_BUCKET= \
       GOOGLE_ANALYTICS_PROPERTY_ID=

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
- Bulma-React
- S3 for file storage
- Dynamo DB for storing articles (content and metadata both)

## Authentication - Derive hash

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
