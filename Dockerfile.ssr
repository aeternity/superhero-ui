FROM node:14 as builder

RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY package*.json /home/node/app/
RUN chown -R node:node /home/node/

USER node

RUN npm ci
COPY --chown=node:node . /home/node/app
ENV NODE_ENV=production
RUN npm run ssr:build


FROM node:14-alpine

ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV PORT 8080
EXPOSE 8080

USER node
WORKDIR /home/node/app

COPY --chown=node:node --from=builder /home/node/app /home/node/app

CMD ["./node_modules/@uvue/server/start.js"]
