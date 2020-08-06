<!-- 顶部导航栏单元的属性 -->
<template>
  <div
    class="top-nav-menu-item"
    :class="{active: isHover}"
    @mouseover="mouseOver"
    @mouseout="mouseOut"
  >
    <div class="item-name">
      <slot name="item-name" />
    </div>
    <div class="sub-item-name" v-show="isHover">
      <slot name="item-content" />
    </div>
  </div>
</template>

<script>

export default {
  name: "TopNavMenuItem",
  props: {
    subItemNames: {
      type: Array,
      default() {
        return [];
      }
    },
    subItemPath: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
  },
  data() {
    return {
      isHover: false,
      currentIndex: 0
    };
  },
  methods: {
    mouseOver() {
      this.isHover = true;
    },
    mouseOut() {
      this.isHover = false;
    }
  }
};
</script>

<style scoped>
.top-nav-menu-item {
  width: 150px;
  height: 35px;
  background-color: #222;
  font-size: 15px;
  transition: 0.6s;
  text-align: center;
  cursor: pointer;
}

.item-name {
  height: 35px;
  line-height: 35px;
  color: #fff;
}

.active {
  background-color: rgb(60, 84, 94);
}
</style>