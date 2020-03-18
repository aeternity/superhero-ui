#!/bin/bash
set -e

if [[ $DOMAIN != "" ]]; then
  echo $DOMAIN > dist/CNAME
fi
