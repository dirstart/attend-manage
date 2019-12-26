const getters = {
  cachedViews: state => state.tagsView.cachedViews,
  permissionMenus: state => state.user.permissionMenus,
  account: state => state.user.account,
  userInfo: state => state.user.userInfo,
  token: state => state.user.token,
  elements:state => state.user.elements
}
export default getters