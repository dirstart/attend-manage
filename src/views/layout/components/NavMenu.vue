<template>
  <div class="menu-container">
    <div class="header-container">
      <router-link to="/" class="logo">
        <div class="place">考勤管理系统</div>
      </router-link>
      <div class="right">
        <el-dropdown @command="onCommand" class="user">
          <div class="el-dropdown-link">
            <div class="box">
              <b>{{userInfo ? (userInfo.loginName ? userInfo.loginName : '-') : '-'}}
                <i class="el-icon-caret-bottom"></i>
              </b>
              <p>{{userInfo ? (userInfo.name ? userInfo.name : '-') : '-'}}</p>
            </div>
          </div>
          <el-dropdown-menu slot="dropdown" class="header-dropdown-menu">
            <el-dropdown-item command="logout">安全退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="sidebar-container">
      <el-menu class="menu" :default-active="$route.path" :default-openeds="openMenu" v-if="permissionMenus">
        <template v-for="item in permissionMenus.children">
          <el-submenu :index="item.path" :key="item.name" v-if="item.children.length > 0">
            <template slot="title">
              <svg-icon v-if="item.icon" :icon-class="item.icon" />
              <span>{{item.name}}</span>
            </template>
            <template v-for="child in item.children">
              <el-menu-item :index="child.path" :key="child.name">
                <svg-icon v-if="child.icon" :icon-class="child.icon" />
                <span>{{child.name}}</span>
                <a v-if="newPageFilter.includes(child.code)" :href="'/#' + child.path" :target="child.path" class="url" />
                <router-link v-else :to="child.path" class="url" :target="newPageFilter.includes(child.code)? '_blank' : ''" />
              </el-menu-item>
            </template>
          </el-submenu>
          <el-menu-item v-else :index="item.path" :key="item.name">
            <svg-icon v-if="item.icon" :icon-class="item.icon" />
            <span>{{item.name}}</span>
            <router-link :to="item.path" class="url" :target="newPageFilter.includes(item.code)? '_blank' : '' " />
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { newPageFilter } from "@/utils/config";
import { putModifyPassword } from "@/api/login";

export default {
  name: "NavMenu",
  data() {
    return {
      openMenu: [],
      newPageFilter: newPageFilter,
      isPasswordDialog: false,
      ip: process.env.NODE_ENV === "development" ? process.env.IP : location.host,
      cityName: ''
    };
  },
  created() {
    if (this.permissionMenus)
    this.openMenu = this.permissionMenus.children.map(item => item.path);
  },
  computed: {
    ...mapGetters(["userInfo", "permissionMenus"])
  },
  methods: {
    logout() {
      this.$store.dispatch("logOut").then(() => {
        this.$router.push("/login");
      });
    },
    onCommand(command) {
      if (command === "logout") {
        this.logout();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
