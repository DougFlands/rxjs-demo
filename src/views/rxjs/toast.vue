<template>
  <div>
    <p @click="show">显示提示</p>
    <div v-show="showToast" ref="toast">一段提示</div>
  </div>
</template>

<script>
/** 一个提示
 */

import { timer } from "rxjs";
import { take } from "rxjs/operators";

export default {
  data() {
    return {
      showToast: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    show() {
      this.showToast = true;
      timer(0, 1000)
        .pipe(take(3))
        .subscribe({
          next: () => {
            console.log("next");
          },
          complete: () => {
            this.showToast = false;
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
