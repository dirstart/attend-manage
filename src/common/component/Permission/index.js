import store from '@/store';

export default {
  install(Vue) {
    Vue.directive('permission', {
      bind: function (el, binding) {
        if (!store.getters.elements[binding.value] && !store.getters.account) {
          el.parentNode.removeChild(el);
        }
      }
    })
  }
}