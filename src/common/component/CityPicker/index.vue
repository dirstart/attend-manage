<template>
  <div class="city-picker">
    <el-select v-model="cityId" placeholder="省" :loading="provinceLoading" @change="changeProvince">
      <el-option v-for="item in provinces" :key="item.id" :label="item.label" :value="item.id">
      </el-option>
    </el-select>
    <el-select v-model="districtId" placeholder="市" :loading="cityLoading" @change="changeCity">
      <el-option v-for="item in cities" :key="item.id" :label="item.label" :value="item.id">
      </el-option>
    </el-select>
    <el-select v-model="code" placeholder="区县" :loading="districtLoading" @change="changeDistrict">
      <el-option v-for="item in districts" :key="item.code" :label="item.label" :value="item.code" />
    </el-select>
  </div>
</template>

<script>
import { getByCode } from '@/api/common';
// import { getRegionTree } from "@/api/standardAssets/houseManage";

export default {
  props: {
    value: {
      required: false
    }
  },
  data() {
    return {
      provinces: [],
      provinceId: null,
      provinceLoading: true,
      cities: [],
      cityId: null,
      cityLoading: true,
      districts: [],
      districtId: null,
      districtLoading: true,
      code: null
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.code = val;
          this.getAddr();
        }
      },
      immediate: true
    },
  },
  methods: {
    getAddr() {
      getByCode({ code: this.code }).then(res => {
        this.provinceId = parseInt(res.data.parentIds.split(',')[0]);
        this.cityId = parseInt(res.data.parentIds.split(',')[1]);
        this.districtId = parseInt(res.data.parentIds.split(',')[2]);
        // 获取省
        // getRegionTree({ parentId: this.provinceId }).then(res => {
        //   this.provinces = res.data;
        //   this.provinceLoading = false;
        // });
        // // 获取市
        // getRegionTree({ parentId: this.cityId }).then(res => {
        //   this.cities = res.data;
        //   this.cityLoading = false;
        // });
        // // 获取区
        // getRegionTree({ parentId: this.districtId }).then(res => {
        //   this.districts = res.data;
        //   this.districtLoading = false;
        // })
      })
    },
    changeProvince(provinceCode) {
      if (provinceCode) {
        this.cityId = provinceCode;
        this.cityLoading = true;

        this.districtId = null;
        this.cityLoading = true;
        this.code = null;
        this.districtLoading = true;
        this.$emit('complete', this.code)
        getRegionTree({ parentId: provinceCode }).then(res => {
          this.cities = res.data;
          this.cityLoading = false;
        })
      }

    },
    changeCity(cityCode) {
      if (cityCode) {
        this.districtId = cityCode;
        this.districtLoading = true;
        this.code = null;
        this.districtLoading = true;
        this.$emit('complete', this.code)
        getRegionTree({ parentId: cityCode }).then(res => {
          this.districts = res.data;
          this.districtLoading = false;
        })
      }

    },
    changeDistrict(districtCode) {
      this.code = districtCode
      this.$emit('complete', this.code)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.city-picker .el-input {
  width: 150px;
}
.el-select {
  width: 117px;
}
</style>
