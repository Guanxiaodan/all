<style scoped>
  /*--------私有样式--------*/
  .header {
    height: 4rem;
    background: #6999f0;
  }
  .back {
    display: inline-block;
    font-size: 1rem;
    margin-right: 3rem;
    color: red;
    cursor: pointer;
  }
  .user {
    font-size: 1rem;
    color: white;
  }
  .title {
    color: white;
    letter-spacing: 1px;
  }
  .point {
    cursor: pointer;
  }
</style>

<template>
  <div class="header flex-r x-center between">
    <h1 class="to-left-large title">智慧班牌授权管理平台</h1>
    <div class="flex-r">
      <div class="user">
        <span>{{name}}</span>
      </div>
      <div class="user to-left-large point" @click="changePass">
        修改密码
      </div>
      <div class="to-left-large" style="text-align: right;">
        <span class="back" @click="skip">退 出</span>
      </div>
    </div>
  </div>
</template>

<script>
  //  const debug = require('debug')('choose');
  const userStore = require('../api/userApi');

  export default {
    name: 'heads',
    data() {
      return {
        name: 'gxd',
      };
    },
    methods: {
      // 跳转到登录页
      skip() {
        window.location.hash = '/';
      },
      // 修改密码
      changePass() {
        window.location.hash = '/change';
      },
    },
    created() {
      this.name = userStore.getName();
    },
  };
</script>

<style>

</style>
