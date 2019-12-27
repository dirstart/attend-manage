<template>
  <div class="app-container">
    <div class="search-wrap">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="部门">
          <el-input v-model="queryParams.departName" placeholder="请输入部门"></el-input>
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="queryParams.no" placeholder="请输入工号"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="queryParams.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-col :span="11">
            <el-form-item>
              <el-date-picker
                type="date"
                placeholder="选择开始日期"
                v-model="queryParams.startTime"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="11">
            <el-form-item>
              <el-date-picker
                type="date"
                placeholder="选择结束日期"
                v-model="queryParams.endTime"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="节假日类型">
          <el-select v-model="queryParams.dateType" placeholder="请选择节假日类型">
            <el-option label="工作日" :value="1"></el-option>
            <el-option label="周末" :value="2"></el-option>
            <el-option label="节日" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
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
      <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button @click="_onShowDetail(scope.row)" type="text" size="small">查看明细</el-button>
      </template>
    </el-table-column>
    </el-table>
    <detail-model :is-open.sync="isDialogShow" />
  </div>
</template>

<script>
import { getData } from "@/api/homepage";

export default {
  name: "homepage",
  components: {
    DetailModel: () => import("./components/DetailModel")
  },
  mounted() {
    // this.fetchData();
  },
  data() {
    return {
      queryParams: {
        departName: "",
        no: "",
        name: "",
        startTime: null,
        endTime: null,
        dateType: 1
      },
      attendData: [],
      isDialogShow: false
    };
  },
  methods: {
    fetchData() {
      getData().then(res => {
        if (res.code === 1) {
          this.attendData = res.data;
        }
      });
    },
    onSubmit() {
      console.log('表单提交');
      this.isDialogShow = true;
    },
    _onShowDetail(data) {
      this.isDialogShow = true;
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
}
.el-input {
  width: 280px;
  margin: 0 auto;
}

/deep/ {
  .el-form--inline .el-form-item {
    margin-right: 20px;
  }
  .el-form-item__content .el-form-item {
    margin-right: 10px;
  }
}
</style>
