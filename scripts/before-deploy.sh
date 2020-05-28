#!/bin/bash
set -e

cp ./dist/index.html ./dist/404.html

if [[ $CNAME != "" ]]; then
  echo $CNAME > dist/CNAME
fi
