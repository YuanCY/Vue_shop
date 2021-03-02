<template>
  <div>
    <h1>home</h1>
    <el-button type="danger" @click="exitLogin">退出登陆</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    exitLogin() {
      //   console.log('退出')
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
</style>
