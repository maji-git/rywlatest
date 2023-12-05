<template>
  <f7-page name="settings">
    <f7-navbar title="เกี่ยวกับฉัน" back-link="ย้อนกลับ"></f7-navbar>

    <br>
    <div class="text-align-center" v-if="userData != null">
      <img :src="`https://rayongwit.ac.th/ticket/pic/${userData.studentID}s.JPG`" class="rounded" height="200">
      <h2>{{ userData.firstname }} {{ userData.surname }}</h2>
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
              <img v-if="store.state.classPlansLogos.includes(userData.classPlan)" :src="`plan-icons/${userData.classPlan}.png`" class="mr-2" height="40">
              
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

const clearAllData = () => {
  f7.dialog.confirm("คุณต้องการลบข้อมูลทั้งหมดหรือไม่? (จะทำการรีเซ็ตทั้งแอพ)", async () => {
    f7.dialog.close()

    Logger.info("Clearing user data...")
    
    const allKeys = await Preferences.keys()

    for (const k of allKeys.keys) {
      await Preferences.remove({key: k})
    }

    await Preferences.remove({ key: "landingDone" })
    await Preferences.remove({ key: "changelogLatest" })
    await Preferences.remove({ key: "notifyPrompted" })
    await Preferences.remove({ key: "changelogLatest" })
    await Preferences.remove({ key: "landingDone" })
    await Preferences.remove({ key: "notifyData" })

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

onMounted(() => {
})
</script>