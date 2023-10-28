<template>
  <f7-app v-bind="f7params">

    <!-- Left panel with cover effect-->
    <f7-panel left cover dark>
      <f7-view>
        <f7-page>
          <f7-navbar title="Left Panel"></f7-navbar>
          <f7-block>Left panel content goes here</f7-block>
        </f7-page>
      </f7-view>
    </f7-panel>


    <!-- Views/Tabs container -->
    <f7-views tabs class="safe-areas">
      <!-- Tabbar for switching views-tabs -->
      <f7-toolbar tabbar icons bottom>
        <f7-link tab-link="#view-home" tab-link-active icon-ios="f7:house_fill" icon-md="material:home"
          text="หน้าหลัก"></f7-link>
          <f7-link tab-link="#view-behavior" icon-ios="f7:asterisk_circle" icon-md="material:face" text="พฤติกรรม"></f7-link>
          <!--<f7-link tab-link="#view-docs" icon-ios="f7:book" icon-md="material:book" text="เอกสาร"></f7-link>-->
          <!--<f7-link tab-link="#view-sports" icon-ios="f7:sports_soccer" icon-md="material:sports_soccer" text="กีฬาสี"></f7-link>-->
          <f7-link tab-link="#view-settings" icon-ios="f7:person" icon-md="material:person" text="เกี่ยวกับฉัน"></f7-link>
      </f7-toolbar>

      <f7-view id="view-home" main tab tab-active url="/"></f7-view>
      <f7-view id="view-behavior" name="behaviour" tab url="/behaviour/"></f7-view>
      <f7-view id="view-docs" name="docs" tab url="/docs/"></f7-view>
      <f7-view id="view-sports" name="sports" tab url="/sports/"></f7-view>
      <f7-view id="view-settings" name="settings" tab url="/settings/"></f7-view>

    </f7-views>

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
              ข้อมูลนี้จะนำไปใช้ในการลงชื่อเข้าใช้ต่างๆ จะไม่มีการส่งข้อมูลออกทั้งสิ้น
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

import { getDevice } from 'framework7/lite-bundle';
import capacitorApp from '../js/capacitor-app.js';
import routes from '../js/routes.js';
import store from '@/js/store.js';
import { getInfo, saveToPreferences, loadFromPreferences, setToState, clearAuthState } from "@/js/lib/stdsession.js"

const device = getDevice();
const f7params = {
  name: 'คือ...!!!',
  theme: 'auto',
  colors: {
    primary: '#235B95',
  },
  store: store,
  routes: routes,
  input: {
    scrollIntoViewOnFocus: device.capacitor,
    scrollIntoViewCentered: device.capacitor,
  },
  statusbar: {
    enabled: true,
    androidBackgroundColor: "#EAF1F9",
    iosBackgroundColor: "#EAF1F9",
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
      saveToPreferences()

      f7.loginScreen.close()
    }, () => {
      clearAuthState()
    });
  } else {
    f7.dialog.alert('ไม่มีข้อมูลเกี่ยวกับเลขประจำตัวนี้' + studentID.value, () => {
      f7.loginScreen.close()
    });
  }
}

const closeInfoRegister = () => {
  f7.loginScreen.close()
}

onMounted(() => {
  f7ready(() => {
    if (device.capacitor) {
      capacitorApp.init(f7);
    }

    loadFromPreferences()
  });
});
</script>