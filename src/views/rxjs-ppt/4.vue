<template>
  <div></div>
</template>

<script>
// 原理
import { Observable, of, fromEvent, interval, filter, map } from "./rx";
// import { Observable, of, fromEvent, interval } from "rxjs";
// import { filter, map } from "rxjs/operators";

export default {
  data() {
    return {
      interval$: null
    };
  },
  created() {},
  mounted() {},
  methods: {
    init() {
      // this.testOb()
      // this.testOf()
      this.testInterval();
      // this.testEvent();
    },
    testOb() {
      const ob$ = new Observable(observer => {
        observer.next(1);
        setTimeout(() => {
          observer.next(2);
          observer.complete();
        }, 1000);
        observer.next(3);
      });
      ob$.subscribe({
        next: x => console.log(x),
        error: err => console.error(err),
        complete: () => console.log("done")
      });
    },
    testOf() {
      of(1, 2, 3, 4, 5, 6)
        .pipe(
          filter(i => i % 2 === 0),
          map(i => {
            console.log(i);
          })
        )
        .subscribe();
    },
    testInterval() {
      this.interval$ = interval(1000)
        .pipe(map(console.log))
        .subscribe();

      setTimeout(() => {
        this.interval$.unsubscribe();
      }, 2000);
    },
    testEvent() {
      const click$ = fromEvent(document.body, "click")
        .pipe(
          map(e => {
            console.log(e);
          })
        )
        .subscribe();

      setTimeout(() => {
        click$.unsubscribe();
      }, 1000);
    }
  }
};
</script>

<style lang="scss">
body {
  height: 100vh;
}
</style>
