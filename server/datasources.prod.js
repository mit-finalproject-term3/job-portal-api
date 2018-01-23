'use strict';

module.exports = {
  mongo: {
    connector: 'mongodb',
    name: 'mongo',
    url: process.env.MONGO_URI,
  },
};
