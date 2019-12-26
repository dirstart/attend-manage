<template>
  <div class="app-container">
    <div class="search-wrap">
      <el-input placeholder="请输入内容" v-model="keywords" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <el-table :data="attendData" style="width: 100%">
      <el-table-column prop="depNo" label="部门编号" width="180"></el-table-column>
      <el-table-column prop="depName" label="部门名称"></el-table-column>
      <el-table-column prop="jobNum" label="工号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="beginTime" label="上班时间"></el-table-column>
      <el-table-column prop="endTime" label="下班时间"></el-table-column>
      <el-table-column prop="during" label="加班时长"></el-table-column>
      <el-table-column prop="holidayType" label="节假日类型"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="fee" label="加班费"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getData } from '@/api/homepage'
export default {
  name: "homepage",
  mounted() {
    // this.fetchData();
  },
  data() {
    return {
      keywords: '',
      attendData: []
    };
  },
  methods: {
    fetchData() {
      getData().then(res => {
        if (res.code === 1) {
          this.attendData = res.data;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/modules/homepage.scss";
</style>

<style lang="scss" scoped>
  .app-container {
    padding: 0 20px;
  }
  .search-wrap {
    padding: 50px 0;
    text-align: center;
  }
  .el-input {
    width: 600px;
    margin: 0 auto;
  }
</style>
