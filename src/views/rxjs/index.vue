<template>
  <div class="home">
    <el-button
      type="primary"
      @click="link(item)"
      v-for="item in arr"
      :key="item"
    >
      {{ item }}
    </el-button>
    <router-view ref="child" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      arr: [
        "rx-test",
        "rx-pull-refresh",
        "rx-fetch",
        "rx-toast",
        "rx-ScaleRx",
        "rx-last-fetch-data",
        "rx-send-verification-code",
        "rx-wait-time-fetch",
        "rx-get-img",
        "rx-req",
        "rx-drag",
        "rx-subject",
        "rx-lazy-load-list"
      ]
    };
  },
  mounted() {},
  methods: {
    link(name) {
      this.$router.push({
        name
      });
    }
  }
};
</script>
