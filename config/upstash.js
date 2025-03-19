const { Client } = require('@upstash/workflow');

require('dotenv').config();

const workflowClient = new Client({
  baseUrl: process.env.QSTASH_URL,
  token: process.env.QSTASH_TOKEN,
});

console.log('QSTASH_URL:', process.env.QSTASH_URL);
console.log('QSTASH_TOKEN:', process.env.QSTASH_TOKEN);

module.exports = workflowClient;
