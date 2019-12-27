<template>
  <el-dialog title="考勤明细" class="details body0" :visible.sync="isDialogShow" width="800px">
    <el-row class="info">
      <el-col :span="8"></el-col>
    </el-row>
    <!-- <el-table :data="listTableData.rows"></el-table> -->
    <div slot="footer">
      <el-button size="mini" type="primary" @click="isDialogShow = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    isOpen: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      isDialogShow: false
    };
  },
  watch: {
    isOpen(val) {
      this.isDialogShow = val;
    },
    isDialogShow(val) {
      this.$emit("update:isOpen", val);
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.details {
  .info {
    background: #fafbfd;
    padding: 20px;
    font-size: 13px;
    color: #3f4041;
  }
}
</style>
