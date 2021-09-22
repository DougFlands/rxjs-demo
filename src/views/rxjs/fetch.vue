<template>
  <div>
    <p @click="fetch1">fetch1</p>
    <p @click="fetch2">fetch2</p>
  </div>
</template>

<script>
/** 发送请求
 * fetch1 重试逻辑
 * fetch2 两个流同时处理，当都结束后再执行下一步操作
 * fetch3 promise 类型
 */

import { defer, forkJoin } from "rxjs";
import { tap, retryWhen, delay, scan, map } from "rxjs/operators";

export default {
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    fetch1() {
      const fetchRx$ = defer(() => fetch("https://flands.com"))
        .pipe(
          tap(res => {
            console.log("fetch");
            if (!res.body) throw "error";
          }),
          retryWhen(errors =>
            errors.pipe(
              scan(count => {
                count += 1;
                if (count < 3) return count;
                console.log("网络问题");
                fetchRx$.unsubscribe();
              }, 1)
            )
          )
        )
        .subscribe();
    },
    fetch2() {
      const fetchRx1$ = defer(() => fetch("https://flands.com"));
      const fetchRx2$ = defer(() => fetch("https://flands.com")).pipe(
        delay(3000),
        map(res => {
          return res;
        })
      );
      // forkJoin 类似 promise.all
      const fetchAll$ = forkJoin([fetchRx1$, fetchRx2$]);

      fetchAll$.subscribe(res => {
        console.log(res);
      });
    },
    async fetch3() {
      try {
        const stream$ = await defer(() =>
          axios.get(
            "https://yapi.in.wezhuiyi.com/mock/135/learn-manage/rxfetch"
          )
        )
          .pipe(
            tap(res => {
              console.log("fetch");
              // if (!res.body) throw res.body;
              throw res.data;
            }),
            catchError(error => {
              return throwError(error);
            }),
            retry(1)
          )
          // 此方式在rxjs7会被标记为不推荐
          .toPromise();
      } catch (error) {
        console.log(error);
      }

      console.log(22);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
