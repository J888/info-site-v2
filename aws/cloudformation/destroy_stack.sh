#!/bin/bash

# Deploys Stack that will be the backend for info sites

NICKNAME="" # add a unique nickname to make your stack resources uniquely named
STACK_NAME="$NICKNAME-sites"

aws --region us-east-2 cloudformation delete-stack \
  --stack-name $STACK_NAME
