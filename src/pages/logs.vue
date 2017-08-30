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

  .tables {
    border: 1px solid #e9eaec;
  }

  .tables .no-left {
    border-left: none;
  }

  .tables tr {
    height: 3rem;
  }

  .tables tr:hover {
    background: rgb(235, 247, 255);
  }

  .tables th {
    background: #f8f8f9;
    border-left: 1px solid #e9eaec;
    padding-left: 1.2rem;
    text-align: left;
  }

  .tables td {
    padding-right: 1.2rem;
    padding-left: 1.2rem;
    border-left: 1px solid #e9eaec;
    border-top: 1px solid #e9eaec;
  }
  /*-------私有样式-------*/
  /*.title {*/
    /*display: inline-block;*/

  /*}*/


</style>

<template>
  <div class="flex-c center">
    <div style="margin: 1rem;width: 90%;">
      <div class="flex-r between">
        <h2>所有授权记录</h2>
        <Button type="primary" @click="back">返 回</Button>
      </div>
      <table class="tables to-top" border="0" cellspacing="0" cellpadding="0" width="100%">
        <thead>
        <tr>
          <th class="no-left">授权人</th>
          <th>授权时间</th>
          <th>授权截止日期</th>
          <th>终端数量</th>
          <th>客户名</th>
          <th>联系人</th>
          <th>电话</th>
          <th>邮箱</th>
        </tr>
        </thead>
        <tbody>
        <!--设备列表展示-->
        <tr v-for="(item, index) in selectedHistPage" :key="index">
          <td class="no-left" >
            <span>{{item.operator}}</span>
          </td>
          <td>
            <span>{{item.time.substring(0, 10)}}</span>
          </td>
          <td>
            <span>{{item.expirtDate}}</span>
          </td>
          <td>
            <span>{{item.clientLimit}}</span>
          </td>
          <td>
            <span>{{item.organize}}</span>
          </td>
          <td>
            <span>{{item.contact}}</span>
          </td>
          <td>
            <span>{{item.tel}}</span>
          </td>
          <td>
            <span>{{item.email}}</span>
          </td>
        </tr>
        <!--暂无数据-->
        <tr v-if="logs.length === 0">
          <td colspan="8" style="text-align: center;">
            <span>暂无数据</span>
          </td>
        </tr>
        </tbody>
      </table>
      <Page v-if="logs.length>0" class="to-top-large" @on-change="changePage" :total="logs.length"></Page>
    </div>
  </div>
</template>

<script>
  /* eslint-disable prefer-const */

  const debug = require('debug')('logs');
  const _ = require('lodash');
const login = require('../api/login');

  export default {
    data() {
      return {
        logs: [],
        selectedHistPage: [],
      };
    },
    created() {
      debug('aaaaaaabbbbbbbb');
      this.getlogs();
    },
    methods: {
      // 返回选择页面
      back() {
        window.location.hash = '/choose';
      },
        // 获取日志
      getlogs() {
        login.post('/license/getLogs', {}).then((res) => {
          debug('从数据库取数据成功', res);
          this.logs = res.data.res;
          this.selectedHistPage = _.slice(this.logs, 0, 9);
          // 页面跳转
        }).catch((err) => {
          debug('从数据库取数据失败', err);
        });
      },
      // 点击分页,每页10条数据
      changePage(page) {
        debug('分页', page);
        let startItem = (page - 1) * 10;
        let endItem = ((page - 1) * 10) + 9;
        this.selectedHistPage = _.slice(this.logs, startItem, endItem);
      },
    },

  };
</script>

<style>

</style>
