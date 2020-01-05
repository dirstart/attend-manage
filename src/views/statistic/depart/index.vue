<template>
  <div class="depart-wrap">
    <el-row style="height: 100%;">
      <el-col class="all-height" :span="4">
        <el-card class="all-height msg-wrap">
          <div class="all-height">部门排行榜</div>
        </el-card>
      </el-col>
      <el-col class="all-height" :span="20">
        <el-card class="all-height chart-wrap">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="各部门占比" name="first">
              <div>
                <label style="margin-right: 10px;">对比部门</label>
                <el-select size="small" v-model="orgCompare" placeholder="请选择">
                  <el-option @click.native="selectAllOrg" :value="1" label="全部部门"></el-option>
                  <el-option @click.native="selectSomeOrg" :value="2" label="选择部门"></el-option>
                </el-select>
                <div class="tag-wrap" v-if="orgCompare === 2">
                  <el-tag
                    class="tag-item"
                    v-for="(item, index) in selectedOrg"
                    :key="index"
                    closable
                    @close="handleOrgTagClose(index)"
                  >{{item.name}}</el-tag>
                </div>
                <hr style="color:#eee;" />
                <div class="chart-wrap">
                  <echart ref="firstDom" auto-resize :options="firstOption"></echart>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="部门内加班占比" name="second">
              <div class="chart-wrap">
                <echart ref="secondDom" auto-resize :options="secondOption"></echart>
              </div>
            </el-tab-pane>
            <el-tab-pane label="各部门加班曲线" name="third">
              <div class="chart-wrap">
                <echart ref="thirdDom" auto-resize :options="thirdOption"></echart>
              </div>
            </el-tab-pane>
            <el-tab-pane label="部门内加班曲线" name="fourth">
              <div class="chart-wrap">
                <echart ref="fourthDom" auto-resize :options="fourthOption"></echart>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="选择部门"
      top="30vh"
      :visible.sync="orgDialogVisble"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-checkbox-group v-model="formOrg">
        <el-checkbox v-for="(item,index) in allOrg" :key="index" :label="item.dept">{{item.name}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orgDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="submitFormOrg">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import utils from "../common/utils";
import chartDefault from "../common/chartDefault";
export default {
  created() {
    this.initFirstChart();
  },
  data() {
    return {
      activeName: "first",
      orgCompare: 1,
      // 选择部门弹窗
      orgDialogVisble: false,
      // 全部部门
      allOrg: [
        {
          dept: "1",
          name: "信息部"
        },
        {
          dept: "2",
          name: "电商营销"
        },
        {
          dept: "3",
          name: "生产运行"
        }
      ],
      // 选择的部门
      formOrg: [],
      selectedOrg: [],
      firstOption: {},
      secondOption: {},
      thirdOption: {},
      fourthOption: {}
    };
  },
  methods: {
    handleClick(tab, event, index) {
      // this[`init${this.activeName}Chart`]()
      if (this.activeName === 'first') {
        this.initFirstChart();
      } else if (this.activeName === 'second') {
        this.initSecondChart();
      } else if (this.activeName === 'third') {
        this.initThirdChart();
      } else if (this.activeName === 'fourth') {
        this.initFourthChart();
      }
      this.$nextTick(() => {
        this.$refs[`${this.activeName}Dom`].resize();
      });
    },
    // 全部部门
    selectAllOrg() {
      this.selectedOrg = [];
    },
    // 选择部门
    selectSomeOrg() {
      this.formOrg = this.selectedOrg.map(item => item.dept);
      this.orgDialogVisble = true;
    },
    submitFormOrg() {
      this.selectedOrg = this.formOrg.map(item => {
        for (let i = 0; i < this.allOrg.length; i++) {
          if (this.allOrg[i].dept === item) {
            return this.allOrg[i];
          }
        }
      });
      this.orgDialogVisble = false;
    },
    // 各部门占比
    handleOrgTagClose(index) {
      this.selectedOrg.splice(index, 1);
      this.initFirstChart();
    },
    // 各部门时长占比图
    initFirstChart() {
      let legendData = [];
      let seriesData = [];
      if (this.orgCompare === 1) {
        legendData = this.allOrg.map(item => item.name);
      }
      this.firstOption = {
        title: {
          text: "各部门加班时长占比",
          subText: "纯属虚构",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}(部门)<br/> 加班时长{c}小时 - 占比：{d}%"
          // formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        toolbox: chartDefault.all.toolBox,
        legend: Object.assign(chartDefault.pie.legend, {
          data: this.allOrg.map(item => item.name)
        }),
        series: [
          {
            name: "部门",
            type: "pie",
            radius: "55%",
            center: ["40%", "50%"],
            // data: data.seriesData,
            data: this.allOrg.map(item => {
              return {
                name: item.name,
                value: 1
              };
            }),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
    },
    initSecondChart() {
      const data = utils.genData(50);
      this.secondOption = {
        title: {
          text: "部门内加班占比",
          subtext: "纯属虚构",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          right: 10,
          top: 20,
          bottom: 20,
          data: data.legendData,

          selected: data.selected
        },
        series: [
          {
            name: "姓名",
            type: "pie",
            radius: "55%",
            center: ["40%", "50%"],
            data: data.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
    },
    initThirdChart() {
      this.thirdOption = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line"
          }
        ]
      };
    },
    initFourthChart() {
      this.fourthOption = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line"
          }
        ]
      };
    }
  }
};
</script>

<style lang='less' scoped>
.all-height {
  height: 100%;
}
.all-width {
  width: 100%;
}
.depart-wrap {
  height: 100%;

  .tag-wrap {
    margin: 10px 0;
    .tag-item {
      margin-right: 5px;
    }
  }
  .chart-wrap {
    display: block;
    margin-left: 10px;
    height: 100%;
  }
}
</style>