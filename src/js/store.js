
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
    teacherData: null,
    teacherGroups: {
      [100]: "ฝ่ายบริหาร",
      [200]: "กองกลาง",
      [1]: "ภาษาไทย",
      [2]: "คณิตศาสตร์",
      [3]: "วิทยาศาสตร์และเทคโนโลยี",
      [4]: "สังคมศึกษา ศาสนา และวัฒนธรรม",
      [5]: "สุขศึกษาและพลศึกษา",
      [6]: "ศิลปะ",
      [7]: "การงานอาชีพ",
      [8]: "ภาษาต่างประเทศ",
      [9]: "โครงการห้องเรียนพิเศษ Englsh Program",
      [10]: "เอเชียตะวันออก",
      [11]: "กิจกรรมพัฒนาผู้เรียน",
      [12]: "เจ้าหน้าที่สำนักงาน",
    },
    teacherRoleColor: {
      "หัวหน้ากลุ่มสาระ": "red",
      "รองหัวหน้ากลุ่มสาระ": "orange",
      "ครู": "blue",
      "หัวหน้างานบริหารการเงินและบัญชี": "green",
      "ครูพิเศษ": "yellow",
      "วิทยาศาสตร์": "purple",
      "เทคโนโลยี": "blue",
    },
    classPlansLogos: [
      "GIFTED",
      "SMART COM",
      "EIS",
      "EP",
      "Wit-Com",
    ],
    classPlans: {
      first: {
        ["GIFTED"]: [1, 2],
        ["SMART COM"]: [3],
        ["ปกติ"]: [4, 5, 6, 7, 8],
        ["EIS"]: [9, 10, 11],
        ["EP"]: [12, 13, 14],
      },
      second: {
        ["ห้องเรียนพิเศษวิทยาศาสตร์ตามโครงการพัฒนาและส่งเสริมผู้มีความสามารถพิเศษทางวิทยาศาสตร์ คณิตศาสตร์ เทคโนโลยี และสิ่งแวดล้อม"]: [1],
        ["Wit-Com"]: [2],
        ["EIS"]: [3, 4],
        ["เตรียมวิศวะ"]: [5],
        ["วิทย์ - คณิต"]: [6, 7, 8, 9],
        ["อังกฤษ - คณิต"]: [10],
        ["นิติศาสตร์ - รัฐศาสตร์"]: [11],
        ["ศิลปะ - ดนตรี - นาฏศิลป์ - กีฬา และธุรกิจ"]: [12],
        ["อังกฤษ - จีน แผน ก"]: [13],
        ["อังกฤษ - จีน แผน ข"]: [14],
        ["อังกฤษ - ฝรั่งเศส"]: [15],
        ["อังกฤษ - ญี่ปุ่น"]: [16],
        ["อังกฤษ -เกาหลี"]: [17],
        ["EP วิทย์ - คณิต"]: [18],
        ["EP ศิลป์ - ภาษา"]: [19],
      }
    },
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
