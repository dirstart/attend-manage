<template>
  <section class="app-main" >
    <transition name="fade" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "AppMain",
  data() {
    return {}
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    }
  },
};
</script>