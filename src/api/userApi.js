/**
 * Created by GXD on 2017/8/31.
 * 存储登录者信息
 */
const _ = require('lodash');

let userName = '';
module.exports = {
  setName(name) {
    userName = name;
  },
  getName() {
    return _.isEmpty(userName) ? '暂无登录信息' : userName;
  },
};
