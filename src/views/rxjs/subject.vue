<template>
  <div>
    <el-input v-model="value" ref="input" @input="handlerInput"></el-input>
  </div>
</template>

<script>
/** 输入时做防抖，之后发送数据，发送请求时如果上一次请求数据还未返回则丢弃
 * 核心是 Subject 如何运作的，Subject 既有 Observable 被观察者的能力，又有 subscribe 观察者的能力
 */

import { defer, Subject } from "rxjs";
import {
  tap,
  scan,
  debounceTime,
  switchMap,
  retryWhen,
  delay
} from "rxjs/operators";
import axios from "axios";

export default {
  data() {
    return {
      value: "",
      inputSub: null,
      searchInput$: null
    };
  },
  mounted() {
    this.inputSub = new Subject();
    this.init();
    this.init2();
  },
  methods: {
    init() {
      this.searchInput$ = this.inputSub.pipe(
        debounceTime(500),
        switchMap(value => {
          return defer(() => this.fetch(value)).pipe(
            tap(res => {
              console.log(res);
              if (res.data.data === "123") {
                throw res;
              }
            }),
            retryWhen(errors => {
              return errors.pipe(
                delay(500),
                scan((count, value) => {
                  if (count > 2) throw value;
                  return ++count;
                }, 1)
              );
            })
          );
        })
      );
      // 这是inputSub的第一个流
      const inputEvent$ = () => {
        return this.searchInput$.subscribe({
          error(e) {
            console.log("error", e);
            inputEvent$();
          }
        });
      };
      inputEvent$();
    },
    init2() {
      // 这是inputSub的第二个流
      this.inputSub
        .pipe(
          tap(v => {
            console.log(`init2: ${v}`);
          })
        )
        .subscribe();
    },
    fetch(value) {
      return axios.get(
        `http://yapi.in.wezhuiyi.com/mock/135/learn-manage/rxfetch?value=${value}`
      );
    },
    handlerInput(e) {
      this.inputSub.next(e);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
