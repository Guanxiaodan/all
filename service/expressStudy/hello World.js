/**
 * Created by GXD on 2018/5/29.
 * express入门
 * Hello World
 */
'use strict';

const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

const server = app.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('监听的是：', host, port);
});

