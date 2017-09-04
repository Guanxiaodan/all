/**
 * Created by mq on 17-8-30.
 * 数据库操作
 */
const MongoClient = require('mongodb').MongoClient;
const debug = require('debug')('mm:mongo');

const dbOptions = { reconnectTries: 99999999, reconnectInterval: 5000 };

module.exports = {
  db: null,
  open(dbUrl, dbName, callback) {
    MongoClient.connect(dbUrl, dbOptions)
      .then((retDb) => {
        debug('Using DB:', dbUrl, dbOptions);
        this.db = retDb.db(dbName);
        callback(null);
      })
      .catch((e) => {
        debug(e.message);
        callback('openDB Err');
      });
  },
};
