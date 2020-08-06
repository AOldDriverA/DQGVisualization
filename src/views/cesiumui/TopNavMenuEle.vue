<!-- 顶部导航栏 -->
<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="topnavmenu"
      model="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-submenu index="1" class="topsubmenu">
        <div slot="title" class="topsubtitle">漫游</div>
        <el-menu-item index="1-1" width="100px" class="topsubmenuitem">地球</el-menu-item>
        <el-menu-item index="1-2" width="100px" class="topsubmenuitem">DQG</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "TopNavMenu",
  data() {
    return {
      activeIndex: "1"
    };
  }
};
</script>

<style>
.topnavmenu,
.topsubtitle,
.el-submenu__title {
  height: 40px;
  line-height: 40px;
}

.el-submenu,
.el-menu-item {
    height: 40px;
  line-height: 40px;
}

.el-submenu__title,
.el-menu--inline,
.el-menu-item,
.topsubmenuitem {
  width: 100px;
}
</style>