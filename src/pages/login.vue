<style scoped>
  /*-------公共样式-------*/
  .to-top {
    margin-top: 1rem;
  }

  .to-top-large {
    margin-top: 2rem;
  }

  /*垂直布局*/
  .flex-c {
    display: flex;
    flex-direction: column;
  }

  /*水平布局*/
  .flex-r {
    display: flex;
    flex-direction: row;
  }

  /*主轴方向元素居中*/
  .m-center {
    justify-content: center;
  }

  /*交叉方向元素居中*/
  .x-center {
    align-items: center;
  }

  /*上下左右居中*/
  .center {
    justify-content: center;
    align-items: center;
  }

  /*主轴方向平均分配*/
  .m-around {
    justify-content: space-around;
  }

  /*主轴方向顶边分配*/
  .between {
    justify-content: space-between;
  }

  /*-------私有样式-------*/
  .container-all {
    width: 100%;
    height: 100%;
    background: url("../assets/flower.jpg") no-repeat;
    background-size: cover;
  }

  .container-border {
    box-shadow: 0 0 2px rgba(255, 255, 255, .7), 0 1px 8px rgba(0, 0, 0, .3);
    border: 1px solid #ccc;
    width: 20rem;
    height: 20rem;
    border-radius: 1rem;
  }

  .container-border:hover {
    box-shadow: 0 0 2px rgba(0, 0, 0, .3), 0 1px 8px rgba(0, 0, 0, .3);

  }

  /*.container-border h2 {*/
  /*color: white;*/
  /*}*/

</style>

<template>
  <div class="flex-c center container-all">
    <h1 style="font-size: 3rem; color: #F7F7F0; margin-bottom: 4rem; letter-spacing: 8px;">前后端学习平台</h1>
    <div class="container-border flex-c m-around ">
      <div>
        <h2>请输入用户名：</h2>
        <Input class="to-top" v-model="name" placeholder="请输入用户名..." style="width: 300px"></Input>
      </div>
      <div>
        <h2>请输入密码：</h2>
        <Input class="to-top" v-model="password" placeholder="请输入密码..." type="password" style="width: 300px"></Input>
      </div>
      <div>
        <Button type="primary" class="to-top-large" @click="login">登 录</Button>
      </div>
    </div>
  </div>
</template>

<script>
  const debug = require('debug')('login');
  const login = require('../api/login');
  const _ = require('lodash');
  const md5 = require('md5');
  const userStore = require('../api/userApi');

  export default {
    data() {
      return {
        name: '', // 用户名
        password: '', // 密码
      };
    },
    methods: {
      login() {
//        检查数据
        if (_.isEmpty(this.name) || _.isEmpty(this.password)) {
          this.$Notice.warning({
            title: '名称或密码不能为空',
          });
          return;
        }
        debug('拼装好的数据', {
          user: this.name,
          pwd: md5(this.password),
        });
//        发送请求
        login.post('/user/login', {
          user: this.name,
          pwd: md5(this.password),
        }).then((res) => {
          debug('返回结果成功', res);
          this.$Notice.success({
            title: '登录成功！',
          });
          // 存储用户信息
          userStore.setName(this.name);
          // 页面跳转
          window.location.hash = '/choose';
        }).catch((err) => {
          debug('返回结果失败', err);
          this.$Notice.error({
            title: err.response.data.err,
          });
        });
        debug('进来函数了');
      },
    },
  };
</script>

<style>

</style>
