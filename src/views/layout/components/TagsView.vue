<template>
  <div class="tags-view-container" v-if="visitedViews.length">
    <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
      <router-link ref='tag' class="tags-view-item" :class="isActive(tag) ? 'active' : '' " 
      v-for="tag in Array.from(visitedViews)" :to="tag.path" :key="tag.path" @contextmenu.prevent.native="openMenu(tag,$event)">
        {{tag.title}}
        <span class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)'></span>
      </router-link>
    </scroll-pane>
    <ul class="contextmenu" v-show="visible" :style="{left:left+'px',top:top+'px'}">
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">全部关闭</li>
      <li @click="onRefresh(selectedTag)" v-show="isShowRefresh">刷新</li>
    </ul>
  </div>
</template>

<script>
import Vue from "vue";
import ScrollPane from "@/common/component/ScrollPane";

export default {
  components: { ScrollPane },
  data() {
    return {
      isShowRefresh: true,
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {}
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    }
  },
  watch: {
    $route() {
      this.addViewTags();
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) {
        window.addEventListener("click", this.closeMenu);
      } else {
        window.removeEventListener("click", this.closeMenu);
      }
    }
  },
  mounted() {
    this.addViewTags();
  },
  methods: {
    generateRoute() {
      if (this.$route.name) {
        return this.$route;
      }
      return false;
    },
    isActive(route) {
      return route.path === this.$route.path || route.name === this.$route.name;
    },
    addViewTags() {
      const route = this.generateRoute();
      if (!route) {
        return false;
      }
      this.$store.dispatch("addVisitedViews", route);
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag.$el);
            break;
          }
        }
      });
    },
    closeSelectedTag(view) {
      if (this.visitedViews.length > 1) {
        this.$store.dispatch("delVisitedViews", view).then(views => {
          if (this.isActive(view)) {
            const latestView = views.slice(-1)[0];
            if (latestView) {
              this.$router.push(latestView.path);
            } else {
              this.$router.push("/");
            }
          }
        });
      }
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag.path);
      this.$store.dispatch("delOthersViews", this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    closeAllTags() {
      this.$store.dispatch("delAllViews");
      this.$router.push("/");
    },
    openMenu(tag, e) {
      this.isShowRefresh = this.isActive(tag);
      this.visible = true;
      this.selectedTag = tag;
      this.left = e.clientX;
      this.top = e.clientY;
    },
    closeMenu() {
      this.visible = false;
    },
    // 刷新当前模块
    onRefresh(view) {
      // 先跳转一个空页面
      this.$router.push("/_empty");
      // 再次返回上一页即可
      this.$router.go(-1);
    }
  }
};
</script>
