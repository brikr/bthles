#!/bin/bash

FB_ENV=$1

if [ -z "$FB_ENV" ]; then
  FB_ENV="staging"
fi

if ! [[ "$FB_ENV" =~ ^(staging|prod)$ ]]; then
  echo "Usage: $0 [<environment>]"
  echo "  Default environment: staging"
  exit 1
fi

read -r -p "Deploying to $FB_ENV. Continue? [y/N] " response
response=${response,,} # to lower
if [[ ! "$response" =~ ^(yes|y)$ ]]; then
  echo "Aborting"
  exit 1
fi

ng build -c $FB_ENV
firebase use $FB_ENV
firebase deploy
firebase use default
