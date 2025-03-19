const dotenv = require('dotenv');
dotenv.config();

async function loadArcjet() {
  const arcjet = (await import('@arcjet/node')).default;
  const { shield, detectBot, tokenBucket } = await import('@arcjet/node');

  return arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ['ip.src'],
    rules: [
      shield({ mode: 'LIVE' }),
      detectBot({
        mode: 'LIVE',
        allow: ['CATEGORY:SEARCH_ENGINE'],
      }),
      tokenBucket({
        mode: 'LIVE',
        refillRate: 5,
        interval: 10,
        capacity: 10,
      }),
    ],
  });
}

module.exports = loadArcjet;
