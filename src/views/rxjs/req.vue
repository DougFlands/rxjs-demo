<template>
  <div>
    <div @click="test">test</div>
    <div @click="test1">test1</div>
  </div>
</template>

<script>
import { defer, forkJoin } from "rxjs";
import { tap, retryWhen, delay, scan, map, takeUntil } from "rxjs/operators";
import axios from "axios";

axios.interceptors.response.use(
  () => {},
  err => err.response
);

/* 几种错误情况
 * 超时
 * http status 错误
 * 后端 code 错误
 */

// 错误处理 √
// 重试 √
// 返回Promise √
// 丢弃
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    /* 
      option.retry 重试
    */
    async rxFetch(option) {
      option = {
        retry: 3
      };

      return new Promise(resolve => {
        const _retryWhen = retryWhen(errors => {
          let response;
          return errors.pipe(
            tap(res => (response = res)),
            scan(count => {
              count += 1;
              if (count < option.retry) return count;
              resolve([response, "error"]);
              fetchRx$.unsubscribe();
            }, 0)
          );
        });

        const fetchRx$ = defer(() => this.fetch())
          .pipe(
            tap(fetchRes => {
              console.log("fetchRes", fetchRes);
              // 超时
              if (!fetchRes) throw "";
              // 出错
              if (fetchRes && fetchRes.status === 500) throw fetchRes;
              resolve([fetchRes, null]);
            }),
            takeUntil(fetchRx$),
            _retryWhen
          )
          .subscribe();
      });
    },
    fetch(bool = 1) {
      return axios.get(
        `http://yapi.in.wezhuiyi.com/mock/135/learn-manage/fetch/test?bool=${bool}`,
        {
          timeout: 500
        }
      );
    },
    async test() {
      const [res, err] = await this.rxFetch();
      if (err === null) {
      }
      console.log(res);
    },
    async test1() {}
  }
};
</script>

<style lang="scss" scoped>
</style>
