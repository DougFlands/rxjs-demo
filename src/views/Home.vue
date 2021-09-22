<template>
  <div class="home">
    <el-button v-for="item in linkArr" :key="item" @click="link(item)">
      {{ item }}
    </el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      linkArr: ["rx-demo", "rx-ppt"]
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
