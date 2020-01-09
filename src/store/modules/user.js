import { getEmployee } from '@/api/homepage'
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '@/utils/auth'

const user = {
  state: {
    userInfo: getUser(),
    permissionMenus: {
      children: [{
        name: '一级菜单',
        path: '',
        children: [{
          name: '首页',
          icon: 'table',
          path: '/homepage'
        }, {
          name: '个人统计',
          icon: '',
          path: '/person'
        }, {
          name: '部门统计',
          icon: '',
          path: '/depart'
        }]
      }]
    },
    token: getToken(),
    elements: undefined
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      setToken(state.token)
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
      setUser(userInfo);
    },
    SET_PERMISSION_MENUS: (state, permissionMenus) => {
      state.permissionMenus = permissionMenus
    },
    DELETE_USERINFO: (state) => {
      state.userInfo = null
    },
    DELETE_PERMISSION_MENUS: (state) => {
      state.permissionMenus = null
    },
    // 按钮权限
    SET_ELEMENTS: (state, elements) => {
      state.elements = elements
    }
  },

  actions: {
    // 用户名登录
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        getEmployee().then(res => {
          const { code, data } = res.data;
          if (code === 200) {
            let result = data.find(item => {
              if (item.staffNo == userInfo.loginName) {
                commit('SET_TOKEN', 'QEDFEGS=1278FS=FDSFGWA');
                commit('SET_USERINFO', item);
                resolve();
              }
            });
            if (!result) reject('用户名或密码错误，请重新输入！');
          } else {
            reject('接口报错，请联系管理员！');
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    logOut({ commit }) {
      return new Promise((resolve) => {
        removeToken();
        removeUser();
        commit('DELETE_USERINFO');
        commit('DELETE_PERMISSION_MENUS');
        resolve();
      });
    },
    getUserInfo({ commit }) {
      return new Promise((resolve) => {
        commit('SET_PERMISSION_MENUS', res.data);
        resolve();
      })
    }
  },
}


export default user
