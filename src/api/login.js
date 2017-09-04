/**
 * Created by GXD on 2017/8/29.
 *
 */
const axios = require('axios');

// const BASE_URL = 'http://school.magic-cloud.cn:6600';
const BASE_URL = 'http://localhost:8000';

const $http = axios.create({
  baseURL: BASE_URL,
  timeout: 2000,
  withCredentials: true,  // axios使用cookie
});

module.exports = {
  post(path, postData) {
    return $http.post(path, postData);
  },
};
