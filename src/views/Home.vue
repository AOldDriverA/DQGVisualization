<template>
  <div id="home" @dblclick="doubleClick">
    <div class="title">疫情查询可视化</div>
    <!-- 初始化Cesium -->
    <init-cesium class="initCesium"></init-cesium>
    <div id="cesium-credit"></div>
    <div id="cesiumContainer"></div>
    <!-- 顶部导航栏 -->
    <top-nav-menu class="topnavmenu">
      <!-- 网格部分 -->
      <top-nav-menu-item>
        <div slot="item-name" @click="drawDefault" @mouseover="mouseOver" @mouseout="mouseOut">网格</div>
        <div slot="item-content" @mouseover="mouseOver" @mouseout="mouseOut">
          <!-- <top-nav-menu-sub-item @click.native="draw2dDQG">单尺度DQG</top-nav-menu-sub-item>
          <top-nav-menu-sub-item @click.native="drawMultiDQG">多尺度DQG</top-nav-menu-sub-item>
          <top-nav-menu-sub-item>三维DQG</top-nav-menu-sub-item>-->
          <top-nav-menu-sub-item
            slot="item-content"
            :titles="DQGTypes"
            @topNavMenuSelected="topNavMenuSelected"
          />
        </div>
      </top-nav-menu-item>
      <!-- 影像部分 -->
      <top-nav-menu-item>
        <div slot="item-name">影像</div>
        <top-nav-menu-sub-item
          slot="item-content"
          :titles="Roam"
          @topNavMenuSelected="topNavMenuSelected"
        />
      </top-nav-menu-item>
      <!-- 工具分析 -->
      <top-nav-menu-item>
        <div slot="item-name">分析</div>
        <top-nav-menu-sub-item
          slot="item-content"
          :titles="Analysis"
          @topNavMenuSelected="topNavMenuSelected"
        />
      </top-nav-menu-item>
    </top-nav-menu>
    <!-- 调节网格细分阈值 -->
    <select-draw-grid
      class="selectdrawgrid"
      v-show="this.$store.state.isShowSelectDraw && (this.$store.state.isDrawDefault || this.$store.state.isDraw2dDQG || this.$store.state.isDrawMultiDQG)"
      @factorChange="factorChange"
    >{{DQGItems[curDQGIndex]}}</select-draw-grid>
    <!-- 网格信息框 -->
    <picked-grid-info
      class="pickedgridinfo"
      v-show="this.$store.state.isShowGridInfo && (this.$store.state.isDrawDefault || this.$store.state.isDraw2dDQG || this.$store.state.isDrawMultiDQG)"
    ></picked-grid-info>
    <!-- 时空查询窗口 -->
    <search-form v-show="topNavMenuClicked === 0" @closeSearchForm="closeSearchForm"></search-form>
    <!-- 绘制网格 -->
    <draw-grid></draw-grid>
  </div>
</template>

<script>
import InitCesium from "./cesiumui/InitCesium";
import TopNavMenu from "./cesiumui/TopNavMenu";
import TopNavMenuItem from "./cesiumui/TopNavMenuItem";
import TopNavMenuSubItem from "./cesiumui/TopNavMenuSubItem";
import SelectDrawGrid from "@/components/infotable/SelectDrawGrid";
import PickedGridInfo from "@/components/infotable/PickedGridInfo";
import SearchForm from "@/components/infotable/SearchForm";

import DrawGrid from "../components/drawgrid/DrawGrid";

// import { request } from "../network/request";

export default {
  name: "Home",

  data() {
    return {
      curDQGIndex: 0,
      DQGTypes: ["单尺度DQG", "多尺度DQG", "三维DQG"],
      Roam: ["北京近景"],
      DQGItems: ["单尺度DQG网格", "多尺度DQG网格", "三维DQG网格"],
      Analysis: [
        "时空邻近查询",
        "空间邻近查询",
        "空间距离计算",
        "网格信息查询"
      ],
      topNavMenuClicked: -1
    };
  },

  components: {
    InitCesium,
    TopNavMenu,
    TopNavMenuItem,
    TopNavMenuSubItem,
    SelectDrawGrid,
    PickedGridInfo,
    SearchForm,
    DrawGrid
  },

  created() {},

  mounted() {},
  methods: {
    /**
     * 默认绘制二维单尺度DQG网格
     */
    drawDefault() {
      this.curDQGIndex = 0;
      this.$EventBus.$emit("drawDefault");
    },

    /**
     * 绘制二维单尺度DQG网格
     */
    draw2dDQG() {
      this.curDQGIndex = 0;
      this.$EventBus.$emit("draw2dDQG");
    },

    /**
     * 绘制二维多尺度网格
     */
    drawMultiDQG() {
      this.curDQGIndex = 1;
      this.$EventBus.$emit("drawMultiDQG");
    },

    flyToBeijing() {
      this.$viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.3905334, 39.9147034, 100000.0)
      })
    },

    /**
     * 细分阈值发生变化
     */
    factorChange(factor) {
      this.$EventBus.$emit("factorChange", factor);
    },

    /**
     * 屏幕双击时，显示网格信息
     */
    doubleClick(event) {
      this.$EventBus.$emit("doubleClick", event);
    },

    /**
     * 确定选择的控件
     */
    topNavMenuSelected(index) {
      switch (index) {
        case "单尺度DQG":
          this.draw2dDQG();
          break;
        case "多尺度DQG":
          this.drawMultiDQG();
          break;
        case "三维DQG":
          break;
        case "北京近景":
          this.flyToBeijing();
          break;
        case "时空邻近查询":
          this.topNavMenuClicked = 0;
          break;
        default:
      }
    },

    // 当鼠标移入网格标题时
    mouseOver() {
      this.$store.state.isShowSelectDraw = false;
    },

    // 当鼠标移出网格标题时
    mouseOut() {
      this.$store.state.isShowSelectDraw = true;
    },

    closeSearchForm() {
      this.topNavMenuClicked = -1;
    }
  },

  // 及时清空事件总线
  beforeDestroy() {
    this.$EventBus.$off(
      "drawDefault",
      "draw2dDQG",
      "drawMultiDQG",
      "factorChange",
      "doubleClick",
      "pickedGridInfo"
    );
  }
};
</script>

<style scoped>
.title {
  position: absolute;
  top: 0px;
  left: 50%;
  width: 200px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  font-size: 18px;
  color: #fff;
  background-color: #333;
  transform: translate(-50%, 0);
  letter-spacing: 3px;
  z-index: 999;
}

.initcesium {
  position: absolute;
  top: 0px;
  left: 0px;
}

.topnavmenu {
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  z-index: 99;
}

#cesiumContainer {
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;

  background-color: #eee;
}

.selectdrawgrid {
  position: absolute;
  top: 70px;
  left: 0px;
  z-index: 9;
}

.pickedgridinfo {
  position: absolute;
  top: 150px;
  left: 0px;
  width: 160px;
  height: 200px;
  background-color: rgba(17, 80, 95, 0.7);
  border-radius: 3px;
}
</style>