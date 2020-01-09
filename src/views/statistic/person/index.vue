<template>
  <div class="depart-wrap">
    <el-card class="all-height chart-wrap">
      <div slot="header">
        <el-row>
          <el-col :span="6">
            人员分类统计
          </el-col>
          <el-col :span="18">              
            <el-radio-group class="float-right" v-model="commonTime" size="mini">
              <el-radio-button v-for="(item, index) in timeInterval"
                :value="item.value"
                :label="item.label"
                :key="index"
              ></el-radio-button>
            </el-radio-group>
            <el-select class="float-right"
              style="width:150px;margin-top:2px;margin-right: 10px;line-height: 28px;"
              size="mini"
              @change="handleChange"
              v-model="orgValue"
              placeholder="请选择">
              <el-option v-for="(item, index) in allOrg"
                :key="index"
                :value="item.departNo"
                :label="item.departName"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <!-- 图表 panel -->
      <div class="chart-panel">
        <div class="self-chart" id="columnChart"></div>
        <div class="self-chart" id="pieChart"></div>
        <div class="self-chart" id="lineChart"></div>
        <!-- <div class="self-chart" id="columnChart"></div>
        <div class="self-chart" id="pieChart"></div>
        <div class="self-chart" id="lineChart"></div>
        <div class="self-chart" id="barChart"></div> -->
      </div>
    </el-card>
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
  </div>
</template>

<script>
import {Column, Pie, Line, Bar} from '@antv/g2plot';
import {dayToString, rankingSort} from "../common/utils";
import {timeInterval} from '../common/documents'
import {getAllPart, getPersonByPart, getPersonOvertime, getPersonLine} from '@/api/statistic'
export default {
  name: 'depart',
  async created() {
    await this.getAllPart()
    // 获取当前部门的人员id
    await this.getPersonByPart()
    await this.getValueByPerson()
    await this.getPersonLine()
  },
  data() {
    return {
      timeInterval: timeInterval,
      commonTime: '近一月',
      // 全部部门
      allOrg: [],
      orgValue: '',
      personList: [],
      pieData: [],
      // 后端返回数据
      list: [],
      lineData: [],
      // G2Plot
      columnChart: null,
      pieChart: null,
      lineChart: null,
      barChart: null
    };
  },
  methods: {
    // 各部门时长占比图
    initFirstGroup() {
    },
    initSecondGroup () {
    },
    async handleChange() {
      // 获取当前部门的人员id
      await this.getPersonByPart()
      await this.getValueByPerson()
      await this.getPersonLine()
    },
    getPersonByPart () {
      return new Promise((resolve, reject) => {
        getPersonByPart(this.orgValue).then(res => {
          this.personList = res.data.data || []
          resolve(true)
        })
      })
    },
    getValueByPerson () {
      // 一天的值
      const oneDay = 1000 * 60 * 60 * 24
      const nowDate = +new Date()
      const endTime = dayToString(nowDate)
      let startTime
      if (this.commonTime === '近一周') {
        startTime = dayToString(nowDate - 7 * oneDay)
      } else if (this.commonTime === '近一月') {
        startTime = dayToString(nowDate - 30 * oneDay)
      } else {
        startTime = dayToString(nowDate - 90 * oneDay)
      }
      return new Promise((resolve, reject) => {
        const staffNos = this.personList.map(item => item.staffNo)
        getPersonOvertime({
          startTime,
          endTime,
          staffNos
        }).then(res => {
          this.pieData = res.data.data || []
          let arr = []
          let haveId = this.pieData.map(item => item.no)
          for (let i = 0; i < this.personList.length; i++) {
            if (!haveId.includes(this.personList[i].staffNo)) {
              this.pieData.push({
                allOverTime: 0,
                cost: 0,
                name: this.personList[i].staffName,
                no: this.personList[i].staffNo
              })
            }
          }
          this.initPieData()
          resolve(true)
        })
      })
    },
    getPersonLine () {
      // 一天的值
      const oneDay = 1000 * 60 * 60 * 24
      const nowDate = +new Date()
      const endTime = dayToString(nowDate)
      let startTime
      if (this.commonTime === '近一周') {
        startTime = dayToString(nowDate - 7 * oneDay)
      } else if (this.commonTime === '近一月') {
        startTime = dayToString(nowDate - 30 * oneDay)
      } else {
        startTime = dayToString(nowDate - 90 * oneDay)
      }
      return new Promise((resolve, reject) => {
        const noGroup = this.personList.map(item => item.staffNo)
        getPersonLine({
          startTime,
          endTime,
          noGroup
        }).then(res => {
          this.lineData = res.data.data || []
          this.initLineData()
          resolve(true)
        })
      })
    },
    initPieData() {
      const pieData = this.pieData
      this.totalValue = 0
      for (let i = 0; i < this.pieData.length; i++) {
        this.totalValue += +this.pieData[i].allOverTime
      }
      // 加班时长柱状图
      if (!this.columnChart) {
        this.columnChart = new Column(
          document.getElementById('columnChart'), {
            height: 270,
            title: {
              visible: true,
              text: '各人员加班时长柱形图',
            },
            forceFit: true,
            padding: 'auto',
            data: pieData,
            xField: 'name',
            yField: 'allOverTime',
            colorField: 'name',
            label: {
              visible: true,
            },
            meta: {
              name: {
                alias: '人员姓名',
              },
              allOverTime: {
                alias: '加班时长（h）',
              },
            },
          }
        )
        this.columnChart.render()
      } else {
        this.columnChart.changeData(pieData)
      }
      // 加班时长饼图
      if (!this.pieChart) {
        this.pieChart = new Pie(
          document.getElementById('pieChart'), {
            height: 270,
            forceFit: true,
            title: {
              visible: true,
              text: '部门内加班时长占比',
            },
            description: {
              visible: true,
              text:
                '',
            },
            radius: 0.8,
            data: pieData,
            angleField: 'allOverTime',
            colorField: 'name',
            label: {
              visible: true,
              type: 'inner',
              formatter: (value, all, test) => {
                console.log('test', this.totalValue)
                return `${(value / this.totalValue * 100).toFixed(2)}%`
              }
            },
            tooltip: {
              visible: true,
            },
          }
        )
        this.pieChart.render()
      } else {
        this.pieChart.changeData(pieData)
      }
    },
    initLineData () {
      if (!this.lineChart) {
        this.lineChart = new Line(document.getElementById('lineChart'), {
          height: 270,
          title: {
            visible: true,
            text: '各部门加班时长折线图',
          },
          description: {
            visible: true,
            text: '将数据按照某一字段进行分组，用于比对不同类型数据的趋势。',
          },
          label: {
            // visible: true,
            type: 'point'
          },
          padding: 'auto',
          forceFit: true,
          data: this.lineData,
          xField: 'date',
          yField: 'overtime',
          legend: {
            position: 'right-top',
          },
          seriesField: 'name',
          responsive: true,
        });
        this.lineChart.render()
      } else {
        this.lineChart.changeData(this.lineData)
      }
    },
    getAllPart () {
      return new Promise((resolve, reject) => {
        getAllPart().then(res => {
          this.allOrg = res.data.data || []
          this.orgValue = this.allOrg[0].departNo
          resolve(true)
        })
      })
    },
  },
  computed: {
    rankingList () {
      const arr = []
      return arr.sort(rankingSort('allOverTime')).slice(0, 14)
    }
  },
  watch: {
    async commonTime (value) {
      // 获取当前部门的人员id
      await this.getPersonByPart()
      await this.getValueByPerson()
      await this.getPersonLine()
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
  flex-wrap: nowrap;
  height: 100%;
  min-width: 1000px;
  .msg-wrap {
    flex: 0 0 300px;
    box-sizing: border-box;
    min-width: 300px;
  }
  .chart-wrap {
    flex: 1;
    margin-right: 10px;
    box-sizing: border-box;
    .chart-panel {
      box-sizing: border-box;
      width: 100%;
    };
    .first-pie-chart {
      width: 500px;
      height: 320px;
    }
    > .el-card__body {
      height: calc(100% - 120px);
      .chart-panel {
        height: 100%;
        overflow: scroll;
      }
    }
  }

  .rank-header {
    padding-bottom: 26px;
    border-bottom: 1px solid #eee;
  }
  .no-data {
    font-size: 12px;
    text-align: center;
    position: relative;
    top: 240px;
  }
  .rank-body {
  }

  .self-chart {
    margin-bottom: 5px;
    background: #eee;
    box-sizing: border-box;
    display: inline-block;
    width: 48%;
  }
}
</style>