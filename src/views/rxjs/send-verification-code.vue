<template>
  <div>
    <el-button type="primary" :loading="loading" @click="click">
      {{ text }}
    </el-button>
  </div>
</template>

<script>
/** 发送验证码，并开始倒计时
 */

import { interval, defer } from "rxjs";
import { tap, take, concatAll } from "rxjs/operators";

export default {
  data() {
    return {
      loading: false,
      text: "发送",
      send$: null
    };
  },
  methods: {
    click() {
      if (this.send$ && !this.send$.closed) return;
      this.send$ = defer(() => fetch("https://flands.com"))
        .pipe(
          map(data => {
            console.log(data);
            return interval(1000).pipe(
              tap(t => {
                if (t < 5) {
                  this.text = 5 - t;
                  this.loading = true;
                  return;
                }
                this.text = "发送";
                this.loading = false;
              }),
              take(6)
            );
          }),
          concatAll()
        )
        .subscribe();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
