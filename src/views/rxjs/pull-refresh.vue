<template>
  <div class="wrap">
    <div class="list-wrap">
      <div
        class="list"
        ref="list"
        :style="{
          transform: style.transform,
          'transition-duration': style.duration,
        }"
      >
        <div class="tips" ref="tips">下拉刷新</div>
        <div v-if="loading" style="margin-bottom: 20px">Loading</div>
        <div v-for="i in 10" :key="i" class="list-item">
          list {{ i + dataIndex }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/** 下拉列表刷新
 */

import { fromEvent, timer } from "rxjs";
import { concatAll, map, takeUntil, filter, tap, defer } from "rxjs/operators";

export default {
  data() {
    return {
      style: {
        transform: "translate3d(0px, 0px, 0px)",
        duration: "0ms"
      },
      dataIndex: 10,
      loading: false
    };
  },
  computed: {},
  mounted() {
    this.createRx();
  },
  methods: {
    createRx() {
      const touchStart$ = fromEvent(this.$refs.list, "touchstart");
      const touchMove$ = fromEvent(this.$refs.list, "touchmove");
      const touchEnd$ = fromEvent(this.$refs.list, "touchend");
      const touchUp$ = fromEvent(this.$refs.list, "touchup");
      const tipsHeight = this.$refs.tips.offsetHeight;
      touchStart$
        .pipe(
          map(e => {
            const touchY = e.changedTouches[0].clientY;
            e.stopPropagation();
            this.style.duration = "0ms";
            return touchMove$.pipe(
              takeUntil(touchEnd$),
              takeUntil(touchUp$),
              map(move => move.changedTouches[0].clientY - touchY),
              filter(range => range >= 0 && !this.loading),
              tap(range => {
                if (range < tipsHeight) {
                  this.style.transform = `translate3d(0px, ${range}px, 0px)`;
                } else {
                  // 触发请求
                  const rangePx = (range - 60) * 0.2 + 60;
                  this.style.transform = `translate3d(0px, ${rangePx}px, 0px)`;
                  this.loading = true;
                  setTimeout(() => {
                    this.loading = false;
                    this.dataIndex += 10;
                  }, 1000);
                }
              })
            );
          }),
          concatAll()
        )
        .subscribe();

      touchEnd$.pipe(tap(this.reset)).subscribe();
      touchUp$.pipe(tap(this.reset)).subscribe();
    },
    reset() {
      this.style.duration = "500ms";
      this.style.transform = `translate3d(0px, 0px, 0px)`;
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  height: 100vh;
  font-size: 0.2rem;
}
.list-wrap {
  overflow: hidden;
  .list {
    width: 100%;
    text-align: center;
    transition-duration: 0ms;
    .tips {
      position: absolute;
      left: 0;
      width: 100%;
      height: 1rem;
      transform: translateY(-100%);
    }
    .list-item {
      height: 2rem;
    }
  }
}
</style>