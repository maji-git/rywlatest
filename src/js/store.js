
import { createStore } from 'framework7/lite';
import { f7 } from 'framework7-vue';

console.log("import.meta.env.VITE_LOGIN_USERNAME ", import.meta.env.VITE_LOGIN_USERNAME)

const store = createStore({
  state: {
    userData: null,
    authData: {
      username: import.meta.env.VITE_LOGIN_USERNAME | "",
      password: import.meta.env.VITE_LOGIN_PASSWORD | ""
    },
    notify: {
      enabled: false,
      token: ""
    },
    newNotify: false,
    teacherData: null,
  },
  getters: {
    userData({ state }) {
      if (state.userData == null) {
        return null
      }
      return state.userData;
    },
    sessionID({ state }) {
      if (state.userData == null) {
        return null
      }
      return state.userData.sessionID;
    },
    newNotify({ state }) {
      return state.newNotify
    }
  },
  actions: {
    setUserdata({ state }, data) {
      state.userData = data;
    },
  },
})
window.store = store
export default store;
