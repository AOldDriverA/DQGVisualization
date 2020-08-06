<!-- 绘制DQG -->
<template>
  <div></div>
</template>

<script>
import { drawDQG, cancelDrawDQG } from "@/dqg/DrawDQG";

export default {
  name: "DrawDQG",
  data() {
    return {
      drawDQGOptions: {
        // 是否显示网格信息（双击触发）
        isShowGridInfo: false,
        closeGridInfo: false,
        pickedGrid: undefined
      }
    };
  },
  mounted() {
    // 管理网格绘制过程中的状态
    this.$viewer.drawDQGState = {};

    /** 监听组件的点击事件 */
    this.$EventBus.$on("drawDefault", () => {
      this.drawDefault();
    });

    this.$EventBus.$on("draw2dDQG", () => {
      this.draw2dDQG();
    });

    this.$EventBus.$on("drawMultiDQG", () => {
      this.drawMultiDQG();
    });

    this.$EventBus.$on("factorChange", factor => {
      this.factorChange(factor);
    });

    this.$EventBus.$on("doubleClick", event => {
      this.doubleClick(event);
    });

    this.$EventBus.$on("closeGridInfo", event => {
      this.closeGridInfo(event);
    });
  },
  computed: {},

  methods: {
    /**
     * 默认绘制二维单尺度DQG网格
     */
    drawDefault() {
      this.$store.commit("drawDefault");
      this.$store.commit("drawMultiDQGFalse");
      this.$store.commit("showSelectDrawTrue");
      this.drawDQGOptions.subdivFactor = 5;

      if (this.$store.state.isDrawDefault && !this.$store.state.isDraw2dDQG) {
        cancelDrawDQG(this.$viewer.scene);
        this.drawDQGOptions.DQGStyle = 1;
        drawDQG(this.$viewer, this.drawDQGOptions);
      } else if (!this.$store.state.isDraw2dDQG) {
        cancelDrawDQG(this.$viewer.scene);
      } else if (
        !this.$store.state.isDrawDefault &&
        this.$store.state.isDraw2dDQG
      ) {
        cancelDrawDQG(this.$viewer.scene);
        this.$store.commit("draw2dDQGFalse");
        this.$store.commit("showSelectDrawFalse");
      }
    },

    /**
     * 绘制二维单尺度DQG网格
     */
    draw2dDQG() {
      this.$store.commit("draw2dDQG");
      this.$store.commit("drawMultiDQGFalse");
      this.$store.commit("showSelectDrawTrue");
      this.curDQGIndex = 0;
      // 默认情况下细分阈值为5
      this.drawDQGOptions.subdivFactor = 5;

      if (this.$store.state.isDraw2dDQG && !this.$store.state.isDrawDefault) {
        cancelDrawDQG(this.$viewer.scene);
        this.drawDQGOptions.DQGStyle = 1;
        drawDQG(this.$viewer, this.drawDQGOptions);
      } else if (!this.$store.state.isDrawDefault) {
        cancelDrawDQG(this.$viewer.scene);
      } else if (
        !this.$store.state.isDraw2dDQG &&
        this.$store.state.isDrawDefault
      ) {
        cancelDrawDQG(this.$viewer.scene);
        this.$store.commit("drawDefaultFalse");
        this.$store.commit("showSelectDrawFalse");
      }
    },

    /**
     * 绘制二维多尺度网格
     */
    drawMultiDQG() {
      this.$store.commit("drawMultiDQG");
      this.$store.commit("drawDefaultFalse");
      this.$store.commit("draw2dDQGFalse");
      this.$store.commit("showSelectDrawTrue");
      cancelDrawDQG(this.$viewer.scene);

      this.curDQGIndex = 1;
      this.drawDQGOptions.subdivFactor = 5;

      if (this.$store.state.isDrawMultiDQG) {
        this.drawDQGOptions.DQGStyle = 2;
        drawDQG(this.$viewer, this.drawDQGOptions);
      } else {
        cancelDrawDQG(this.$viewer.scene);
        this.$store.commit("showSelectDrawFalse");
      }
    },

    /**
     * 细分阈值发生变化
     */
    factorChange(factor) {
      this.drawDQGOptions.subdivFactor = factor;
      if (this.$store.state.isDraw2dDQG) {
        cancelDrawDQG(this.$viewer.scene);
        drawDQG(this.$viewer, this.drawDQGOptions);
      } else {
        drawDQG(this.$viewer, this.drawDQGOptions);
      }
    },

    /**
     * 屏幕双击时，显示网格信息
     */
    doubleClick(event) {
      this.$store.commit("showGridInfoTrue");
      // 确保了触发后只绘制一次，不会每帧都画
      this.drawDQGOptions.isDrawSurface = !this.drawDQGOptions.isDrawSurface;
      this.$viewer.drawDQGState.isShowGridInfo = this.drawDQGOptions.isShowGridInfo;
      this.drawDQGOptions.screenUV = new Cesium.Cartesian2(
        event.offsetX,
        event.offsetY
      );
    },

    /**
     * 关闭网格信息框
     */
    closeGridInfo() {
      this.drawDQGOptions.closeGridInfo = true;
    },
  },
  watch: {
    // 监听鼠标双击网格事件
    "drawDQGOptions.pickedGrid": {
      handler: function(newValue) {
        if (newValue) {
          this.$EventBus.$emit("pickedGridInfo", newValue);
        }
      }
    },
    // 主要监听在DrawDQG.js里双击空白处时清空网格信息框
    "drawDQGOptions.isShowGridInfo": {
      handler: function(newValue) {
        if (!newValue) {
          this.$store.commit("showGridInfoFalse");
        }
      }
    }
  }
};
</script>

<style scoped>
</style>