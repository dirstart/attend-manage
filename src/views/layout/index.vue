<template>
  <div class="app-wrapper">
    <nav-menu />
    <div class="main-container">
      <tags-view></tags-view>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
export default {
  name: "layout",
  components: {
    NavMenu: () => import("./components/NavMenu"),
    AppMain: () => import("./components/AppMain"),
    TagsView: () => import("./components/TagsView")
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  }
};
</script>
