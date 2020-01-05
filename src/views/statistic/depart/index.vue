<template>
  <div class="depart-wrap">
    <el-row style="height: 100%;">
      <el-col class="all-height" :span="5">
        <el-card size="small" class="all-height msg-wrap">
          <span class="all-height">部门排行榜</span>
          <el-tag style="float:right;" type="primary" size="mini">{{commonTime}}</el-tag>
        </el-card>
      </el-col>
      <el-col class="all-height" :span="19">
        <el-card class="all-height chart-wrap">
          <div slot="header">
            <el-row>
              <el-col :span="6">
                部门分类统计
              </el-col>
              <el-col :span="18">              
                <el-radio-group class="float-right" v-model="commonTime" size="mini">
                  <el-radio-button v-for="(item, index) in timeInterval"
                    :value="item.value"
                    :label="item.label"
                    :key="index"
                  ></el-radio-button>
                </el-radio-group>
                <el-select class="float-right" style="width:110px;margin-top:2px;margin-right: 10px;line-height: 28px;" size="mini" v-model="orgCompare" placeholder="请选择">
                  <el-option @click.native="selectAllOrg" :value="1" label="全部部门"></el-option>
                  <el-option @click.native="selectSomeOrg" :value="2" label="选择部门"></el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
            <div>
                <div class="chart-wrap">
                <el-row>
                  <el-col :span="12">
                  <div class="tag-wrap" v-if="orgCompare === 2">
                    选择部门：<el-tag
                      class="tag-item"
                      size="small"
                      v-for="(item, index) in selectedOrg"
                      :key="index"
                      closable
                      @close="handleOrgTagClose(index)"
                    >{{item.name}}</el-tag>
                  </div>
                  <div class="tag-wrap" v-else>选择部门：<el-tag class="tag-item" size="small" type="success">全部部门</el-tag></div>
                  <echart class="first-pie-chart" ref="firstPieDom" auto-resize :options="firstPieOption"></echart>
                  </el-col>
                  <el-col :span="12">
                    右边有两个
                  </el-col>
                </el-row>
              </div>
            </div>
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
import {timeInterval} from '../common/documents'
import {getDepartOvertime} from '@/api/statistic'
export default {
  name: 'depart',
  async created() {
    this.initFirstPieChart();
    this.initFirstLineChart();
    await this.getDepartOvertime();
  },
  data() {
    return {
      timeInterval: timeInterval,
      activeName: "first",
      commonTime: '近一周',
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
      firstLineOption: {},
      firstPieOption: {},
    };
  },
  methods: {
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
      this.initFirstPieChart();
      this.initFirstLineChart();
    },
    // 各部门时长占比图
    initFirstPieChart() {
      let legendData = [];
      let seriesData = [];
      if (this.orgCompare === 1) {
        legendData = this.allOrg.map(item => item.name);
      }
      this.firstPieOption = {
        title: {
          text: "各部门加班时长占比",
          textStyle: {
            fontSize: 14
          },
          subText: "纯属虚构",
          left: '22%'
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}(部门)<br/> 加班时长{c}小时 - 占比：{d}%"
          // formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        toolbox: chartDefault.all.toolBox,
        legend: Object.assign(chartDefault.pie.legend, {
          data: this.allOrg.map(item => item.name),
          left: '10%',
          top: '60%',
          type: 'scroll',
          orient: 'horizontal'
        }),
        series: [
          {
            name: "部门",
            type: "pie",
            radius: "40%",
            center: ["40%", "30%"],
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
    initFirstLineChart() {
      this.firstLineChart = {
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
    getDepartOvertime () {
      return new Promise((resolve, reject) => {
        getDepartOvertime().then(res => {
          console.log('res', res)
        })
      })
    }
  },
  computed: {
    getIntervalName () {
      for (let i = 0; i < this.timeInterval.length; i++) {
        if (this.timeInterval[i].value === this.commonTime) {
          console.log(this.timeInterval[i])
          return this.timeInterval[i].label
        }
      }
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
.float-right {
  float: right;
}
.depart-wrap {
  height: 100%;

  .tag-wrap {
    margin: 10px 0 20px 0;
    font-size: 12px;
    height: 26px;
    .tag-item {
      margin-right: 5px;
    }
  }
  .chart-wrap {
    display: block;
    margin-left: 10px;
    height: 100%;
  }
  .moni-tag {
    color: #089e8a;
    float: right;
    font-size: 12px;
    line-height: 18px;
    text-shadow: 0 0 3px #eee;
  }
  .first-pie-chart {
    height: 500px;
  }
}
</style>