### ToDo

- react twitter embed component
- "highlighted" tweets section - show a set of tweets (with react twitter embed component)
- Comments i.e. Disqus
- Warning: data for page "/" is 201 kB, this amount of data can reduce performance.
       -  https://nextjs.org/docs/messages/large-page-data 
- configure-ize the navbar links, text and href
- make a spotlight section for articles (carousel)

# ENV VARS

```
export AWS_ACCESS_KEY_ID= \
       AWS_SECRET_ACCESS_KEY= \
       S3_REGION=us-east-2 \
       SITE_FOLDER_S3= \
       STATIC_FILES_S3_BUCKET= \
       IMG_S3_BUCKET= \
       GOOGLE_ANALYTICS_PROPERTY_ID=G-XBBRM7C9ZE

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
- S3 for static file storage

## To-Do:

- Create S3 bucket and read/write role
- Upload markdown files to S3
- Read from S3 at build time
