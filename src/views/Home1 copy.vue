<template>
  <div id="home" @dblclick="doubleClick">
    <draw-grid>
      <top-nav-menu class="topnavmenu">
        <!-- 网格部分 -->
        <top-nav-menu-item>
          <div slot="item-name" @click="drawDefault">网格</div>
          <top-nav-menu-sub-item @click.native="draw2dDQG">单尺度DQG</top-nav-menu-sub-item>
          <top-nav-menu-sub-item @click.native="drawMultiDQG">多尺度DQG</top-nav-menu-sub-item>
          <top-nav-menu-sub-item>三维DQG</top-nav-menu-sub-item>
        </top-nav-menu-item>
        <!-- 影像部分 -->
        <top-nav-menu-item>
          <div slot="item-name">影像</div>
          <top-nav-menu-sub-item>遥感影像</top-nav-menu-sub-item>
        </top-nav-menu-item>
        <!-- 工具分析 -->
        <top-nav-menu-item>
          <div slot="item-name">分析</div>
          <top-nav-menu-sub-item>时空邻近查询</top-nav-menu-sub-item>
          <top-nav-menu-sub-item>网格信息查询</top-nav-menu-sub-item>
          <top-nav-menu-sub-item>空间距离计算</top-nav-menu-sub-item>
        </top-nav-menu-item>
      </top-nav-menu>
    </draw-grid>
    <select-draw-grid
      class="selectdrawgrid"
      v-show="isDraw2dDQG || isDrawMultiDQG"
      @factorChange="factorChange"
    >{{DQGItems[curDQGIndex]}}</select-draw-grid>
    <div id="cesium-credit"></div>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import DrawGrid from "../components/drawgrid/DrawGrid";

import { drawDQG, cancelDrawDQG } from "../dqg/DrawDQG";
import { viewerOptions } from "../dqg/setView";
// import Viewshed from "../utils/viewshed/Viewshed";
import TopNavMenu from "./cesiumui/TopNavMenu";
import TopNavMenuItem from "./cesiumui/TopNavMenuItem";
import TopNavMenuSubItem from "./cesiumui/TopNavMenuSubItem";
import SelectDrawGrid from "@/components/infotable/SelectDrawGrid";

export default {
  name: "Home",
  data() {
    return {
      isDraw2dDQG: false,
      isDrawDefault: false,
      isDrawMultiDQG: false,
      curDQGIndex: 0,
      drawDQGOptions: {
        // 是否显示网格信息（双击触发）
        isShowGridInfo: false
      },
      DQGItems: ["单尺度DQG网格", "多尺度DQG网格", "三维DQG网格"]
    };
  },
  components: {
    DrawGrid,

    TopNavMenu,
    TopNavMenuItem,
    TopNavMenuSubItem,
    SelectDrawGrid
  },
  mounted() {
    this.$viewer = new Cesium.Viewer("cesiumContainer", viewerOptions);
    this.$viewer.scene.debugShowFramesPerSecond = true;
    let layer = new Cesium.MapboxStyleImageryProvider({
      username: "classbegin",
      styleId: "ckcbnhso76bf61ipig416hqvm",
      accessToken:
        "pk.eyJ1IjoiY2xhc3NiZWdpbiIsImEiOiJja2NiYzluNHcyM3d3MnJvYmV6cW10MGVvIn0.qAqSKrc0tRYhwo4BMFTx-g",
      tilesize: 256,
      scaleFactor: true
    });

    this.$viewer.imageryLayers.addImageryProvider(layer);
    // 管理网格绘制过程中的状态
    this.$viewer.drawDQGState = {};
    // //setView(viewer);
    // let viewshedOptions = {
    //   viewer: viewer,
    //   viewPointPosition: Cesium.Cartesian3.fromDegrees(
    //     116.3451,
    //     39.9963,
    //     8000.0
    //   ),
    //   radii: 20000.0,
    //   heading: 0.0,
    //   pitch: 0.0
    // };
    // let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    //   Cesium.Cartesian3.fromDegrees(116.3, 39.98, 10.0)
    // );

    // let model = Cesium.Model.fromGltf({
    //   url: "model/rocketobj1.gltf",
    //   modelMatrix: modelMatrix,
    //   scale: 10
    // });
    // viewer.scene.primitives.add(model);

    // // let tileset = new Cesium.Cesium3DTileset({
    // //   url: Cesium.IonResource.fromAssetId(75343)
    // // });
    // // viewer.scene.primitives.add(tileset);
    // // viewer.zoomTo(tileset);

    // let viewshed = new Viewshed(viewshedOptions);
    // viewshed;
    // drawDQG(viewer);
  },
  methods: {
    /**
     * 屏幕双击时，显示网格信息
     */
    doubleClick(event) {
      this.drawDQGOptions.isDrawSurface = !this.drawDQGOptions.isDrawSurface;
      this.$viewer.drawDQGState.isShowGridInfo = this.drawDQGOptions.isDrawSurface;
      this.drawDQGOptions.offsetX = event.offsetX;
      this.drawDQGOptions.offsetY = event.offsetY;
      console.log("doubleClick");
    },

    /**
     * 默认绘制二维单尺度DQG网格
     */
    drawDefault() {
      this.isDrawDefault = !this.isDrawDefault;
      this.drawDQGOptions.subdivFactor = 5;
      if (this.isDrawDefault && !this.isDraw2dDQG) {
        cancelDrawDQG(this.$viewer.scene);
        this.drawDQGOptions.DQGStyle = 1;
        drawDQG(this.$viewer, this.drawDQGOptions);
      } else if (!this.isDraw2dDQG) {
        cancelDrawDQG(this.$viewer.scene);
        this.isDrawDefault = false;
      } else {
        this.isDraw2dDQG = false;
      }
    },

    /**
     * 绘制二维单尺度DQG网格
     */
    draw2dDQG() {
      this.curDQGIndex = 0;
      this.isDraw2dDQG = !this.isDraw2dDQG;
      // 默认情况下细分阈值为5
      this.drawDQGOptions.subdivFactor = 5;

      if (this.isDraw2dDQG && !this.isDrawDefault) {
        cancelDrawDQG(this.$viewer.scene);
        this.drawDQGOptions.DQGStyle = 1;
        drawDQG(this.$viewer, this.drawDQGOptions);
      } else if (!this.isDrawDefault) {
        cancelDrawDQG(this.$viewer.scene);
      } else {
        this.isDrawDefault = false;
      }
    },

    /**
     * 绘制二维多尺度网格
     */
    drawMultiDQG() {
      this.curDQGIndex = 1;
      this.isDrawMultiDQG = !this.isDrawMultiDQG;
      this.drawDQGOptions.subdivFactor = 5;

      if (this.isDrawMultiDQG) {
        // 如果其他类型的网格此时正在绘制，则将其取消
        if (this.isDraw2dDQG) {
          cancelDrawDQG(this.$viewer.scene);
          this.isDraw2dDQG = false;
        }
        this.drawDQGOptions.DQGStyle = 2;
        drawDQG(this.$viewer, this.drawDQGOptions);
      } else {
        cancelDrawDQG(this.$viewer.scene);
      }
    },

    /**
     * 细分阈值发生变化
     */
    factorChange(factor) {
      this.drawDQGOptions.subdivFactor = factor;
      if (this.isDraw2dDQG) {
        cancelDrawDQG(this.$viewer.scene);
        drawDQG(this.$viewer, this.drawDQGOptions);
      } else {
        drawDQG(this.$viewer, this.drawDQGOptions);
      }
    }
  }
};
</script>

<style scoped>
.topnavmenu {
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  z-index: 999;
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
  z-index: 99;
}
</style>