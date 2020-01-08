#!/usr/bin/env bash

GIT_REV="$(git rev-parse HEAD)"&& \
rm -rf dist && \
rm -rf node_modules && \
npm install && \
NODE_ENV=prod npm run build && \
cd dist/ && \
git init && \
git remote add origin git@github.com:mradkov/tip-aggregator.git && \
git checkout -b gh-pages && \
git add * && \
git commit -m "tip-aggregator ${GIT_REV} deployment to gh-pages" && \
git fetch && git rebase -s recursive -Xtheirs origin/gh-pages && \
git push origin gh-pages
