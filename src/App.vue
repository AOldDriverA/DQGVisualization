<template>
  <div id="app">
    <router-view>
      <home />
    </router-view>
  </div>
</template>

<script>
import Home from "./views/Home";
import "cesium/Widgets/widgets.css";

export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    Home
  }
}
</script>

<style scoped>
</style>
