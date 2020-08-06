<!-- 顶部导航栏单元的子单元属性 -->
<template>
  <div>
    <div
      class="top-nav-menu-sub-item"
      :class="{active: index === hoverIndex}"
      v-for="(item, index) in titles"
      :key="index"
      @mouseover="mouseOver(index)"
      @mouseout="mouseOut()"
      @click="click(item)"
    >
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopNavMenuSubItem",
  props: {
    titles: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      hoverIndex: -1,
      clickedIndex: -1,
      inputLon: {
        type: Number,
        default: 0.0
      },
      inputLat: {
        type: Number,
        default: 0.0
      },
      inputTime: {
        type: String,
        default: ""
      }
    };
  },
  methods: {
    mouseOver(index) {
      this.hoverIndex = index;
    },
    mouseOut() {
      this.hoverIndex = -1;
    },
    click(item) {
      switch (item) {
        case "单尺度DQG":
          this.$emit("topNavMenuSelected", item);
          break;
        case "多尺度DQG":
          this.$emit("topNavMenuSelected", item);
          break;
        case "三维DQG":
          this.$emit("topNavMenuSelected", item);
          break;
        case "北京近景":
          this.$emit("topNavMenuSelected", item);
          break;
        case "时空邻近查询":
          this.$emit("topNavMenuSelected", item);
          break;
        default:
      }
    },
    createForm() {}
  }
};
</script>

<style scoped>
.top-nav-menu-sub-item {
  width: 150px;
  height: 35px;
  line-height: 35px;
  background-color: #222;
  color: #fff;
  font-size: 15px;
  transition: 0.6s;
  text-align: center;
}

.active {
  background-color: rgb(60, 84, 94);
}
</style>