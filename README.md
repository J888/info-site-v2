# Description

This project aims to allow software developers and other technical people to easily create a blog, or several blogs, in a configuration-driven way.

The app is build with NextJS. Most pages use pre-fetched data which allows a fast, secure user experience.

# Set Up

While utilizing the app is not very technical, setting up and deploying the app requires technical knowledge.

1. Deploy an AWS stack. This will be the backend of your blog(s), where all the posts, images, and static configs are kept.

```sh

$ cd aws/cloudformation
$ ./deploy_stack
```

## Goals
- Website performance - NextJS does a lot of pre-building of static data so it's faster and less cpu intensive to serve it at runtime
- Security - No DB reads since it's all read at build time
- A custom-built content management system - Who needs a fancy CMS? Just build your own!

## Requirements to create a blog with this app
1. An AWS account with the ability to create resources
2. A server with everything installed. See README_TECHNICAL.md

## Administration

The `/publish` page provides an interface to create, update, and delete content. You must be logged in to do so.

## Disqus
- Disqus will auto-close discussions after 30 days.
   - To disable this, go into the site config and change 30 to 0.
