#!/bin/bash

aws s3 cp \
  s3://$STATIC_FILES_BUCKET/websites/$SITE_IDENTIFIER \
  tmp \
  --recursive 
