<template>
  <div class="date-picker">
    <el-select v-model="fastVal" @change="_onFastTime" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-date-picker v-model="begin" @change="_onChangeDate" value-format="yyyyMMddHHmmss" type="datetime" placeholder="请选择开始时间" />
    <el-date-picker v-model="end" @change="_onChangeDate" value-format="yyyyMMddHHmmss" type="datetime" placeholder="请选择结束时间" :picker-options="limitStartDate(begin)" />
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "DatePicker",
  props: {
    beginTime: {
      required: true,
      default: null
    },
    endTime: {
      required: true,
      default: null
    },
  },
  data() {
    return {
      begin: this.beginTime,
      end: this.endTime,
      fastVal: null,
      options: [
        {
          value: 0,
          label: '今天'
        }, {
          value: 1,
          label: '昨天'
        }, {
          value: 2,
          label: '过去7天'
        }, {
          value: 3,
          label: '过去30天'
        }, {
          value: 4,
          label: '今年'
        }, {
          value: 5,
          label: '去年'
        }, {
          value: 6,
          label: '自定义'
        }
      ]
    }
  },
  watch: {
    beginTime(val) {
      this.begin = val;
      if (!val) this.fastVal = null;
    },
    begin(val) {
      this.$emit('update:beginTime', val);
    },
    endTime(val) {
      this.end = val;
    },
    end(val) {
      this.$emit('update:endTime', val);
    }
  },
  methods: {
    _onFastTime(val) {
      // 获取零点
      const zeroClock = moment().hour(0).minute(0).second(0);
      const endClock = moment().hour(23).minute(59).second(59);
      // 时间始终
      let startTime = null;
      let finishTime = null;
      switch(val) {
        case 0:
          startTime = zeroClock.format("YYYYMMDDHHmmss")
          finishTime = moment().format("YYYYMMDDHHmmss");
          break;
        case 1:
          startTime = zeroClock.subtract(1, "d").format("YYYYMMDDHHmmss");
          finishTime = endClock.subtract(1, "d").format("YYYYMMDDHHmmss")
          break;
        case 2:
          startTime = moment().subtract(7, "d").format("YYYYMMDDHHmmss");
          finishTime = moment().format("YYYYMMDDHHmmss");
          break;
        case 3:
          startTime = moment().subtract(1, "M").format("YYYYMMDDHHmmss");
          finishTime = moment().format("YYYYMMDDHHmmss");
          break;
        case 4:
          startTime = zeroClock.month(0).date(1).format("YYYYMMDDHHmmss");
          finishTime = moment().format("YYYYMMDDHHmmss");
          break;
        case 5:
          startTime = zeroClock.subtract(1, "Y").month(0).date(1).format("YYYYMMDDHHmmss");
          finishTime = endClock.subtract(1, "Y").month(11).date(31).format("YYYYMMDDHHmmss");
          break;
      }
      this.begin = startTime;
      this.end = finishTime;
    },
    _onChangeDate() {
      this.fastVal = 6;
    },
    limitStartDate(start) {
      let result = {};
      if (start) {
        if (!(start instanceof Date)) {
          start = moment(start, "YYYYMMDDHHmmss")._d;
        }
        result.disabledDate = time => {
          return time.getTime() < start.getTime();
        }
      }
      return result;
    }
  }
}
</script>

<style lang="scss" scoped>
  .date-picker {
    .el-select {
      width: 100px;
    }
  }
</style>
