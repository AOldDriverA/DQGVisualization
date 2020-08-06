<!-- 页面布局 -->
<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">漫游</el-menu-item>
      <el-menu-item index="2">影像</el-menu-item>
      <el-menu-item index="3">分析</el-menu-item>
    </el-menu>
    <el-container>
      <el-header>Header</el-header>
      <el-main>Main</el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Layout",
  data () {
    return {
      activeIndex: '1',
      activeIndex2: '2',
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>