<template>
  <div class="page" ref="page">
    <div class="img-wrap">
      <img
        src="../1.png"
        alt=""
        ref="img"
        class="img"
        v-stream:touchstart="imgTouchstart$"
        v-stream:touchmove="imgTouchmove$"
        v-stream:touchend="imgTouchend$"
      />
    </div>
  </div>
</template>
<script>
/** 双指缩放图片
 * 这里使用了 vue-rx
 */

import { Subject } from "rxjs";
import { map, takeUntil, filter, tap, withLatestFrom } from "rxjs/operators";
import vConsole from "vconsole";
new vConsole();

// 获取坐标之间的距离
const getDistance = (start, stop) => {
  return Math.hypot(stop.x - start.x, stop.y - start.y);
};

export default {
  data() {
    return {
      width: 0,
      height: 0,
      scale: 1
    };
  },
  mounted() {
    this.width = this.$refs.img.offsetWidth;
    this.height = this.$refs.img.offsetHeight;
  },
  subscriptions() {
    this.imgTouchstart$ = new Subject();
    this.imgTouchmove$ = new Subject();
    this.imgTouchend$ = new Subject();

    const imgTouchmove = this.imgTouchmove$.pipe(
      takeUntil(this.imgTouchend$),
      map(event => event.event.touches)
    );

    const imgTouchstart = this.imgTouchstart$.pipe(
      filter(({ event }) => event.touches[0] && event.touches[1]),
      tap(({ event }) => event.preventDefault()),
      map(event => {
        const touches = event.event.touches;
        return {
          pageX: touches[0].pageX,
          pageY: touches[0].pageY,
          scale: this.scale
        };
      }),
      withLatestFrom(imgTouchmove),
      map(data => {
        console.log("data", data);

        const touches = data[1];
        let { pageX, pageY, scale } = data[0];

        const events = touches[0];
        const events2 = touches[1];
        const pageX2 = events2.pageX;
        const pageY2 = events2.pageY;

        // 双指缩放比例计算
        const zoom =
          getDistance(
            {
              x: events.pageX,
              y: events.pageY
            },
            {
              x: pageX2,
              y: pageY2
            }
          ) /
          getDistance(
            {
              x: pageX,
              y: pageY
            },
            {
              x: pageX2,
              y: pageY2
            }
          );

        // 应用在元素上的缩放比例
        return scale * zoom;
      }),
      filter(newScale => newScale >= 1 && newScale <= 2),
      tap(newScale => {
        this.scale = newScale;
        this.$refs.img.style.width = this.width * newScale + "px";
        this.$refs.img.style.height = this.height * newScale + "px";
      })
    );

    return {
      imgTouchstart
    };
  }
};
</script>

<style lang="scss" scoped>
.page {
  background: #f1f1f1;
  height: 100vh;
}
.img-wrap {
  width: 300px;
  height: 300px;
  overflow-x: scroll;
  overflow-y: scroll;
  .img {
    width: 281px;
    height: 281px;
  }
}
</style>
