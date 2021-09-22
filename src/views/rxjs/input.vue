<template>
  <div>
    <el-input v-model="value" ref="input"></el-input>
  </div>
</template>

<script>
/** 输入时做防抖，之后发送数据，发送请求时如果上一次请求数据还未返回则丢弃
 */

import { fromEvent, defer } from "rxjs";
import {
  tap,
  map,
  debounceTime,
  switchMap,
  retry,
  concatAll
} from "rxjs/operators";
import axios from "axios";

export default {
  data() {
    return {
      value: ""
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const input$ = fromEvent(this.$refs.input.$el, "input").pipe(
        map(el => el.target.value),
        debounceTime(500),
        switchMap(value => {
          return defer(() => this.fetch(value)).pipe(
            tap(res => {
              console.log(res);
              if (res.data.data === "123") {
                throw res;
              }
            }),
            retry(2)
          );
        }),
        concatAll()
      );
      const inputEvent$ = () => {
        return input$.subscribe({
          error(e) {
            console.log("error", e);
            inputEvent$();
          }
        });
      };
      inputEvent$();
    },
    fetch(value) {
      return axios.get(
        `http://yapi.in.wezhuiyi.com/mock/135/learn-manage/rxfetch?value=${value}`
      );
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
