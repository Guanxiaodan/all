<style scoped>
  /*-------公共样式-------*/
  .to-top {
    margin-top: 1rem;
  }

  .to-top-large {
    margin-top: 2rem;
  }

  .to-bottom {
    margin-bottom: 1rem;
  }

  .to-bottom-large {
    margin-bottom: 2rem;
  }

  .to-left-large {
    margin-left: 5rem;
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
  }


</style>

<template>
  <div class="flex-c container-all">
    <heads></heads>
    <div class="flex-c center" style="height: 80%;">
      <!--请求码解析成功后的展示信息-->
      <div v-if="showMag.客户名" class="to-bottom-large">
        <h2>用户信息</h2>
        <div class="flex-r between to-top" style="width: 30rem">
          <h3>客户名：{{showMag.客户名}}</h3>
          <h3>联系人：{{showMag.联系人}}</h3>
          <h3>电话：{{showMag.电话}}</h3>
          <h3>邮件：{{showMag.邮件}}</h3>
        </div>
      </div>
      <!--解析请求码-->
      <div v-if="!showMag.客户名">
        <h2>请输入请求码：</h2>
        <Input class="to-top" v-model="requestCode" type="textarea" :autosize="{minRows: 8,maxRows: 12}"
               style="width: 30rem" placeholder="请输入请求码..."></Input>
        <div>
          <Button type="primary" class="to-top-large" :disabled="isSending" @click="sendreq">
            {{isSending ? '正在解析' : '解析请求码'}}
          </Button>
          <Button type="primary" class="to-top-large to-left-large" @click="back">返 回</Button>
        </div>
      </div>
      <!--解析成功后显示请求码-->
      <div v-if="showMag.客户名 && !authorizeCode">
        <h2>请求码：</h2>
        <div
          style="width: 30rem; height: 10rem;overflow: scroll;border: 1px solid #ccc;word-wrap:break-word;text-align: left">
          {{requestCode}}
        </div>
      </div>
      <!--填写生成授权码的按相关信息-->
      <div v-if="showMag.客户名 && !authorizeCode" class="to-top-large">
        <div class="flex-r">
          <h2>请选择截止日期：</h2>
          <DatePicker type="date" @on-change="changeDate" :options="options4" placeholder="请选择截止日期"
                      style="width: 200px"></DatePicker>
        </div>
        <div class="flex-r to-top">
          <h2>请输入终端数量：</h2>
          <Input v-model="num" placeholder="请输入..." style="width: 300px"></Input>
        </div>
        <div>
          <Button type="primary" class="to-top-large" :disabled="isSending" @click="getAuthorize">
            {{isSending ? '正在获取...' : '生成授权码'}}
          </Button>
          <Button type="primary" class="to-top-large to-left-large" @click="back">返 回</Button>
        </div>
      </div>
      <!--显示授权码-->
      <div v-if="authorizeCode" class="to-top-large">
        <h2>授权码：</h2>
        <div
          style="width: 30rem; height: 10rem;overflow: scroll;border: 1px solid #ccc;word-wrap:break-word;text-align: left">
          {{authorizeCode}}
        </div>
        <Button type="primary" class="to-top-large" @click="back">返 回</Button>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable indent,object-shorthand */

  const heads = require('../components/header.vue');
  const debug = require('debug')('authorize');
  const login = require('../api/login');
  const _ = require('lodash');

  export default {
    data() {
      return {
        requestCode: '', // 请求码
        showMag: {}, // 请求码解析成功后返回的数据
        isSending: false, // 是否正在发送数据
        date: '', // 截止日期
        num: 1, // 终端数量
        authorizeCode: '', // 获取到的授权码
        options4: { // 禁用日期
          disabledDate(date) {
            const disabledDay = date.getDate();
            return disabledDay === 31;
          },
        },
      };
    },
    methods: {
      // 返回选择页
      back() {
        window.location.hash = '/choose';
      },
      // 切换时间
      changeDate(date) {
        this.date = date;
      },
//      解析请求码
      sendreq() {
        this.isSending = true;
        if (_.isEmpty(this.requestCode)) {
          this.isSending = false;
          this.$Notice.warning({
            title: '请求码不能为空！',
          });
          return;
        }
        login.post('/license/parseReq', { reqCode: this.requestCode }).then((result) => {
          debug('解析结果', result.data.ret);
          this.isSending = false;
          this.showMag = result.data.ret;
          this.$Notice.success({
            title: '解析成功！',
          });
        }).catch((err) => {
          this.isSending = false;
          this.showMag = {};
          this.requestCode = '';
          this.$Notice.error({
            title: err.response.data.err,
          });
          debug('解析失败', err);
        });
        debug('发送请求码');
      },
      // 获取授权码
      getAuthorize() {
        // 判断数据合法性
        if (_.isEmpty(this.date) || _.isEmpty(this.num)) {
          debug('date,num', _.isEmpty(this.date), _.isEmpty(this.num));
          this.$Notice.warning({
            title: '截止日期、数量、请求码不能为空！',
          });
          return;
        }
//          // 比较截止日期与当前时间
        const t = new Date();
        const today = `${t.getFullYear()}-${t.getMonth() + 1 >= 10 ? t.getMonth() + 1 : `0${t.getMonth() + 1}`}-${t.getDate() >= 10 ? t.getDate() : `0${t.getDate()}`}`;
        if (today > this.date) {
          this.$Notice.warning({
            title: '截止日期不能小于今天！',
          });
          return;
        }

//          整合数据
        const splitDate = _.split(this.date, '-');
        const send = {
          reqCode: this.requestCode,
          year: splitDate[0],
          month: splitDate[1],
          day: splitDate[2],
          clientLimit: this.num,
        };
        this.isSending = true;
        debug('获取授权码', send);

//          发送请求
        login.post('/license/getLicense', send).then((res) => {
          debug('这是返回的授权码成功', res);
          this.authorizeCode = res.data.ret;
          this.$Notice.success({
            title: '生成授权码成功！',
          });
          this.isSending = false;
        }).catch((err) => {
          debug('这是返回的授权码失败', err);
          this.$Notice.error({
            title: '生成授权码失败！',
          });
          this.isSending = false;
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
