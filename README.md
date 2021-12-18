### ToDo

- Make author icon and display on post page
- change the format of the main image so that it is side-by-side to the tags and category
- 


# ENV VARS

```
export AWS_ACCESS_KEY_ID= \
       AWS_SECRET_ACCESS_KEY= \
       S3_REGION=us-east-2 \
       SITE_FOLDER_S3=nftblog1 \
       STATIC_FILES_S3_BUCKET=nftblog1-static-files \
       IMG_S3_BUCKET=nftblog1-images \
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
