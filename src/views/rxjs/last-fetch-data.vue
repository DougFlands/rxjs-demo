<template>
  <div>
    <el-button type="primary" @click="click1"> 获取数据 </el-button>
    <el-button type="primary" @click="click2"> 发送请求 </el-button>
  </div>
</template>

<script>
/** 发送请求并保存结果，多次获取拿最后一次结果
 *  获取数据 -> 发送请求 -> 获取数据 -> 获取数据
 */

import { defer } from "rxjs";
import { publishLast } from "rxjs/operators";

export default {
  data() {
    return {
      text: "发送",
      send$: null
    };
  },
  mounted() {
    this.send();
  },
  methods: {
    click1() {
      this.send$.subscribe(console.log);
    },
    click2() {
      this.send$.connect();
    },
    send() {
      this.send$ = defer(() => fetch("https://www.baidu.com")).pipe(
        publishLast()
      );
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
