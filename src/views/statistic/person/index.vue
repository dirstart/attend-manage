<template>
  <div class="depart-wrap">
    <!-- <el-row style="height: 100%;"> -->
      <!-- <el-col class="all-height" :xs="10" :sm="10" :md="10" :lg="5"> -->

      <!-- </el-col> -->
      <!-- <el-col class="all-height" :xs="14" :sm="14" :md="14" :lg="19"> -->
        <el-card size="small" class="all-height msg-wrap">
          <div class="all-height">
            <div class="rank-header">
              <span>部门排行榜</span>
              <el-tag style="float:right;" type="primary" size="mini">{{commonTime}}</el-tag>
            </div>
            <div class="rank-body">
              <div v-if="rankingList.length > 0" class="rank-item" :class="{'rank-first': index === 0, 'rank-second': index === 1, 'rank-third': index === 2}" v-for="(item, index) in rankingList" :key="index">
                <span class="rank-num">{{(index + 1) < 10 ? '0' + (index + 1) : (index + 1)}}</span>
                <span class="rank-name">{{item.departName}}</span>
                <span class="rank-hour">{{item.allOverTime}}h</span>
              </div>
              <div class="no-data" v-if="rankingList.length === 0">
                暂无数据
              </div>
            </div>
          </div>
        </el-card>
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
                <div class="tag-wrap" v-if="orgCompare === 2">
                  <el-tag
                    class="tag-item"
                    size="small"
                    v-for="(item, index) in selectedOrg"
                    :key="index"
                    closable
                    @close="handleOrgTagClose(index)"
                  >{{item.departName}}</el-tag>
                </div>
              </el-col>
            </el-row>
          </div>
          <div>
            <div class="chart-group">
              <echart class="first-pie-chart" ref="firstPieDom" auto-resize :options="firstPieOption"></echart>
              <echart class="first-line-chart" ref="firstLineDom" auto-resize :options="firstLineOption"></echart>
            </div>
          </div>
        </el-card>
    <el-dialog
      title="选择部门"
      top="30vh"
      :visible.sync="orgDialogVisble"
      :close-on-click-modal="false"
      width="33%"
    >
      <el-checkbox-group v-model="formOrg">
        <el-checkbox v-for="(item,index) in allOrg" :key="index" :label="item.departNo">{{item.departName}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orgDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="submitFormOrg">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {dayToString, rankingSort} from "../common/utils";
import {timeInterval} from '../common/documents'
import {getDepartOvertime, getAllPart, getDepartLine} from '@/api/statistic'
export default {
  name: 'depart',
  async created() {
    await this.getAllPart()
    await this.getDepartOvertime();
    await this.getDepartLine();
    this.initFirstLineChart()
  },
  data() {
    return {
      timeInterval: timeInterval,
      commonTime: '近一月',
      orgCompare: 1,
      orgDialogVisble: false,
      // 全部部门
      allOrg: [],
      formOrg: [],
      selectedOrg: [],
      firstLineOption: {},
      firstPieOption: {},
      // 后端返回数据
      list: [],
      pieChartData: [],
      lineData: []
    };
  },
  methods: {
    // 全部部门
    selectAllOrg() {
      this.getDepartOvertime()
      this.getDepartLine()
    },
    // 选择部门
    selectSomeOrg() {
      this.formOrg = this.selectedOrg.map(item => item.departNo);
      this.orgDialogVisble = true;
    },
    submitFormOrg() {
      this.selectedOrg = this.formOrg.map(item => {
        for (let i = 0; i < this.allOrg.length; i++) {
          if (this.allOrg[i].departNo === item) {
            return this.allOrg[i];
          }
        }
      });
      this.orgDialogVisble = false;
      this.getDepartOvertime()
      this.getDepartLine()
    },
    // 各部门占比
    handleOrgTagClose(index) {
      this.selectedOrg.splice(index, 1);
      this.getDepartOvertime()
      this.getDepartLine()
    },
    // 各部门时长占比图
    initFirstPieChart() {
      let legendData = [];
      let seriesData = [];
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
        // toolbox: chartDefault.all.toolBox,
        legend: Object.assign(chartDefault.pie.legend, {
          data: this.list.map(item => item.departName),
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
            data: this.list.map(item => {
              return {
                name: item.departName,
                value: item.allOverTime
              }
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
      this.firstLineOption = {
        title: {
        text: '折线图堆叠'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
    },
    grid: {
        left: '3%',
        right: '10%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: '视频广告',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
            name: '直接访问',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
    ]
      }
    },
    getAllPart () {
      return new Promise((resolve, reject) => {
        getAllPart().then(res => {
          this.allOrg = res.data.data || []
          resolve(true)
        })
      })
    },
    getDepartLine () {
      // 一天的值
      const oneDay = 1000 * 60 * 60 * 24
      const nowDate = +new Date()
      const endTime = dayToString(nowDate)
      let startTime
      let departNos
      if (this.commonTime === '近一周') {
        startTime = dayToString(nowDate - 7 * oneDay)
      } else if (this.commonTime === '近一月') {
        startTime = dayToString(nowDate - 30 * oneDay)
      } else {
        startTime = dayToString(nowDate - 365 * oneDay)
      }
      // 所有部门
      if (this.orgCompare === 1) {
        departNos = []
      } else {
        departNos = this.selectedOrg.map(item => item.departNo)
      }
      console.log(startTime, endTime)
      return new Promise((resolve, reject) => {
        getDepartLine({
          startTime,
          endTime,
          departNos
        }).then(res => {
          const arr = res.data && res.data.data || []
          this.lineData = this.handleLineData(arr)
          this.initFirstLineChart()
          resolve(true)
        })
      })
    },
    getValue (str) {
      let count = 0
      for (let i = 0; i < str.length; i++) {
        count += str[i].charCodeAt()
      }
      return count
    },
    handleLineData (arr) {
      const me = this
      arr = arr.sort((a, b) => {
        return me.getValue(a.departNo) - me.getValue(b.departNo)
      })
      let obj = {}
      let res = []
      // xAxis: ['2019-01-01', '2019-01-02']
      // data: [{name: '电商', data: [1, 2]}]
      let tem = []
      console.log('god', arr)
      // for (let i = 0; i < arr.length; i++) {
      //   if (!obj[arr[i].departName]) {
      //     obj[arr[i].departName] = true
      //     res.push(tem)
      //   } else {
      //     tem.push(arr[i])
      //   }
      // 
    },
    getDepartOvertime () {
      // 一天的值
      const oneDay = 1000 * 60 * 60 * 24
      const nowDate = +new Date()
      const endTime = dayToString(nowDate)
      let startTime
      let departNos
      if (this.commonTime === '近一周') {
        startTime = dayToString(nowDate - 7 * oneDay)
      } else if (this.commonTime === '近一月') {
        startTime = dayToString(nowDate - 30 * oneDay)
      } else {
        startTime = dayToString(nowDate - 365 * oneDay)
      }
      // 所有部门
      if (this.orgCompare === 1) {
        departNos = []
      } else {
        departNos = this.selectedOrg.map(item => item.departNo)
      }
      return new Promise((resolve, reject) => {
        getDepartOvertime({
          startTime,
          endTime,
          departNos
        }).then(res => {
          const arr = res.data && res.data.data || []
          // this.list = arr.concat(arr).concat(arr).concat(arr).concat(arr)
          this.list = arr
          this.initFirstPieChart()
          resolve(true)
        })
      })
    }
  },
  computed: {
    rankingList () {
      const arr = this.list || []
      return arr.sort(rankingSort('allOverTime')).slice(0, 14)
    }
  },
  watch: {
    commonTime (value) {
      console.log('commonTime', value)
      this.getDepartOvertime()
      this.getDepartLine()
    } 
  }
};
</script>

<style lang='scss' scoped>
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
  display: flex;
  height: 100%;
  .msg-wrap {
    min-height: 300px;
  }
  .chart-wrap {
    flex: 1;
    .chart-group {
      width: 100%;
      display: flex;
      .first-pie-chart {
        // flex: 1;
        max-width: 400px;
      }
      .first-line-chart {
        flex: 1;
        // max-width: 400px;
      }
    }
  }

  .rank-header {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .no-data {
    font-size: 12px;
    text-align: center;
    position: relative;
    top: 240px;
  }
  .rank-body {
    margin-top: 10px;
    display: flex;
    flex-flow: column;
    height: 500px;
    background: #667db6;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

    padding: 10px;
    border-radius: 4px;
    color: #fff;
    box-shadow: 0 0 2px #3fb3f1;
    .rank-item {
      margin-bottom: 6px;
      height: 30px;
      line-height: 30px;
      &.rank-first {
        .rank-num {
          background: #FDC830;  /* fallback for old browsers */
          background: -webkit-linear-gradient(to right, #F37335, #FDC830);  /* Chrome 10-25, Safari 5.1-6 */
          background: linear-gradient(to right, #F37335, #FDC830); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        }
      }
      &.rank-second {
        .rank-num {
          background: #00b09b;  /* fallback for old browsers */
          background: -webkit-linear-gradient(to right, #96c93d, #00b09b);  /* Chrome 10-25, Safari 5.1-6 */
          background: linear-gradient(to right, #96c93d, #00b09b); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        }
      }
      &.rank-third {
        .rank-num {
          background: #EECDA3;  /* fallback for old browsers */
          background: -webkit-linear-gradient(to right, #EF629F, #EECDA3);  /* Chrome 10-25, Safari 5.1-6 */
          background: linear-gradient(to right, #EF629F, #EECDA3); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        }
      }
      .rank-num {
        display: inline-block;
        text-align: center;
        margin: 4px 0;
        width: 36px;
        height: 16px;
        line-height: 16px;
        color: #fff;
        border-radius: 5px;
        font-size: 12px;
        letter-spacing: 1px;
      }
      .rank-name {
        font-size: 14px;
        text-shadow: 0 0 1px #089e8a;
      }
      .rank-hour {
        display: inline-block;
        font-size: 10px;
      }
    }
  }

  .tag-wrap {
    margin-top: 5px;
    float: right;
    font-size: 12px;
    height: 26px;
    .tag-item {
      margin-right: 5px;
    }
  }
  .chart-wrap {
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
}
</style>