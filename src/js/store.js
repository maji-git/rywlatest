
import { createStore } from 'framework7/lite';
import { f7 } from 'framework7-vue';

const store = createStore({
  state: {
    userData: null,
    classPlans: {
      first: {
        ["ห้องเรียนพิเศษวิทยาศาสตร์ ตามแนวทาง สสวท. และ สอวน."]: [1,2],
        ["SMART COM"]: [3],
        ["ปกติ"]: [4,5,6,7,8],
        ["EIS"]: [9,10,11],
        ["EP"]: [12,13,14],
      },
      second: {
        ["ห้องเรียนพิเศษวิทยาศาสตร์ตามโครงการพัฒนาและส่งเสริมผู้มีความสามารถพิเศษทางวิทยาศาสตร์ คณิตศาสตร์ เทคโนโลยี และสิ่งแวดล้อม"]: [1],
        ["Wit-Com"]: [2],
        ["EIS"]: [3,4],
        ["เตรียมวิศวะ"]: [5],
        ["วิทย์ - คณิต"]: [6,7,8,9],
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
    }
  },
  getters: {
    userData({ state }) {
      if (state.userData == null) {
        f7.loginScreen.open("#info-register-screen")
        return null
      }
      return state.userData;
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
