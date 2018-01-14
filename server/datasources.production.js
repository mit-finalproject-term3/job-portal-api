'use strict';

module.exports = {
  db: {
    connector: 'mongodb',
    name: 'mongo',
    url: process.env.DB_URI,
  },
};
