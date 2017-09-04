/**
 * Created by GXD on 2017/8/28.
 *
 */
const spawn = require('child_process').spawn;
const express = require('express');
const _ = require('lodash');
const JSON5 = require('json5');
const dbApi = require('../api/dbApi');
const debug = require('debug')('mm:license');

const router = express.Router();
/** *************************    私有变量    ******************************* */
// 操作日志写入数据库
// { organize: '111', contact: '2222', tel: '3333', email: '4444' } 客户名 联系人 电话 邮件
function writeLogs(operator, customerInfo, expirtDate, clientLimit, reqCode, authCode) {
  dbApi.db.collection('logs').insertOne({
    operator,
    organize: customerInfo.organize,
    contact: customerInfo.contact,
    tel: customerInfo.tel,
    email: customerInfo.email,
    expirtDate, // 授权到期时间
    clientLimit,
    time: new Date(),
    reqcode: reqCode,
    authcode: authCode,
  })
    .then((ret) => {
      debug('result', ret.result);
    })
    .catch((e) => {
      debug('err', e);
    });
}
/** *************************    对外接口    ******************************* */
/* 解析请求码
 * reqCode:请求码
 * */
// curl -H "Content-Type: application/json" -X POST  --data '{"reqCode":"MXP1vLPmIYW4FiLdMzlLT0ThT61LPnag0M38+qovVGFRfQFlnMLkOu4VSpM/Ew0sbXsUTARtJdhnjqlA7M9Ku3Edr+YPBumK/OdNfPcbMqau4J//MXU4hNCI5eeW8/mgwz7q4/uvie5tYyxSM0jif3pvFKCE1AKQp97YAayOYBr8hwm8fHx0O7lRcBTSAtXG89uG9wUGWh5N0vpo2PYjQk95DD/N1GNtxAJoprF/hGZxuWfSIy4v9eswxU97QTy9TZl0CMUeUmyBxntQUn0aPz1Wczh9ebGlWxnk8rAcwP7D++CI1WvkG8mb+Q125ZkqMjfSCLelN1Z3+ntqxtOxSE/TfDXOadz4Ip7rgyIpS86jtYhpUyz2BbFGqObyUk6ZkxIZtbVxPfE/DmCwnof/NMFAkAa2jGM4AKEC9l1ecio6g9aRMQiQHlgU8wXAytrVykWIX8gfwUf8WHlqKFuR5zi4lYuNlamP6g7SziG4dchdOWmY1dVOa7m/CheA0mN1IuIye2ZuD+I54DIPNnP0RqG6iRSCvysKEbsGPyxoc6xOCoxxqX9HDPOMxwqVM6sjWEOkjMtmkGnGDH6BtoELBma2eoP+l4tkg1yrOVw1iX1LeiVsDPkt60vAl/q6GbGuWhXDjscTCqdH4JqGYGMZ7y887cx7mPRSvfKQyTF6nq+hXROVsUppDzOwwb+IG3gEjdZpZR5nIHIwaA6974BJXPAHINIpjCDEiAxFiWXJh3HdKRMZPYPaxz+h8LTVyoGMYoT3kw/A/0+Gl89S21Fhw1tnuzYf2aOiT8X1TbuFfBiLuoInyQO5KxQjEgYHkb1pyATyex3q/P+5/Wj+M53yJSjw9UJJazuCfKKohENgoaD+Rt+ZDQK95LvdgtCBKEISOmNpgfFOWCEZSFjxjbma6x8BO1Hz9gQc3b65vwGb7q2BOtSg5Z4LqSzsxBI2HY1QXQU1x4q7/kwoa2/JQj3gmx9zdoPFNIpdAaPPbzdqLQi4AtA6IFMrLwV25Q59RsmJoBhlPiOxSg3F9ATATNoaVH3k2rLT4gsSbYgJW97AjU9GBiRrtsw5kGkrKEId5mxl9Lb4/0dYFtsS14dzx1dfatZyO72aCIvfrt1Ov8vmqIFpA6+LR6UiSh85lBg5p4Cm0jB84UpFqvGjwIGezoPwV/w7RwiGUxsYmlxVAylI+bgDbjoVS3xcBmZUxoR6kLBSB7VSEvvpcFnEa594BfqP73zNGcZokyfvykHhVX3ebz2Jx5gTrEKJ5NzJgodJmJ53AT4n5YDRRh37sHfXB+RmlnVm+vxTO/7GHdWowrSILgkbn+HrwkN8lkA4ocoMvr3K8qBXf5qj26J6NusfOx7xMJzHR/09Yy5SOdOQGYLTRUgKO0BjSImTp4vNAJXyO25HSWnJWGS3UDuzB0kokqavtY7jSme6SlAXykFh/27DVCq6cyTGZclNv74DCKj5zHcp3oUin8CoanGAc0hMxi3Ht4R5wB6MmT4QQIBwvMnl1Ank+fs4uFY6XBHQJfvVHLwykr+U2bBpzfQRBKxyo4c="}'  "http://localhost:8000/license/parseReq"
router.post('/parseReq', (req, res) => {
  // 先检验req参数有效性
  if ((!req.body) || (!_.isString(req.body.reqCode))) {
    res.status(400).json({ err: '参数错误' });
    debug('传入参数不正确', req.body);
    return;
  }

  // 先判断用户是否登录
  if (req.session.user) {
    const mmMakeLicense = spawn('mm-make-license', []);
    let ret = {};
    mmMakeLicense.stdout.on('data', (data) => {
      // 先解析请求码信息//{ organize: '111', contact: '2222', tel: '3333', email: '4444' } 客户名 联系人 电话 邮件
      const infoPos = data.indexOf('organize');
      if (infoPos >= 0) {
        const pos1 = data.indexOf('\n');
        const pos2 = data.lastIndexOf('\n');
        const str = data.toString().substring(pos1 + 1, pos2);
        ret = JSON5.parse(str);
        debug('Info:', ret);
        mmMakeLicense.kill('SIGHUP');
      } else {
        const pos = data.indexOf('\n');
        const str = data.toString().substring(0, pos);
        debug(`stdout:${str}`);

        if (str === 'please input license request data:') { // 请求码
          mmMakeLicense.stdin.write(req.body.reqCode);
          mmMakeLicense.stdin.write('\n');
        }
      }
    });
    mmMakeLicense.stderr.on('data', (data) => {
      debug(`stderr: ${data}`);
      res.status(400).json({ err: '请求码错误' });
    });
    mmMakeLicense.on('close', (code) => {
      debug(`child process exited with code ${code}`);
      if (_.isEmpty(ret)) {
        res.status(400).json({ err: '请求码错误' });
      } else {
        res.status(200).json({ ret: {
          客户名: ret.organize,
          联系人: ret.contact,
          电话: ret.tel,
          邮件: ret.email,
        } });
      }
    });
  } else {
    res.status(400).json({ err: '请先登录' });
  }
});

/* 生成授权码
* reqCode:请求码
* operator:授权人
* year:年
* month:月
* day:日
* clientLimit:终端数量
* */
// curl -H "Content-Type: application/json" -X POST  --data '{"reqCode":"MXP1vLPmIYW4FiLdMzlLT0ThT61LPnag0M38+qovVGFRfQFlnMLkOu4VSpM/Ew0sbXsUTARtJdhnjqlA7M9Ku3/OdNfPcbMqau4J//MXU4hNCI5eeW8/mgwz7q4/uvie5tYyxSM0jif3pvFKCE1AKQp97YAayOYBr8hwm8fHx0O7lRcBTSAtXG89uG9wUGWh5N0vpo2PYjQk95DD/N1GNtxAJoprF/hGZxuWfSIy4v9eswxU97QTy9TZl0CMUeUmyBxntQUn0aPz1Wczh9ebGlWxnk8rAcwP7D++CI1WvkG8mb+Q125ZkqMjfSCLelN1Z3+ntqxtOxSE/TfDXOadz4Ip7rgyIpS86jtYhpUyz2BbFGqObyUk6ZkxIZtbVxPfE/DmCwnof/NMFAkAa2jGM4AKEC9l1ecio6g9aRMQiQHlgU8wXAytrVykWIX8gfwUf8WHlqKFuR5zi4lYuNlamP6g7SziG4dchdOWmY1dVOa7m/CheA0mN1IuIye2ZuD+I54DIPNnP0RqG6iRSCvysKEbsGPyxoc6xOCoxxqX9HDPOMxwqVM6sjWEOkjMtmkGnGDH6BtoELBma2eoP+l4tkg1yrOVw1iX1LeiVsDPkt60vAl/q6GbGuWhXDjscTCqdH4JqGYGMZ7y887cx7mPRSvfKQyTF6nq+hXROVsUppDzOwwb+IG3gEjdZpZR5nIHIwaA6974BJXPAHINIpjCDEiAxFiWXJh3HdKRMZPYPaxz+h8LTVyoGMYoT3kw/A/0+Gl89S21Fhw1tnuzYf2aOiT8X1TbuFfBiLuoInyQO5KxQjEgYHkb1pyATyex3q/P+5/Wj+M53yJSjw9UJJazuCfKKohENgoaD+Rt+ZDQK95LvdgtCBKEISOmNpgfFOWCEZSFjxjbma6x8BO1Hz9gQc3b65vwGb7q2BOtSg5Z4LqSzsxBI2HY1QXQU1x4q7/kwoa2/JQj3gmx9zdoPFNIpdAaPPbzdqLQi4AtA6IFMrLwV25Q59RsmJoBhlPiOxSg3F9ATATNoaVH3k2rLT4gsSbYgJW97AjU9GBiRrtsw5kGkrKEId5mxl9Lb4/0dYFtsS14dzx1dfatZyO72aCIvfrt1Ov8vmqIFpA6+LR6UiSh85lBg5p4Cm0jB84UpFqvGjwIGezoPwV/w7RwiGUxsYmlxVAylI+bgDbjoVS3xcBmZUxoR6kLBSB7VSEvvpcFnEa594BfqP73zNGcZokyfvykHhVX3ebz2Jx5gTrEKJ5NzJgodJmJ53AT4n5YDRRh37sHfXB+RmlnVm+vxTO/7GHdWowrSILgkbn+HrwkN8lkA4ocoMvr3K8qBXf5qj26J6NusfOx7xMJzHR/09Yy5SOdOQGYLTRUgKO0BjSImTp4vNAJXyO25HSWnJWGS3UDuzB0kokqavtY7jSme6SlAXykFh/27DVCq6cyTGZclNv74DCKj5zHcp3oUin8CoanGAc0hMxi3Ht4R5wB6MmT4QQIBwvMnl1Ank+fs4uFY6XBHQJfvVHLwykr+U2bBpzfQRBKxyo4c=","year":"2017","month":"12","day":"1","clientLimit":"9","operator":"mq"}'  "http://localhost:8000/license/getLicense"
router.post('/getLicense', (req, res) => {
  // 先检验req参数有效性
  if ((!req.body) || (!_.isString(req.body.reqCode))
    || (!_.isString(req.body.year)) || (!_.isString(req.body.month)) || (!_.isString(req.body.day))
    || (!_.isString(req.body.clientLimit))) {
    res.status(400).json({ err: '参数错误' });
    debug('传入参数不正确', req.body);
    return;
  }

  // 先判断用户是否登录
  if (req.session.user) {
    const mmMakeLicense = spawn('mm-make-license', []);
    let ret = '';
    let customerInfo = {};
    // 生成授权码
    mmMakeLicense.stdout.on('data', (data) => {
      // 授权码
      const codePos = data.indexOf('LICENSE CODE');
      if (codePos >= 0) {
        const pos1 = data.indexOf('\n');
        const pos2 = data.lastIndexOf('\n');
        ret = data.toString().substring(pos1 + 1, pos2);
        debug('CODE:', ret);
      } else {
        // 解析请求码信息//{ organize: '111', contact: '2222', tel: '3333', email: '4444' } 客户名 联系人 电话 邮件
        const infoPos = data.indexOf('organize');
        if (infoPos >= 0) {
          const pos1 = data.indexOf('\n');
          const pos2 = data.lastIndexOf('\n');
          const str = data.toString().substring(pos1 + 1, pos2);
          customerInfo = JSON5.parse(str);
          debug('customerInfo:', customerInfo);
        } else {
          const clientPos = data.indexOf('please input client limit:');
          if (clientPos >= 0) { // 输入终端数量
            mmMakeLicense.stdin.write(req.body.clientLimit);
            mmMakeLicense.stdin.write('\n');
          } else {
            const pos = data.indexOf('\n');
            const str = data.toString().substring(0, pos);
            debug(`stdout:${data}`);

            if (str === 'please input license request data:') { // 请求码
              mmMakeLicense.stdin.write(req.body.reqCode);
              mmMakeLicense.stdin.write('\n');
            } else if (str === 'please input your name:') { // 授权人
              mmMakeLicense.stdin.write(req.session.user);
              mmMakeLicense.stdin.write('\n');
            } else if (str === 'please input expirtDate year:') {   // 年
              mmMakeLicense.stdin.write(req.body.year);
              mmMakeLicense.stdin.write('\n');
            } else if (str === 'please input expirtDate month (1-12):') { // 月
              mmMakeLicense.stdin.write(req.body.month);
              mmMakeLicense.stdin.write('\n');
            } else if (str === 'please input expirtDate day:') {    // 日
              mmMakeLicense.stdin.write(req.body.day);
              mmMakeLicense.stdin.write('\n');
            } else if (str === 'please input client limit:') {  // 终端数量
              mmMakeLicense.stdin.write(req.body.clientLimit);
              mmMakeLicense.stdin.write('\n');
            }
          }
        }
      }
    });

    mmMakeLicense.stderr.on('data', (data) => {
      debug(`stderr: ${data}`);
      res.status(400).json({ err: '请求码错误' });
    });

    mmMakeLicense.on('close', (code) => {
      debug(`child process exited with code ${code}`);
      if (ret === '') {
        res.status(400).json({ err: '请求码错误' });
      } else {
        // 生成授权码，写入日志
        writeLogs(req.session.user, // 授权人
          customerInfo,             // 客户信息
          `${req.body.year}-${req.body.month}-${req.body.day}`, // 授权时间
          req.body.clientLimit, // 终端数量
          req.body.reqCode, // 请求码
          ret); // 授权码
        res.status(200).json({ ret });
      }
    });
  } else {
    res.status(400).json({ err: '请先登录' });
  }
});

/*
* 获取日志
* */
router.post('/getLogs', (req, res) => {
  debug('这是传过来的数据', req.body);
  if ((!req.body)) {
    debug('这是传过来的数据', req.body);
    res.status(400).json({ err: '参数错误' });
    return;
  }

  // 从数据库中查找数据
  dbApi.db.collection('logs').find({}).toArray()
    .then((docs) => {
      debug('从数据库查询数据成功', docs);
      res.status(200).json({ res: docs });
    })
    .catch((e) => {
      debug('从数据库查询数据失败', e);
      res.status(400).json({ err: '获取数据失败' });
    });
});


module.exports = router;
