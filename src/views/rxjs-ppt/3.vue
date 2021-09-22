<template>
  <div>
    <el-button @click="iterator"> iterator </el-button>
    <el-button @click="add"> ++ </el-button>
  </div>
</template>

<script>
// rxjs 核心 Observable

import { interval, Observable } from "rxjs";
import { map, filter, take, delay } from "rxjs/operators";

export default {
  data() {
    return {
      observer: null,
      count: 0
    };
  },
  methods: {
    init() {
      // 可观察者对象
      const stream$ = interval(500).pipe(
        filter(i => i % 2 === 0),
        take(5),
        delay(2000),
        map(i => console.log(i))
      );

      // 观察者对象
      const stream1$ = stream$.subscribe({
        complete(val) {
          console.log("complete1", val);
        },
        error(val) {
          console.log("error1", val);
        },
        next(val) {
          console.log("next1", val);
        }
      });

      const stream2$ = stream$.subscribe({
        complete(val) {
          console.log("complete2", val);
        },
        error(val) {
          console.log("error2", val);
        },
        next(val) {
          console.log("next2", val);
        }
      });

      // 取消
      setTimeout(() => {
        stream1$.unsubscribe();
        stream2$.unsubscribe();
      }, 1000);

      // 发布订阅需要中间人
    },
    iterator() {
      new Observable(observer => {
        this.observer = observer;
      })
        .pipe()
        .subscribe({
          next: item => console.log(item)
        });
    },
    add() {
      this.count++;
      this.observer.next(this.count);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
