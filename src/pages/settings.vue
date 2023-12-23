<template>
  <f7-page name="settings">
    <f7-navbar title="เกี่ยวกับฉัน" back-link="ย้อนกลับ"></f7-navbar>

    <br>
    <div class="text-align-center" v-if="userData != null">
      <swiper-container ref="swipePfp" :effect="'cards'" :grabCursor="true" events-prefix="swiper-"
        class="pictures-swipe">
        <swiper-slide source="default"><img :src="`${userData.headshot}`" height="200"></swiper-slide>

        <swiper-slide v-for="dpfp in store.state.defaultPfps" :source="dpfp"><img :src="dpfp" height="200">
          <button class="pfp-delete"> <f7-icon ios="f7:minus" md="material:remove" size="15" color="white"></f7-icon>
          </button>
        </swiper-slide>

        <swiper-slide class="add-pfp"><f7-icon ios="f7:plus_circle_fill" md="material:add_circle"
            size="60"></f7-icon></swiper-slide>
      </swiper-container>

      <h1 class="mt-5">{{ userData.firstname }} {{ userData.surname }}</h1>
      <p>ห้อง {{ userData.mathayom }}/{{ userData.room }}</p>
    </div>

    <f7-list strong outline-ios dividers-ios inset-md accordion-list v-if="userData != null">
      <f7-list-item accordion-item title="ข้อมูลนักเรียน">
        <f7-accordion-content>
          <f7-list>
            <f7-list-item title="ชื่อ นามสกุล">{{ userData.firstname }} {{ userData.surname }}</f7-list-item>
            <f7-list-item title="มัธยมศึกษาปีที่">{{ userData.mathayom }}</f7-list-item>
            <f7-list-item title="ห้อง">{{ userData.room }}</f7-list-item>
            <f7-list-item title="เลขที่">{{ userData.no }}</f7-list-item>
            <f7-list-item title="แผนการเรียน">
              <div class="display-flex align-items-center">
                <img v-if="store.state.classPlansLogos.includes(userData.classPlan)"
                  :src="`plan-icons/${userData.classPlan}.png`" class="me2" height="40">

                {{ userData.classPlan }}
              </div>
            </f7-list-item>
            <f7-list-item title="รหัสนักเรียน">{{ userData.studentID }}</f7-list-item>
            <f7-list-item title="บัตรประชาชน">{{ userData.nationalID }}</f7-list-item>
            <f7-list-item title="ครูที่ปรึกษา">
              <ul>
                <li v-for="teacher in userData.classTeachers">{{ teacher }}</li>
              </ul>
            </f7-list-item>
          </f7-list>
        </f7-accordion-content>
      </f7-list-item>
    </f7-list>

    <f7-block class="text-align-center">
      <p v-if="userData == null">ทำการกรอกข้อมูลพื้นฐานเพื่อใช้งานระบบได้มากขึ้น</p>
      <f7-button fill login-screen-open="#info-register-screen"
        v-text="userData == null ? 'กรอกข้อมูล' : 'แก้ไขข้อมูล'"></f7-button>
      <f7-list>
        <f7-list-button link="/prefs/" fill>การตั้งค่า</f7-list-button>
        <f7-list-button link="/about/" fill>เกี่ยวกับแอพนี้</f7-list-button>
        <f7-list-button fill v-if="userData != null" color="red" @click="clearUserdata">ลงชื่อออก</f7-list-button>
        <f7-list-button fill @click="clearAllData" color="red">ล้างข้อมูลออกทั้งหมด</f7-list-button>
      </f7-list>
    </f7-block>
  </f7-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { clearAuthState, saveToPreferences } from "@/js/lib/stdsession.js"
import store from '@/js/store.js';
import { useStore, f7 } from "framework7-vue"
import { Preferences } from "@capacitor/preferences";
const userData = useStore(store, "userData")
import Logger from "js-logger"

const swipePfp = ref(null)

const clearAllData = () => {
  f7.dialog.confirm("คุณต้องการลบข้อมูลทั้งหมดหรือไม่? (จะทำการรีเซ็ตทั้งแอพ)", async () => {
    f7.dialog.close()

    Logger.info("Clearing user data...")

    const allKeys = await Preferences.keys()

    for (const k of allKeys.keys) {
      await Preferences.remove({ key: k })
    }

    await Preferences.remove({ key: "landingDone" })
    await Preferences.remove({ key: "changelogLatest" })
    await Preferences.remove({ key: "notifyPrompted" })
    await Preferences.remove({ key: "changelogLatest" })
    await Preferences.remove({ key: "landingDone" })
    await Preferences.remove({ key: "notifyData" })

    clearAuthState()
    await saveToPreferences()

    window.location.reload()
  })
}

const clearUserdata = () => {
  f7.dialog.confirm("คุณต้องการที่จะลงชื่อออกหรือไม่?", async () => {
    f7.dialog.close()
    store.state.userData = null
    clearAuthState()
    await saveToPreferences()

    window.location.reload()
  })
}

const pfpRequestChange = (i) => {
  const targetPfpSource = swipePfp.value.querySelectorAll("swiper-slide")[swipePfp.value.swiper.activeIndex]?.getAttribute("source")

  if (targetPfpSource) {
    store.state.extraUserData.preferredPfp = targetPfpSource

    Preferences.set({ key: "extraUserData", value: JSON.stringify(store.state.extraUserData) })
  }
}

onMounted(() => {
  if (swipePfp.value) {
    swipePfp.value.addEventListener('swiper-slidechange', pfpRequestChange);

    const allSlides = Array.from(swipePfp.value.querySelectorAll(`swiper-slide`))
    const targetPfpEl = swipePfp.value.querySelector(`swiper-slide[source='${store.state.extraUserData.preferredPfp}']`)

    if (targetPfpEl) {
      swipePfp.value.swiper.slideTo(allSlides.indexOf(targetPfpEl))
    }
  }
})
</script>

<style scoped>
.pictures-swipe {
  width: 151px;
  height: 200px;
  border-radius: 8px;
}

.pictures-swipe swiper-slide {
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
  overflow: visible;
}

.pictures-swipe swiper-slide img {
  border-radius: 8px;
}

.pfp-delete {
  position: absolute;
  right: -15px;
  top: -15px;
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: var(--f7-color-red);
  border: none;
  border-radius: 50%;
  pointer-events: none;
  transition: 0.5s opacity;
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide-active .pfp-delete {
  opacity: 1;
  pointer-events: all;
}

.add-pfp {
  background-color: var(--f7-md-primary-container);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--f7-color-primary);
}
</style>