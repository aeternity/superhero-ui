import express from 'express';
import { decode } from '@aeternity/aepp-sdk/es/tx/builder/helpers';
import { verifyPersonalMessage } from '@aeternity/aepp-sdk/es/utils/crypto';
import Swagger from '@aeternity/aepp-sdk/es/utils/swagger';
import { readFileSync } from 'fs';
import { sign } from 'jsonwebtoken';
import fetch from 'node-fetch';
import cors from 'cors';

const messageRegExp = /^I would like to generate JWT token at (?<date>.*)$/;
const middlewareUrl = 'https://mainnet.aeternity.io';

class ExpressError extends Error {
  constructor(code, message) {
    super(message);
    this.statusCode = code;
    this.statusMessage = message;
  }
}

export default (app, http) => {
  app.use(express.json());
  app.use(cors());

  const moderators = readFileSync('./moderators.txt').toString().split('\n').filter(a => a);

  const middlewarePromise = (async () => Swagger.compose({
    methods: {
      urlFor: path => middlewareUrl + path,
      axiosError: (error) => {
        if (error) throw error;
      },
    },
  })({
    swag: await (await fetch(`${middlewareUrl}/middleware/api`)).json(),
  }))();

  app.post('/claim', async (req, res) => {
    const { address, message, signature } = req.body;

    if (typeof message !== 'string') {
      throw new ExpressError(400, 'Message should be a string');
    }

    let matchRes = message.match(messageRegExp);
    let dateDiff;
    try {
      dateDiff = Date.now() - new Date(matchRes.groups.date);
    } catch (e) {
      matchRes = null;
    }
    if (!matchRes) throw new ExpressError(400, 'Can\'t parse message content');
    if (dateDiff > 60 * 1000 && dateDiff >= 0) {
      throw new ExpressError(400, 'Date in the message is outdated');
    }

    if (!verifyPersonalMessage(message, Buffer.from(signature, 'hex'), decode(address))) {
      throw new ExpressError(400, 'Signature is not valid');
    }

    const names = await (await middlewarePromise).api.getNameByAddress(address);
    const name = names.length ? names[0].name : address;

    const jwt = sign(
      {
        context: {
          user: {
            avatar: `https://robohash.org/${address}`,
            name
          }
        },
        aud: 'aeternity-jitsi',
        iss: 'jwt.z52da5wt.xyz',
        sub: 'jwt.z52da5wt.xyz',
        room: '*',
        moderator: moderators.includes(name)
      },
      process.env.VUE_APP_JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '1d',
      },
    );
    res.send(jwt);
  });
}
