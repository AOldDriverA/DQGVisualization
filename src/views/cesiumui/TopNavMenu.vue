<!-- 顶部导航栏 -->
<template>
  <div class="topnavmenu">
    <slot />
  </div>
</template>

<script>

export default {
  name: "TopNavMenu",
  components: {
  },
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>
<style scoped>
/* 清除格式 */
* {
  margin: 0;
  padding: 0;
}

/* 导航栏整体设计 */
.topnavmenu {
  width: 100%;
  height: 35px;
  background-color: #333;
  box-shadow: 0 -2px 2px #000;
  display: flex;
}
</style>