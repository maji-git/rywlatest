
import { createStore } from 'framework7/lite';
import { f7 } from 'framework7-vue';
import { useEmitter } from './composables/events.js'
import { encode } from 'html-entities';

const store = createStore({
  state: {
    userData: null,
    displayUserData: null,
    extraUserData: {
      preferredPfp: "default",
      preferredPfpType: "image",
      preferredPfpExtra: {},
      emojiPfpCache: "😉"
    },
    authData: {
      username: import.meta.env.VITE_LOGIN_USERNAME | "",
      password: import.meta.env.VITE_LOGIN_PASSWORD | ""
    },
    notify: {
      enabled: false,
      token: ""
    },
    eventColors: [
      "#dc3545",
      "#fd7e14",
      "#ffc107",
      "#198754",
      "#20c997",
      "#0dcaf0",
      "#D63385",
      "#6f42c1",
      "#6610f2",
      "#0d6efd",
    ],
    newNotify: false,
    teacherData: null,
    defaultPfps: ["/external-assets/pfp/cat.png", "/external-assets/pfp/dog.png", "/external-assets/pfp/capy.png"],
    notifyVapidKey: "BM9D5rXwYlVApFKH9Dh80aieKWQVhplozvTMNJ-3P3p_07-sizoKzttMouKO4_kEgxgcI6WqwlBq5-uF-yCOo4s",
    incognitoEnabled: false
  },
  getters: {
    userData({ state }) {
      if (state.userData == null) {
        return null
      }
      return state.userData;
    },
    displayUserData({ state }) {
      return state.displayUserData;
    },
    preferredPfp({ state }) {
      if (state.extraUserData.preferredPfp == "default") {
        if (state.displayUserData) {
          return state.displayUserData["headshot"]
        } else {
          return
        }
      }

      if (state.extraUserData.preferredPfpType == "emoji") {
        const svgData = `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="url(#pa)"/>        

        <text fill="black" xml:space="preserve" style="white-space: pre" font-family="Arial" font-size="50" letter-spacing="0em" text-anchor="middle" dominant-baseline="middle" x="50%" y="55%">${encode(state.extraUserData.preferredPfp, { mode: "nonAscii", level: "all", numeric: "hexadecimal" }).replaceAll("&zwj", "&#8205").replaceAll("&female", "&#x2640").replaceAll("&male", "&#9794")}</text>
        
        <defs>
        <linearGradient id="pa" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
        <stop stop-color="${store.state.extraUserData.preferredPfpExtra.start}"/>
        <stop offset="1" stop-color="${store.state.extraUserData.preferredPfpExtra.end}"/>
        </linearGradient>

        </defs>
        </svg>
        `

        return `data:image/svg+xml;base64,${btoa(svgData)}`
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
      state.userData = data
      state.displayUserData = data
    
      if (window.appMounted) {
        useEmitter().emit("userDataRefresh")
      }
    },
  },
})
window.store = store
export default store;
