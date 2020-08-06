<!-- 时空查询框 -->
<template>
  <div>
    <el-tabs v-model="activeNames" class="tabs">
      <el-tab-pane label="时空" name="first">
        <el-form
          class="searchform"
          v-model="searchData"
          label-position="left"
          label-width="40px"
          size="mini"
        >
          <el-form-item label="经度">
            <el-input v-model="searchData.inputLon" placeholder="请输入经度查询"></el-input>
          </el-form-item>
          <el-form-item label="纬度">
            <el-input v-model="searchData.inputLat" placeholder="请输入纬度查询"></el-input>
          </el-form-item>
          <el-form-item label="时间">
            <el-input v-model="searchData.inputTime" placeholder="请输入时间查询"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitA">查询</el-button>
            <el-button @click="close">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="编码">
        <el-form
          class="searchform"
          v-model="inputDTCode"
          label-position="left"
          label-width="40px"
          size="mini"
        >
          <el-form-item label="编码">
            <el-input v-model="inputDTCode" placeholder="请输入时空编码查询"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitB">查询</el-button>
            <el-button @click="close">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="轨迹">
        <el-form
          class="searchform"
          v-model="inputTrailCode"
          label-position="left"
          label-width="40px"
          size="mini"
        >
          <el-form-item label="轨迹">
            <el-input v-model="inputTrailCode" placeholder="请输入时空轨迹查询"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitC">查询</el-button>
            <el-button @click="close">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { request } from "@/network/request";
import { lonLatToDTArray } from "@/dqg/TileMath";

export default {
  name: "SearchForm",
  data() {
    return {
      searchData: {
        inputLon: null,
        inputLat: null,
        inputTime: null
      },
      inputDTCode: null,
      inputTrailCode: null,
      activeNames: "first",
      data: [],
    };
  },
  methods: {
    onSubmitA() {
      this.spaTemProQuery();
    },

    onSubmitB() {
      this.spaTemProCodeQuery();
    },

    onSubmitC() {
      this.trailIDQuery();
    },

    close() {
      this.$emit("closeSearchForm");
    },

    spaTemProQuery() {
      const data = [];
      data.push({method: 'spaTemProQuery'});
      const DTStr = lonLatToDTArray(
        +this.searchData.inputLon,
        +this.searchData.inputLat,
        this.searchData.inputTime
      );
      data.push({DT: DTStr});
      this.sendRequest(data);
    },

    spaTemProCodeQuery() {
      const data = [];
      data.push({method: 'spaTemProCodeQuery'});
      data.push({DT: this.inputDTCode});
      this.sendRequest(data);
    },

    trailIDQuery() {
      const data = [];
      data.push({method: 'trailIDQuery'});
      data.push({Tid: +this.inputTrailCode});
      this.sendRequest(data);
    },

    sendRequest(data) {
      const url = "/data/";
      const method = "post";
      let setting = new Set();
      console.time("aa");
      request({ url, method, data })
        .then(res => {
          console.log(res.data);
          console.timeEnd("aa");
          for (const item of res.data) {
            if (!setting.has(item.DT)) {
              setting.add(item.DT);
              this.data.push(item);
            }
          }

        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
.tabs {
  position: absolute;
  top: 150px;
  left: 0px;
  width: 245.6px;
  background-color: #fff;
}

.searchform {
  position: relative;
  top: 0px;
  left: 0px;
  background-color: #fff;
}

.el-form-item {
  margin: 10px;
}

.el-tabs__nav {
  position: relative;
  right: -40px;
}
</style>