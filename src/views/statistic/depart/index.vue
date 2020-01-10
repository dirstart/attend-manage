<template>
  <div class="depart-wrap">
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
            <span class="rank-name">{{item.departName}}</span>
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
import {Column, Pie, Line, Bar, Gauge} from '@antv/g2plot';
import {dayToString, rankingSort} from "../common/utils";
import {timeInterval} from '../common/documents'
import Calendar from "vue-calendar-component";
import {getDepartOvertime, getAllPart, getDepartLine} from '@/api/statistic'
export default {
  name: 'depart',
  components: {
    Calendar
  },
  async created() {
    await this.getAllPart()
    await this.getDepartOvertime();
    await this.getDepartLine();
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
      // 后端返回数据
      list: [],
      lineData: [],
      // G2Plot
      columnChart: null,
      pieChart: null,
      lineChart: null,
      barChart: null,
      markDateArr: []
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
    initFirstGroup() {
      this.totalValue = 0
      for (let i = 0; i < this.list.length; i++) {
        this.totalValue += +this.list[i].allOverTime
      }
      const columnData = this.list.map(item => {
        return {
          type: item.departName,
          value: +item.allOverTime,
          '支出': +item.cost
        }
      })
      // 加班时长柱形图
      if (!this.columnChart) {
        this.columnChart = new Column(
          document.getElementById('columnChart'), {
            height: 275,
            title: {
              visible: true,
              text: '各部门加班时长柱形图',
            },
            forceFit: true,
            padding: 'auto',
            data: columnData,
            xField: 'type',
            yField: 'value',
            colorField: 'type',
            meta: {
              type: {
                alias: '部门名称',
              },
              value: {
                alias: '加班时长（h）',
              },
            },
          }
        )
        this.columnChart.render()
      } else {
        this.columnChart.changeData(columnData)
      }
      // 加班时长饼图
      if (!this.pieChart) {
        this.pieChart = new Pie(
          document.getElementById('pieChart'), {
            height: 275,
            forceFit: true,
            title: {
              visible: true,
              text: '各部门加班时长占比',
            },
            description: {
              visible: true,
              text:
                '单位(h)',
            },
            radius: 0.8,
            data: columnData,
            angleField: 'value',
            colorField: 'type',
            label: {
              visible: true,
              type: 'inner',
              formatter: (value, all, test) => {
                return `${(value / this.totalValue * 100).toFixed(2)}%`
              }
            },
            tooltip: {
              visible: true,
              // htmlContent: (title, items) => {
              //   console.log('test', title, items)
              //   return '<div>1</div>'
              // }
            }
          }
        )
        this.pieChart.render()
      } else {
        this.pieChart.changeData(columnData)
      }
      // 加班费统计条形图
      if (!this.barChart) {
        this.barChart = new Bar(
          document.getElementById('barChart'), {
            height: 275,
            title: {
              visible: true,
              text: '各部门加班费支出',
            },
            forceFit: true,
            data: columnData || [],
            colorField: 'type',
            xField: '支出',
            yField: 'type',
            xAxis: {
            },
          }
        )
        this.barChart.render()
      } else {
        this.barChart.changeData(columnData)
      }
    },
    initSecondGroup () {
      // 部门间加班多折线图
      if (!this.lineChart) {
        const data = [
          {
            date: '2020/8/20',
            type: 'download',
            value: 4623,
          },
          {
            date: '2018/8/2',
            type: 'bill',
            value: 257,
          },
          {
            date: '2018/8/3',
            type: 'download',
            value: 508,
          },
        ];
        this.lineChart = new Line(document.getElementById('lineChart'), {
          height: 275,
          title: {
            visible: true,
            text: '各部门加班时长折线图',
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
          yField: 'value',
          legend: {
            position: 'right-top',
          },
          seriesField: 'type',
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
        startTime = dayToString(nowDate - 90 * oneDay)
      }
      // 所有部门
      if (this.orgCompare === 1) {
        departNos = []
      } else {
        departNos = this.selectedOrg.map(item => item.departNo)
      }
      return new Promise((resolve, reject) => {
        getDepartLine({
          startTime,
          endTime,
          departNos
        }).then(res => {
          const arr = res.data && res.data.data || []
          this.lineData = this.handleLineData(arr)
          this.markDateArr = this.lineData.filter(item => +item.allOverTime !== 0).map(item => item.date)
          this.initSecondGroup()
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
      for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i].departName]) {
          tem = []
          obj[arr[i].departName] = true
          res.push(tem)
        } else {
          tem.push(arr[i])
        }
      }
      // 造数据
      const oneDay = 1000 * 60 * 60 * 24
      const nowDate = +new Date()
      const endTime = dayToString(nowDate)

      if (this.commonTime === '近一周') {
        for (let j = 0; j < res.length; j++) {
          // 用于判断数据中是否有这个日期
          let dateArr = res[j].map(item => item.date)
          res[j] = res[j].sort((a, b) => {
            const aValue = +new Date(a.date)
            const bValue = +new Date(b.date)
            return aValue - bValue
          })
        }
      } else if (this.commonTime === '近一月') {
        for (let j = 0; j < res.length; j++) {
          // 用于判断数据中是否有这个日期
          let dateArr = res[j].map(item => item.date)
          res[j] = res[j].sort((a, b) => {
            const aValue = +new Date(a.date)
            const bValue = +new Date(b.date)
            return aValue - bValue
          })
        }
      } else {
        for (let j = 0; j < res.length; j++) {
          // 用于判断数据中是否有这个日期
          let dateArr = res[j].map(item => item.date)
          res[j] = res[j].sort((a, b) => {
            const aValue = +new Date(a.date)
            const bValue = +new Date(b.date)
            return aValue - bValue
          })
        }
      }
      let all = []
      for (let s = 0; s < res.length; s++) {
        all = all.concat(res[s])
      }
      for (let h = 0; h < all.length; h++) {
        all[h].type = all[h].departName
        all[h].value = all[h].allOverTime
        all[h].date = all[h].date
      }
      return all
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
        startTime = dayToString(nowDate - 90 * oneDay)
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
          this.list = arr
          this.initFirstGroup()
          resolve(true)
        })
      })
    }
  },
  mounted () {
  },
  computed: {
    rankingList () {
      const arr = this.list || []
      return arr.sort(rankingSort('allOverTime')).slice(0, 7)
    }
  },
  watch: {
    commonTime (value) {
      this.getDepartOvertime()
      this.getDepartLine()
    } 
  }
};
</script>

<style lang='scss'>
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
      // height: calc(100% - 120px);
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
      }
    }
  }


  .tag-wrap {
    margin-top: 4px;
    float: right;
    font-size: 12px;
    height: 26px;
    .tag-item {
      margin-right: 5px;
    }
  }
  .moni-tag {
    color: #089e8a;
    float: right;
    font-size: 12px;
    line-height: 18px;
    text-shadow: 0 0 3px #eee;
  }

  // #columnChart,
  // #pieChart {
  // }
  .self-chart {
    margin-bottom: 5px;
    border-radius: 4px;
    background: #eee;
    box-sizing: border-box;
    display: inline-block;
    width: 48%;
  }
  // 日历组件样式修改
  .wh_container {
    .wh_content_all {
      border-radius: 4px;
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