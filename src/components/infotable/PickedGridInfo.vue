<!-- 显示被选中的网格信息 -->
<template>
  <div>
    <div class="title">
      <span class="info">网格信息</span>
      <span class="close" @click="close">退出</span>
    </div>
    <div class="content">
      <div class="contentitem">编码: {{morton}}</div>
      <div class="contentitem">层级: {{level}}</div>
      <div class="contentitem">边长: {{height}}</div>
      <div class="contentitem">边宽: {{width}}</div>
      <div class="contentitem">经度: {{Math.round(longitude * Math.pow(10,7))/Math.pow(10,7)}}</div>
      <div class="contentitem">纬度: {{Math.round(latitude * Math.pow(10,7))/Math .pow(10,7)}}</div>   
    </div>
  </div>
</template>

<script>
import { computeGridWidth, computeGridHeight } from "@/dqg/TileMath"

export default {
  name: "PickedGridInfo",
  props: {
  },
  data () {
    return {
      morton: '',
      level: 0,
      height: 0,
      width: 0,
      longitude: 0.0,
      latitude: 0.0,
    };
  },
  mounted() {
    this.$EventBus.$on("pickedGridInfo", (gridInfo) => {
      this.pickedGridInfo(gridInfo);
    });
  },
  methods: {
    pickedGridInfo(gridInfo) {
      this.morton = gridInfo.morton;
      this.level = gridInfo.level;
      this.width = computeGridWidth(gridInfo).toFixed(2);
      this.height = computeGridHeight(gridInfo).toFixed(2);
      this.longitude = ((gridInfo.west + gridInfo.east) / 2).toFixed(10);
      this.latitude = ((gridInfo.south + gridInfo.north) / 2).toFixed(10);
    },

    close() {
      this.$EventBus.$emit("closeGridInfo");
    }
  }
}
</script>

<style scoped>
.title {
  height: 32px;
  line-height: 32px;
  text-align: center;
  color: #fff;
  font-size: 17px;
  background-color: rgb(17, 80, 95);
  border-radius: 3px 3px 0 0;
}

.info {
  position: absolute;
  left: 40px;
}

.close {
  position: absolute;
  left: 120px;
  font-size: 13px;
  width: 40px;
  cursor: pointer;
}

.content {
  width: 160px;
  height: 160px;
  margin-top: 4px;
  color: #fff;
}

.contentitem {
  position: relative;
  left: 10px;
  width: 140px;
  height: 27px;
    overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>