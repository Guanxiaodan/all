/**
 * Created by GXD on 2017/8/28.
 * 用户登录管理
 */
const crypto = require('crypto');
const express = require('express');
const _ = require('lodash');
const dbApi = require('../api/dbApi');
const debug = require('debug')('mm:user');

const router = express.Router();
/** *************************    私有变量    ******************************* */

/** *************************    对外接口    ******************************* */
// 用户登录
// curl -H "Content-Type: application/json" -X POST  --data '{"user":"mq","pwd":"e10adc3949ba59abbe56e057f20f883e"}'  "http://localhost:8000/user/login
router.post('/login', (req, res) => {
  // 先检验req参数有效性
  if ((!req.body) || (!req.body.user) || (!req.body.pwd)) {
    res.status(400).json({ err: '参数错误' });
    debug('传入参数不正确', req.body);
    return;
  }

  // 查找数据库
  dbApi.db.collection('user').findOne({ user: req.body.user })
    .then((doc) => {
      debug('doc', doc);
      if (_.isEmpty(doc)) {
        res.status(400).json({ err: `用户${req.body.user}不存在` });
      } else {
        // 计算md5
        const md5 = crypto.createHash('md5');
        md5.update(doc.pwd);
        const d = md5.digest('hex');

        if (d === req.body.pwd) {
          // 登录成功，写入session
          req.session.user = req.body.user;
          res.status(200).json({ ret: 'OK' });
        } else {
          res.status(400).json({ err: '密码错误' });
        }
      }
    })
    .catch((e) => {
      debug('err', e);
      res.status(400).json({ err: '数据库查找出错' });
    });
});

module.exports = router;
