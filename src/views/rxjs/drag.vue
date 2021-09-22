<template>
  <div>
    <div class="drag" ref="drag"></div>
  </div>
</template>

<script>
// 拖曳
import { fromEvent } from "rxjs";
import { map, tap, takeUntil, concatAll } from "rxjs/operators";
export default {
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const el = this.$refs.drag;
      fromEvent(el, "mousedown")
        .pipe(
          map(e => {
            const { left, top } = e.target.getBoundingClientRect();
            const clickOffsetX = e.clientX - left;
            const clickOffsetY = e.clientY - top;
            return {
              clickOffsetX,
              clickOffsetY
            };
          }),
          map(({ clickOffsetX, clickOffsetY }) => {
            return fromEvent(el, "mousemove").pipe(
              takeUntil(fromEvent(el, "mouseup")),
              takeUntil(fromEvent(el, "mouseleave")),
              tap(e => {
                if (e.preventDefault) e.preventDefault();
              }),
              map(moveEvent => ({
                x: moveEvent.clientX - clickOffsetX,
                y: moveEvent.clientY - clickOffsetY
              })),
              tap(({ x, y }) => {
                el.style.left = x + "px";
                el.style.top = y + "px";
              })
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
.drag {
  width: 100px;
  height: 100px;
  background: rgb(255, 0, 0);
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}
</style>
