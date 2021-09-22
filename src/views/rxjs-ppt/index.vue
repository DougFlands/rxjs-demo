<template>
  <div>
    <el-button
      v-for="item in 4"
      :key="item"
      @click="link('rxppt-' + item)"
      :type="now === 'rxppt-' + item ? 'success' : ''"
    >
      rxppt - {{ item }}
    </el-button>
    <br />
    <el-button @click="init"> init </el-button>
    <router-view ref="child" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      now: ""
    };
  },
  created() {
    this.now = this.$route.name;
  },
  mounted() {},
  methods: {
    link(name) {
      if (this.$route.name === name) return;
      this.now = name;
      this.$router.push({
        name
      });
    },
    init() {
      this.$refs.child.init();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
