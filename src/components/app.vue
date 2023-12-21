<template>
  <f7-app v-bind="f7params">

    <!-- Views/Tabs container -->
    <f7-views tabs class="safe-areas">
      <!-- Tabbar for switching views-tabs -->
      <f7-toolbar tabbar icons bottom>
        <f7-link tab-link="#view-home" tab-link-active icon-ios="f7:house_fill" icon-md="material:home"
          text="หน้าหลัก"></f7-link>

        <f7-link tab-link="#view-behavior" icon-ios="f7:asterisk_circle" icon-md="material:face"
          text="พฤติกรรม"></f7-link>

        <f7-link tab-link="#view-docs" icon-ios="f7:book" icon-md="material:book" text="เอกสาร"></f7-link>
        <f7-link tab-link="#view-calendar" icon-ios="f7:calendar_month" icon-md="material:calendar_month"
          text="ตารางกิจกรรม"></f7-link>
      </f7-toolbar>

      <f7-view id="view-home" main tab tab-active url="/"></f7-view>
      <f7-view id="view-behavior" name="behaviour" tab url="/behaviour/"></f7-view>
      <f7-view id="view-calendar" name="calendar" tab url="/calendar/"></f7-view>
      <f7-view id="view-docs" name="docs" tab url="/docs/"></f7-view>
      <f7-view id="view-sports" name="sports" tab url="/sports/"></f7-view>
      <f7-view id="view-settings" name="settings" tab url="/settings/"></f7-view>

    </f7-views>

    <LandingPopup />
    <NotifyPopup />
    <UpdatePopup />
    <ChangelogsPopup />
    <ProxyPopup />
    <PwaInstallPrompt />

    <f7-login-screen id="info-register-screen">
      <f7-view>
        <f7-page login-screen>
          <f7-login-screen-title>ลงชื่อเข้าใช้</f7-login-screen-title>
          <f7-list form>
            <f7-list-input label="รหัสนักเรียน" type="number" placeholder="00000"
              v-model:value="studentID"></f7-list-input>

            <f7-list-input label="รหัสบัตรประชาชน 13 หลัก" type="number" placeholder="0000000000000"
              v-model:value="cardID"></f7-list-input>
          </f7-list>
          <f7-list>
            <f7-list-button title="ค้นหา" @click="infoSubmitted"></f7-list-button>
            <f7-list-button title="ปิด" @click="closeInfoRegister"></f7-list-button>

            <f7-block-footer>
              ข้อมูลนี้จะนำไปใช้ในการลงชื่อเข้าใช้ต่างๆ กับระบบโรงเรียน จะไม่มีการส่งข้อมูลนี้ออกทั้งสิ้น

              <f7-link href="#"
                @click="openSite('https://rywlatest.web.app/legal/privacy')">เกี่ยวกับนโยบายความเป็นส่วนตัว</f7-link>
            </f7-block-footer>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-login-screen>
  </f7-app>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { f7, f7ready } from 'framework7-vue';
import LandingPopup from "./landing.vue"
import NotifyPopup from "./notify-popup.vue"
import UpdatePopup from "./update-popup.vue"
import ProxyPopup from "./proxy-popup.vue"
import ChangelogsPopup from "./changelogs-notice.vue"
import PwaInstallPrompt from "./pwa-install-prompt.vue"
import { AppUpdate } from '@capawesome/capacitor-app-update';

import { getDevice } from 'framework7/lite-bundle';
import capacitorApp from '../js/capacitor-app.js';
import routes from '../js/routes.js';
import store from '@/js/store.js';
import { getInfo, saveToPreferences, loadFromPreferences, setToState, clearAuthState } from "@/js/lib/stdsession.js"
import { loadPrefs as notifyLoadPrefs, waitForMessages } from "@/js/services/notifications.js"
import { Preferences } from "@capacitor/preferences"
import Logger from 'js-logger';
import { Browser } from '@capacitor/browser';

const openSite = async (url) => {
    await Browser.open({ url });
}

const device = getDevice();
const f7params = {
  name: 'คือ...!!!',
  theme: 'auto',
  colors: {
    primary: '#235B95',
  },
  store: store,
  routes: routes,
  touch: {
    tapHold: true
  },
  input: {
    scrollIntoViewOnFocus: device.capacitor,
    scrollIntoViewCentered: device.capacitor,
  },
  statusbar: {
    enabled: true,
    androidBackgroundColor: (window.darkMode ? "#252A30" : "#EAF1F9"),
    androidTextColor: (window.darkMode ? "white" : "black"),
    iosBackgroundColor: "#EAF1F9",
    iosOverlaysWebView: true,
  },
};

const studentID = ref('');
const cardID = ref('');

const infoSubmitted = async () => {
  const preloadDialog = f7.dialog.preloader("กำลังค้นหา...")
  setToState(studentID.value, cardID.value)
  const studentData = await getInfo()

  preloadDialog.close()

  if (studentData['firstname'] != "") {
    f7.dialog.confirm(`คุณใช่ ${studentData.firstname} ${studentData.surname} จากห้อง ${studentData.mathayom}/${studentData.room} หรือไม่?`, () => {
      f7.toast.create({ text: "บันทึกข้อมูลเสร็จสิ้น!", closeTimeout: 2000, closeButton: true }).open()
      store.state.userData = studentData
      Preferences.set({ key: "landingDone", value: "1" })
      saveToPreferences()

      f7.loginScreen.close()
    }, () => {
      clearAuthState()
    });
  } else {
    f7.dialog.alert('ไม่มีข้อมูลเกี่ยวกับเลขประจำตัวนี้' + studentID.value, () => {
    });
  }
}

const closeInfoRegister = () => {
  f7.loginScreen.close()
}

onMounted(() => {
  f7ready(async () => {
    if (device.capacitor) {
      capacitorApp.init(f7);
    }

    if (window.darkMode) {
      document.querySelector("#framework7-root").classList.add("dark")
    }

    try {
      waitForMessages()
      notifyLoadPrefs()
    } catch (err) {
      Logger.error(err)
    }

    let firstTime = "0"
    try { firstTime = await Preferences.get({ key: "landingDone" }) } catch { }

    let notifyPrompted = "0"
    try { notifyPrompted = await Preferences.get({ key: "notifyPrompted" }) } catch { }

    let appUpdateInfo;

    if (window.isNative) {
      appUpdateInfo = await AppUpdate.getAppUpdateInfo()
    }

    window.pref = Preferences

    let pwaInstalled = window.matchMedia('(display-mode: standalone)').matches
    if (import.meta.env.MODE == 'development') {
      pwaInstalled = true
    }

    if (!pwaInstalled && !window.isNative) {
      f7.popup.open("#pwa-install-popup", false)
    }

    if (pwaInstalled || window.isNative) {
      if (firstTime.value !== "1") {
        f7.popup.open("#landing-popup", true)

        if (window.isNative) {
          Preferences.set({ key: "changelogLatest", value: appUpdateInfo.currentVersion.toString() })
        }

      } else if (notifyPrompted.value !== "1") {
        if (window.isNative) {
          f7.popup.open("#notify-popup")
          Preferences.set({ key: "notifyPrompted", value: "1" })
        }
      } else {
        if (window.isNative) {
          if (appUpdateInfo.availableVersion != appUpdateInfo.currentVersion) {
            f7.sheet.open("#update-sheet")
          } else {
            const prefChangelog = await Preferences.get({ key: "changelogLatest" })

            if (prefChangelog.value != appUpdateInfo.currentVersion) {
              f7.popup.open("#changelogs-popup")
            }
          }
        }
      }
    }

    setTimeout(() => {
      document.querySelector("#preload-splash").classList.add("loaded")

      setTimeout(() => {
        document.querySelector("#preload-splash").remove()
      }, 1000);
    }, 100);

  });
});
</script>