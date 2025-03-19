require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 4500,
  DATABASE_URI: process.env.DATABASE_URI,
  EMAIL: {
    ADDRESS: process.env.EMAIL_ADDRESS,
    PASSWORD: process.env.EMAIL_PASSWORD,
  },
  UPSTASH: {
    URL: process.env.QSTASH_URL,
    TOKEN: process.env.QSTASH_TOKEN,
  },
};
