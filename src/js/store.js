
import { createStore } from 'framework7/lite';
import { f7 } from 'framework7-vue';

const store = createStore({
  state: {
    userData: null,
    extraUserData: {
      preferredPfp: "default"
    },
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
    defaultPfps: ["/external-assets/pfp/cat.png", "/external-assets/pfp/dog.png", "/external-assets/pfp/josh.png"],
    notifyVapidKey: "BM9D5rXwYlVApFKH9Dh80aieKWQVhplozvTMNJ-3P3p_07-sizoKzttMouKO4_kEgxgcI6WqwlBq5-uF-yCOo4s"
  },
  getters: {
    userData({ state }) {
      if (state.userData == null) {
        return null
      }
      return state.userData;
    },
    preferredPfp({ state }) {
      if (state.extraUserData.preferredPfp == "default") {
        if (state.userData) {
          return state.userData["headshot"]
        } else {
          return
        }
      }

      return state.extraUserData.preferredPfp
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
