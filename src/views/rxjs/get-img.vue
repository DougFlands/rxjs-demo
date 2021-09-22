<template>
  <div></div>
</template>

<script>
/** 获取图片数据
 * 有两个，1 在禁用缓存的情况下会重新请求请求成功的图片，于是有 2 这种方式
 * 感谢 @邢红运 大佬的代码
 */

import { of } from "rxjs";
import { filter, map, mergeAll, retry, tap } from "rxjs/operators";

export default {
  data() {
    return {
      successImageArry: [],
      source$: null
    };
  },
  beforeDestroy() {
    this.source$ && this.source$.unsubscribe();
  },
  methods: {
    imgLoad(url) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          resolve(image);
        };
        image.onerror = () => {
          reject(url);
        };
        image.src = url;
      });
    },
    preloadImage1(img) {
      this.source$ = of(...img)
        .pipe(
          map(val => this.imgLoad(val)),
          mergeAll(),
          retry(4)
        )
        .subscribe({
          next: val => {
            if (
              this.successImageArry.findIndex(item => item.src === val.src) < 0
            ) {
              this.successImageArry.push(val);
            }
          },
          complete() {
            console.log("complete");
          },
          error() {
            console.log("error");
          }
        });
    },
    preloadImage2(img) {
      const imgIsSuccess = val =>
        this.successImageArry.findIndex(item => item.src === val) < 0;
      return new Promise((resolve, reject) => {
        this.source$ = of(...img)
          .pipe(
            filter(val => imgIsSuccess(val)),
            map(val => this.imgLoad(val)),
            mergeAll(),
            tap(
              val => imgIsSuccess(val.src) && this.successImageArry.push(val)
            ),
            retry(10)
          )
          .subscribe({
            complete() {
              resolve();
            },
            error() {
              reject();
            }
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
