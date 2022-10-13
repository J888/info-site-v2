#!/bin/bash

# Deploys Stack that will be the backend for info sites

NICKNAME="" # add a unique nickname to make your stack resources uniquely named
BLOG_POST_DYNAMO_TABLE_NAME="$NICKNAME-posts"
STACK_NAME="$NICKNAME-sites"
STATIC_FILES_S3="$NICKNAME-static"
PUBLIC_FILES_S3="$NICKNAME-public"

aws --region us-east-2 cloudformation deploy \
  --stack-name $STACK_NAME \
  --template-file ./templates/site-stack.yml \
  --parameter-overrides BlogPostTableName=$BLOG_POST_DYNAMO_TABLE_NAME StaticFilesBucketName=$STATIC_FILES_S3 PublicFilesBucketName=$PUBLIC_FILES_S3 \
  --capabilities CAPABILITY_NAMED_IAM
