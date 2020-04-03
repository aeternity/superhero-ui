#!/bin/bash
set -e

if [[ $CNAME != "" ]]; then
  echo $CNAME > dist/CNAME
fi
