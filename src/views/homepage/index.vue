<template>
  <div class="app-container">
    <div class="search-wrap">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="部门">
          <el-select v-model="queryParams.departName" placeholder="请选择部门">
            <el-option
              v-for="item in departmentList"
              :key="item.no"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="queryParams.no" placeholder="请输入工号"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="queryParams.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="dateArr"
            @change="onPickDate"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="节假日类型">
          <el-select v-model="queryParams.dateType" placeholder="请选择节假日类型">
            <el-option label="全部" :value="0"></el-option>
            <el-option label="工作日" :value="1"></el-option>
            <el-option label="周末" :value="2"></el-option>
            <el-option label="法定节日" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-upload
            class="file-upload"
            accept=".xlsx"
            action="http://192.168.43.112:8100/overtime/file"
            :show-file-list="false"
            :before-upload="onBeforeImport"
            :on-success="onImport"
            :on-error="onImportErr"
          >
            <el-button type="primary">导入</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="attendData" style="width: 100%">
      <el-table-column prop="departNo" label="部门编号" width="180"></el-table-column>
      <el-table-column prop="departName" label="部门名称"></el-table-column>
      <el-table-column prop="no" label="工号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="allOverTime" label="加班总时长(h)"></el-table-column>
      <el-table-column prop="cost" label="加班费"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="_onShowDetail(scope.row)" type="text" size="small">查看明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-wrap">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="allData.length">
      </el-pagination>
    </div>
    <detail-model :is-open.sync="isDialogShow" :detail="item" :params="queryParams" />
  </div>
</template>

<script>
import moment from "moment";
import { fetchAttendData, getDepartment } from "@/api/homepage";

export default {
  name: "homepage",
  components: {
    DetailModel: () => import("./components/DetailModel")
  },
  created() {
    this.fetchDepartment();
    this.loadData();
  },
  data() {
    return {
      dateArr: "",
      queryParams: {
        departName: "",
        no: "",
        name: "",
        startTime: null,
        endTime: null,
        dateType: 0
      },
      departmentList: [],
      allData: [],
      attendData: [],
      item: {},
      isDialogShow: false,
      loading: {},
      page: 1,
      size: 10
    };
  },
  methods: {
    onPickDate(dates) {
      let [startTime, endTime] = dates.slice();
      this.$set(
        this.queryParams,
        "startTime",
        moment(startTime).format("YYYY-MM-DD")
      );
      this.$set(
        this.queryParams,
        "endTime",
        moment(endTime).format("YYYY-MM-DD")
      );
    },
    // 获取考勤列表数据
    loadData() {
      // 参数过滤
      const queryParams = JSON.parse(JSON.stringify(this.queryParams));
      if (this.queryParams.dateType === 0) delete queryParams.dateType;
      // 发起请求
      fetchAttendData(queryParams).then(res => {
        const { code, data, message } = res.data;
        if (code === 200) {
          this.allData = data;
          this.limitData(data);
        } else {
          this.$message.error(message);
        }
      });
    },
    limitData(data) {
      let origin = (this.page - 1) * this.size;
      this.attendData = data.slice(origin, origin + this.size);
    },
    // 获取部门列表
    fetchDepartment() {
      getDepartment().then(res => {
        const { code, data, message } = res.data;
        if (code === 200) {
          this.departmentList = data.map(item => {
            let obj = {};
            obj.no = item.departNo;
            obj.name = item.departName;
            return obj;
          });
        } else {
          this.$message.error(message);
        }
      });
    },
    onSubmit() {
      this.loadData();
    },
    handleSizeChange(val) {
      this.size = val;
      this.limitData(this.allData);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.limitData(this.allData);
    },
    onBeforeImport() {
      this.loading = this.$loading({
        lock: true,
        text: "导入中...",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    onImport() {
      this.loading.close();
      this.loadData();
      this.$message({
        message: "文件上传成功！",
        type: "success"
      });
    },
    onImportErr() {
      this.$message.error("文件上传失败，请重新上传");
    },
    _onShowDetail(data) {
      const { departName = "", no = "", name = "" } = data;
      this.item = { departName, no, name };
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
  padding-top: 40px;
}
.el-table {
  padding: 10px 0;
}
.el-input {
  width: 280px;
  margin: 0 auto;
}
.file-upload {
  display: inline-block;
}
.page-wrap {
  padding: 20px;
  padding-top: 0;
  text-align: right;
}

/deep/ {
  .el-form--inline .el-form-item {
    margin-right: 20px;
  }
  .el-form-item__content .el-form-item {
    margin-right: 10px;
  }
  .el-table th.is-leaf,
  .el-table td {
    text-align: center;
  }
  .el-table::before {
    height: 0;
  }
}
</style>
