import Vue from 'vue';

Vue.config.errorHandler = function (err, vm, info) {
  Vue.nextTick(() => {
    console.error(err, info)
  })
}
