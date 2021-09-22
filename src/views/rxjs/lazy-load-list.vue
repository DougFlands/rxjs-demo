<template>
  <div class="page" ref="scroll">
    <div v-for="i in dataIndex" :key="i" class="item">{{ i }}</div>
    <p class="loading" v-show="loading">loading</p>
  </div>
</template>

<script>
/** 滚动到底部时请求数据
 * 节流 + 等待至少2000ms
 */

import { fromEvent, forkJoin, timer, from } from "rxjs";
import { tap, map, filter, debounceTime, concatAll } from "rxjs/operators";
import axios from "axios";

export default {
  data() {
    return {
      loading: false,
      dataIndex: 10
    };
  },
  methods: {
    init() {
      fromEvent(this.$refs.scroll, "scroll")
        .pipe(
          debounceTime(100),
          filter(
            ({ target: { scrollHeight, scrollTop, clientHeight } }) =>
              scrollHeight - scrollTop - 10 <= clientHeight && !this.loading
          ),
          map(() => {
            // 必须等待 1000 毫秒
            this.loading = true;
            // promise.all
            return forkJoin([from(this.fetch(1)), timer(2000)]).pipe(
              map(res => res[0])
            );
          }),
          concatAll(), // await
          tap(res => {
            this.dataIndex += 10;
            this.loading = false;
            console.log(res.data);
          })
        )
        .subscribe();
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
.page {
  height: 12rem;
  overflow: scroll;
  .item {
    width: 100%;
    height: 1.8rem;
    line-height: 1.8rem;
    background: #b8b8b8;
    text-align: center;
    margin-bottom: 0.4rem;
  }
}
</style>
