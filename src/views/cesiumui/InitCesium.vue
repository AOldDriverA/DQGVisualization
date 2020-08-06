<!-- 初始化Cesium界面 -->
<template>
  <div>
  </div>
</template>

<script>
import Vue from "vue"
import { viewerOptions } from "@/dqg/setView";

export default {
  name: "InitCesium",
  data() {
    return {};
  },
  mounted() {
    /** 初始化Cesium球体 */
    Vue.prototype.$viewer =  new Cesium.Viewer("cesiumContainer", viewerOptions);
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
    this.$viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(108.3451, 33.9963, 13000000.0)
    })
  }
};
</script>

<style scoped>

.cesiumContainer {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
</style>