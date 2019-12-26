<template>
  <el-popover :width="width || 600" placement="bottom" :disabled="enabled" trigger="focus">
    <el-table ref="multipleTable" v-loading="String(loading) === 'undefined' ? false : loading" :data="tableData.data" @row-click="handleRowClick" tooltip-effect="dark" style="width: 100%">
      <template v-for="(item, index) in columns">
        <el-table-column :prop="item.prop" :label="item.label" :key="index"></el-table-column>
      </template>
    </el-table>
    <div style="text-align: right;">
      <el-pagination layout="total, prev, pager, next" :pager-count="5" :page-size="tableData.size" :current-page="tableData.page" :total="tableData.total" @current-change="handlePageChange">
      </el-pagination>
    </div>
    <el-input style="width: 200px" v-model="itemVal" placeholder="请输入内容" slot="reference"></el-input>
  </el-popover>
</template>

<script>
export default {
  props: ['width', 'columns', 'tableData', 'keywords', 'loading'],
  data() {
    return {
      itemVal: '',
      enabled: false,
    };
  },
  watch: {
    itemVal(val) {
      this.enabled = false;
      this.$emit('fetch-table-data', {val});
    },
  },
  methods: {
    handleRowClick(row) {
      this.itemVal = row[this.keywords];
      setTimeout(() => {
        this.enabled = true;
      }, 100);
      // this.$refs.multipleTable.toggleRowSelection(row);
    },
    // handleSelectedChange(row) {
    //   let tempArr = [];
    //   row.length && row.forEach(item => {
    //     tempArr.push(item[this.keywords]);
    //   });
    //   this.itemVal = tempArr.join('; ');
    // },
    handlePageChange(page) {
      this.$emit('fetch-table-data', {val: this.itemVal, page});
    },
  },
};
</script>
