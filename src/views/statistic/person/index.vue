<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="各部门占比" name="first">用户管理</el-tab-pane>
        <el-tab-pane label="部门内加班占比" name="second">配置管理</el-tab-pane>
        <el-tab-pane label="各部门加班曲线" name="third">角色管理</el-tab-pane>
        <el-tab-pane label="部门内加班曲线" name="fourth">定时任务补偿</el-tab-pane>
      </el-tabs>
    <!-- <div>个人统计</div>
    <div class="chart-box">
      <echart auto-resize :options="chartOption"></echart>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first',
      chartOption: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: 10,
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
            ]
          }
        ]
      }
    };
  },
  methods: {
    handleClick (tab, event) {
      console.log('tab', tab, event)
    }
  }
};
</script>

<style>
</style>