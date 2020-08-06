<!-- 信息弹出框 -->
<template>
  <div class="drawdqginfo">
    <div class="dqgitemName">
      <slot />
    </div>
    <div class="subdivfactor">细分因子</div>
    <el-slider v-model="value" :min="1" :max="17" @change="change" :step="4"></el-slider>
  </div>
</template>

<script>
export default {
  name: "SelectDrawDQG",
  components: {},
  data() {
    return {
      value: 5,
    };
  },
  methods: {
    change(result) {
      this.$emit("factorChange", result);
    }
  }
};
</script>

<style>
.drawdqginfo {
  width: 150px;
  height: 70px;
  display: flex;
  flex-direction: column;
  transition: 0.6s;
}

.dqgitemName {
  height: 40px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  font-size: 15px;
  letter-spacing: 2px;
}

.subdivfactor {
  position: absolute;
  top: 27px;
  left: 2px;
  width: 80px;
  height: 45px;
  line-height: 45px;
  font-size: 13px;
  color: #fff;
  text-align: center;
  letter-spacing: 2px;
}

.drawdqginfo:hover {
  background-color: rgb(60, 84, 94, 0.5);
}

.el-slider {
  position: absolute;
  top: 31px;
  left: 75px;
  width: 60px;
}

.el-slider__bar {
  background-color: #333;
}

.el-slider__button {
  border: 2px solid #333;
}

.el-tooltip__popper.is-dark {
  display: block;
}
</style>