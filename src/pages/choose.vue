<style scoped>
  /*-------公共样式-------*/
  .to-top {
    margin-top: 1rem;
  }

  .to-top-large {
    margin-top: 2rem;
  }

  .cover {
    width: 100%;
    height: 100%;
  }

  .shadow {
    box-shadow: 0 0 2px rgba(0, 0, 0, .3), 0 1px 8px rgba(0, 0, 0, .3);
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

  /*--------私有样式--------*/
  .img {
    width: 10rem;
    height: 10rem;
  }

  .border {
    border: 1px solid #ccc;
    border-radius: 1rem;
  }

  .border:hover {
    box-shadow: 0 0 2px rgba(0, 0, 0, .3), 0 1px 8px rgba(0, 0, 0, .3);
  }

</style>

<template>
  <div class="flex-c cover">
    <heads></heads>
    <div class=" flex-c center" style="height: 75%">
      <div style="width:30rem; height: 15rem;" class="flex-r between">
        <div class="flex-c border" @click="skip('authorize')">
          <img src="../assets/aut.png" class="img">
          <h1>创建授权</h1>
        </div>
        <div class="flex-c border" @click="skip('logs')">
          <img src="../assets/log.png" class="img">
          <h1>查看日志</h1>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  /* eslint-disable object-shorthand */

  //  const debug = require('debug')('choose');
  const heads = require('../components/header.vue');

  export default {
    data() {
      return {};
    },
    methods: {
      skip(path) {
        if (path === 'authorize') {
          window.location.hash = '/authorize';
        } else {
          window.location.hash = '/logs';
        }
      },
    },
    components: {
      heads: heads,
    },
  };
</script>

<style>

</style>
