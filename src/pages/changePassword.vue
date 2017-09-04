<style scoped>
  /*--------私有样式--------*/

</style>

<template>
  <div class="flex-c cover">
    <heads></heads>
    <div class=" flex-c center" style="height: 75%">
      <div>
        <h2>请输入新密码：</h2>
        <Input class="to-top" v-model="passone" placeholder="请输入新密码..." type="password" style="width: 300px"></Input>
      </div>
      <div class="to-top-large">
        <h2>请重新输入新密码：</h2>
        <Input class="to-top" v-model="passtwo" placeholder="请重新输入新密码..." type="password" style="width: 300px"></Input>
      </div>
      <div>
        <Button type="primary" class="to-top-large" @click="modify">确 定</Button>
        <Button type="primary" class="to-top-large to-left-large" @click="back">返 回</Button>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable object-shorthand */

  const debug = require('debug')('modify');
  const md5 = require('md5');
  const heads = require('../components/header.vue');
  const _ = require('lodash');
  const userStore = require('../api/userApi');
  const login = require('../api/login');

  export default {
    data() {
      return {
        passone: '',
        passtwo: '',
      };
    },
    methods: {
      // 返回选择页面
      back() {
        window.location.hash = '/choose';
      },
      // 修改密码
      modify() {
        debug('mima111', this.passtwo);
        debug('mima222', md5(this.passtwo));
        if (_.isEmpty(this.passone) || _.isEmpty(this.passtwo)) {
          this.$Notice.warning({
            title: '密码不能为空！',
          });
          return;
        }
        if (this.passone !== this.passtwo) {
          this.$Notice.warning({
            title: '两次密码不一致，请重新输入！',
          });
          return;
        }

        const sendData = {
          user: userStore.getName(),
          pwd: md5(this.passone),
        };
        debug('这个是要发送的用户数据', sendData);


        login.post('/user/modify', sendData).then((res) => {
          debug('返回结果成功', res);
          this.$Notice.success({
            title: '密码修改成功，请重新登录',
          });
          setTimeout(() => {
            window.location.hash = '/';
          }, 1000);
        }).catch((err) => {
          debug('返回结果失败', err);
          this.$Notice.error({
            title: err.response.data.err,
          });
        });
      },
    },
    components: {
      heads: heads,
    },
  };
</script>

<style>

</style>
