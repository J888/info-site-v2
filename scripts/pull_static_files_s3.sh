#!/bin/bash

aws s3 cp \
  s3://$STATIC_FILES_S3_BUCKET/websites/$SITE_FOLDER_S3 \
  tmp \
  --recursive 
