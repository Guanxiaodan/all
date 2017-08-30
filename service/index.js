/**
 * Created by GXD on 2017/8/28.
 *
 */

const express = require('express');
const argv = require('argv');
const bodyParser = require('body-parser');
const process = require('process');
const dbApi = require('./api/dbApi');
const debug = require('debug')('mm:index');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();
// app.use(bodyParser.urlencoded({limit: '3000kb',extended: false}));
app.use('/', (req, res, next) => {
  debug('HTTP REQ:', req.method, req.url, req.headers.origin);
  // TODO: 设置跨域的黑白名单
  res.set('Access-Control-Allow-Method', req.method);
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('Access-Control-Allow-Headers', 'DNT,COOKIE,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,X-Forwarded-For');
  res.set('Access-Control-Allow-Origin', req.headers.origin || 'null');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
  } else {
    next();
  }
});
/** *************************    启动参数    ******************************* */
// 初始化命令行参数
const args = argv.option([
  {
    name: 'port',
    short: 'p',
    type: 'string',
    description: '服务器端口号',
  },
  {
    name: 'ip',
    short: 'i',
    type: 'string',
    description: '服务器监听IP地址',
  },
  {
    name: 'dbAddr',
    short: 'd',
    type: 'string',
    description: '数据库地址',
  },
]).run();

// //启动SERVER
const ip = args.options.ip ? args.options.ip : '0.0.0.0';
const port = args.options.port ? args.options.port : 8000;
const dbAddr = args.options.dbAddr ? args.options.dbAddr : 'mongodb://localhost:27017';

dbApi.open(dbAddr, 'makeLicense', (err) => {
  if (err) {
    debug('数据库', dbAddr, '打开失败!');
    process.exit(); // 退出
  } else {  // 数据库打开成功
    debug('数据库', dbAddr, '打开OK');

    app.listen(port, ip, () => {
      debug('HTTP Listening in:', `${ip}:${port}`);
    });

    // 为API路径初始化session
    const sessOptions = {
      name: 'mmsess',
      secret: 'magicmind',
      resave: false,
      saveUninitialized: true,
      rolling: true,  // 循环cookie失效时间
      cookie: { maxAge: 11115000 },
      store: new MongoStore({ db: dbApi.db }),
    };
    app.use('/', session(sessOptions));

    app.use('/', bodyParser.json());
    // eslint-disable-next-line
    app.use('/license', require('./interface/license'));
    // eslint-disable-next-line
    app.use('/user', require('./interface/user'));


    dbApi.db.collection('user').find({}).toArray()
      .then((docs) => {
        debug('docs', docs);
      })
      .catch((e) => {
        debug('err', e);
      });
  }
});
