<template>
  <div></div>
</template>

<script>
import { interval } from "rxjs";
import { tap, take } from "rxjs/operators";

export default {
  methods: {
    // 流的概念，在
    init() {
      // 每 500ms 扔出一个数据，从0开始
      interval(500)
        .pipe(
          // 只接受5次数据
          take(5),
          // 执行console
          tap(i => console.log(i))
        )
        .subscribe();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
