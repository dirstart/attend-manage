<template>
  <div class="person-wrap">
    <el-card class="all-height chart-wrap">
      <div slot="header">
        <el-row>
          <el-col :span="6">
            人员分类统计
          </el-col>
          <el-col :span="18">    
            <!-- <el-button-group class="float-right">
              <el-button size="mini" type="primary" icon="el-icon-arrow-left">概览</el-button>
              <el-button size="mini" type="primary">单行<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group> -->
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
        <div class="self-chart" id="barChart"></div>
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
            <span class="rank-name">{{item.name}}({{item.no}})</span>
            <span class="rank-hour">{{item.allOverTime}}h</span>
          </div>
          <div class="no-data" v-if="rankingList.length === 0">
            暂无数据
          </div>
        </div>
        <Calendar
          ref="Calendar"
          style="margin-top: 20px;"
          :markDate="markDateArr"
        ></Calendar>
      </div>
    </el-card>
  </div>
</template>

<script>
import {Column, Pie, Line, Bar, Liquid} from '@antv/g2plot';
import {dayToString, rankingSort} from "../common/utils";
import {timeInterval} from '../common/documents'
import Calendar from "vue-calendar-component";
import {getAllPart, getPersonByPart, getPersonOvertime, getPersonLine} from '@/api/statistic'
export default {
  name: 'depart',
  components: {
    Calendar
  },
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
      barChart: null,
      waterChart: null,
      waterMax: 0,
      waterValue: 0,
      markDateArr: []
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
          this.waterMax = this.personList.length || 0
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
          this.waterValue = this.pieData.length || 0
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
          this.markDateArr = this.lineData.filter(item => +item.overtime !== 0).map(item => item.date)
          this.initLineData()
          resolve(true)
        })
      })
    },
    initPieData() {
      const pieData = this.pieData.map(item => {
        item['支出'] = +item.cost
        return item
      })
      
      this.totalValue = 0
      for (let i = 0; i < this.pieData.length; i++) {
        this.totalValue += +this.pieData[i].allOverTime
      }
      // 加班时长柱状图
      if (!this.columnChart) {
        this.columnChart = new Column(
          document.getElementById('columnChart'), {
            height: 275,
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
            height: 275,
            forceFit: true,
            title: {
              visible: true,
              text: '部门内人员加班时长占比',
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
      // 加班费统计条形图
      if (!this.barChart) {
        this.barChart = new Bar(
          document.getElementById('barChart'), {
            height: 275,
            title: {
              visible: true,
              text: '人员加班费支出',
            },
            forceFit: true,
            data: pieData || [],
            colorField: 'name',
            xField: '支出',
            yField: 'name',
            xAxis: {
            },
          }
        )
        this.barChart.render()
      } else {
        this.barChart.changeData(pieData)
      }
      // 加班比例水波图
      // if (!this.waterChart) {
      //   this.waterChart = new Liquid(
      //     document.getElementById('waterChart'), {
      //     title: {
      //       visible: true,
      //       text: '水波图',
      //     },
      //     statistic: 'normal',
      //     width: 400,
      //     height: 400,
      //     min: 0,
      //     max: 10000,
      //     value: 4500,
      //     showValue: true
      //   });
      //   this.waterChart.render()
      // }
    },
    initLineData () {
      if (!this.lineChart) {
        this.lineChart = new Line(document.getElementById('lineChart'), {
          height: 275,
          title: {
            visible: true,
            text: '人员加班时长折线图',
          },
          description: {
            visible: true,
            text: '单位(h)',
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
      const arr = this.pieData || []
      return arr.sort(rankingSort('allOverTime')).slice(0, 7)
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

<style lang='scss'>

    // .content{
    //   padding: 15px;
    // }

    // .cardsp{
    //   height: 28px;
    //   line-height: 28px;
    //   position: relative;
    //   padding-left: 15px;
    //   margin-bottom: 15px;
    // }
    // .cardsp img{
    //   position: absolute;
    //   top: 7px;
    // }
    // .cardsp .spantwo{
    //   margin-left: 16px;
    // }
    // .cardsp .spanthere{
    //   margin-left: 15px;
    // }
    // .circular{
    //   display: inline-block;
    //   /*width: 12px;*/
    //   /*height: 12px;*/
    //   border: 5px solid #136aa7;
    //   border-radius: 50%;
    // }
.all-height {
  height: 100%;
}
.all-width {
  width: 100%;
}
.float-right {
  float: right;
}
.person-wrap {
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
  min-width: 1100px;
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
      height: calc(100% - 120px) !important;
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
    top: 100px;
  }
  .rank-body {
    margin-top: 20px;
    padding: 10px;
    background: #eee;
    width: 236px;
    height: 250px;
    min-height: 250px;

    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 0 2px #3fb3f1;

    position: relative;
    color: #169fe6;
    display: inline-block;
    background: #d4eef5;
    padding: 0 10px;
    cursor: pointer;
    transition-property: color;
    transition-duration: .3s;
    transform: translateZ(0);

    .rank-item {
      margin: 3px 0;
      height: 30px;
      line-height: 30px;
      &.rank-first {
        .rank-num {
          background: #FDC830;  /* fallback for old browsers */
          background: -webkit-linear-gradient(to left, #ffffe9, #FDC830);  /* Chrome 10-25, Safari 5.1-6 */
          background: linear-gradient(to left, #ffffe9, #FDC830); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        }
      }
      &.rank-second {
        .rank-num {
          background: #00b09b;  /* fallback for old browsers */
          background: -webkit-linear-gradient(to left, #ffffe9, #709df7);  /* Chrome 10-25, Safari 5.1-6 */
          background: linear-gradient(to left, #ffffe9, #709df7); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        }
      }
      &.rank-third {
        .rank-num {
          background: #EECDA3;  /* fallback for old browsers */
          background: -webkit-linear-gradient(to left, #ffffe9, #70dbb0);  /* Chrome 10-25, Safari 5.1-6 */
          background: linear-gradient(to left, #ffffe9, #70dbb0); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
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
        float: right;
      }
    }
  }

  .self-chart {
    margin-bottom: 5px;
    background: #eee;
    box-sizing: border-box;
    display: inline-block;
    width: 48%;
  }

  // 日历组件样式修改
  .wh_container {
    .wh_content_all {
      font-family: 微软雅黑 !important;
      // background: #fff;
      background: #eee;
      // 头部
      .wh_top_changge {
        background: #eee;
        .wh_jiantou1 {
          color: #303133;
        }
        color: #606266;
        border: 1px solid #E4E7ED;
        .wh_content_li {
          color: #606266;
        }
      }
      .wh_content {
        .wh_content_item {
          .wh_chose_day {
            background: none;
          }
          > .wh_isMark {
            background: #dac5aa;
            box-shadow: 0 0 2px blue;
          }
          .wh_item_date {
            width: 30px;
            height: 30px;
            margin: 5px;
            color: #606266;
            &:hover {
              background: none;
              color: #3390FF;
              box-shadow: 0 0 10px #000;
              border-radius: 50%;
            }
            &.wh_isToday {
              background-color: #3390FF;
              // width: 24px;
              // height: 24px;
              // display: block;
              // margin: 0 auto;
              box-shadow: 0 2px 12px 0 blue;
              line-height: 24px;
              border-radius: 50%;
            }
          }
          .wh_top_tag {
            color: #606266;
          }
        }
        
      }
    }
  }
}
</style>