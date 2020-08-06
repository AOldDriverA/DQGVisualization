<!-- 顶部信息展示栏 -->
<template>
  <div class="item-info">
    <slot />
  </div>
</template>

<script>

export default {
  name: "TopNavMenuItemInfo",
  props: {
    itemName: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data () {
    return {
    };
  },
}
</script>

<style scoped>
.item-info {
  height: 35px;
  line-height: 35px;
  letter-spacing: 2px;
  width: 150px;
  color: #fff;
  font-size: 15px;
  text-align: center;
  background-color: #333;
}
</style>