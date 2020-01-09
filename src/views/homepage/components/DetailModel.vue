<template>
  <el-dialog title="考勤明细" class="details body0" :visible.sync="isDialogShow" width="880px">
    <el-row class="info">
      <el-col :span="8">
        <span>部门：{{detail.departName}}</span>
      </el-col>
      <el-col :span="8">
        <span>工号：{{detail.no}}</span>
      </el-col>
      <el-col :span="8">
        <span>姓名：{{detail.name}}</span>
      </el-col>
    </el-row>
    <el-table :data="listTableData" v-loading="loading">
      <el-table-column width="100" prop="date" label="日期"></el-table-column>
      <el-table-column width="100" prop="startTime" label="上班时间"></el-table-column>
      <el-table-column width="100" prop="endTime" label="下班时间"></el-table-column>
      <el-table-column width="100" prop="dateType" label="节假日类型">
        <template slot-scope="scope">
          <el-tag :type="scope.row.dateType == 1 ? 'primary' : 'success'" disable-transitions>
            {{judgeDateType(scope.row.dateType)}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="120" prop="originalOvertime" label="加班时长(h)"></el-table-column>
      <el-table-column width="100" prop="cost" label="加班费"></el-table-column>
      <el-table-column prop="remark" label="备注">
        <template slot-scope="scope" v-if="scope.row.remark">
          <el-tag type="danger">
            {{scope.row.remark}}
          </el-tag>
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
        layout="total, sizes, prev, pager, next"
        :total="allData.length">
      </el-pagination>
    </div>
    <div slot="footer">
      <el-button size="mini" type="primary" @click="isDialogShow = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fetchDetailData } from "@/api/homepage";

export default {
  props: {
    isOpen: {
      default: false,
      type: Boolean
    },
    detail: {
      default: () => {},
      type: Object
    },
    params: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      allData: [],
      listTableData: [],
      page: 1,
      size: 10,
      isDialogShow: false,
      loading: false
    };
  },
  watch: {
    isOpen(val) {
      this.isDialogShow = val;
      if (val) this.loadDetail();
    },
    isDialogShow(val) {
      this.$emit("update:isOpen", val);
    }
  },
  methods: {
    loadDetail() {
      const { params, detail } = this;
      if (params.dateType == 0) delete(params.dateType);
      this.loading = true;
      fetchDetailData({ ...params, ...detail }).then((res) => {
        const { code, data, message } = res.data;
        if (code === 200) {
          this.allData = data;
          this.limitData(data);
        } else {
          this.$message.error(message);
        }
        this.loading = false;
      }).catch(err => {
        console.dir(err);
        this.loading = false;
      });
    },
    limitData(data) {
      let origin = (this.page - 1) * this.size;
      this.listTableData = data.slice(origin, origin + this.size);
    },
    handleSizeChange(val) {
      this.size = val;
      this.limitData(this.allData);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.limitData(this.allData);
    },
    judgeDateType(type) {
      let result = '';
      if (type == 1) {
        result = '工作日';
      } else if (type == 2) {
        result = '周末';
      } else if (type == 3) {
        result = '法定节日';
      }
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
  .details {
    .info {
      background: #fafbfd;
      padding: 20px 20px;
      font-size: 15px;
      color: #3f4041;
    }
  }
  .page-wrap {
    padding: 20px;
    padding-top: 10px;
    text-align: right;
  }
  /deep/ {
    .el-table th.is-leaf, .el-table td {
      text-align: center;
    }
  }
</style>
