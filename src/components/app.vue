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
        <f7-link tab-link="#view-settings" icon-ios="f7:person" icon-md="material:person" text="เกี่ยวกับฉัน"></f7-link>
      </f7-toolbar>

      <!-- Your main view/tab, should have "view-main" class. It also has "tab-active" class -->
      <f7-view id="view-home" main tab tab-active url="/"></f7-view>

      <!-- Catalog View -->
      <f7-view id="view-catalog" name="catalog" tab url="/catalog/"></f7-view>

      <!-- Settings View -->
      <f7-view id="view-settings" name="settings" tab url="/settings/"></f7-view>

    </f7-views>


    <!-- Popup -->
    <f7-popup id="my-popup">
      <f7-view>
        <f7-page>
          <f7-navbar title="Popup">
            <f7-nav-right>
              <f7-link popup-close>Close</f7-link>
            </f7-nav-right>
          </f7-navbar>
          <f7-block>
            <p>Popup content goes here.</p>
          </f7-block>
        </f7-page>
      </f7-view>
    </f7-popup>

    <f7-login-screen id="info-register-screen">
      <f7-view>
        <f7-page login-screen>
          <f7-login-screen-title>ลงชื่อเข้าใช้</f7-login-screen-title>
          <f7-list form>

            <f7-list-input label="รหัสนักเรียน" type="text" placeholder="00000" v-model:value="studentID"></f7-list-input>

            <f7-list-input label="รหัสบัตรประชาชน 13 หลัก" type="text" placeholder="0000000000000"
              v-model:value="cardID"></f7-list-input>

            <f7-list-input label="วันเกิด" type="date" placeholder="" v-model:value="birthdate"></f7-list-input>
          </f7-list>
          <f7-list>
            <f7-list-button title="ค้นหา" @click="alertLoginData"></f7-list-button>
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
import store from '../js/store';

const device = getDevice();
// Framework7 Parameters
const f7params = {
  name: 'Rayongwit Latest', // App name
  theme: 'auto', // Automatic theme detection
  colors: {
    primary: '#235B95',
  },

  // App store
  store: store,
  // App routes
  routes: routes,


  // Input settings
  input: {
    scrollIntoViewOnFocus: device.capacitor,
    scrollIntoViewCentered: device.capacitor,
  },
  // Capacitor Statusbar settings
  statusbar: {
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
};
// Login screen data
const studentID = ref('');
const cardID = ref('');
const birthdate = ref('');

const alertLoginData = () => {
  f7.dialog.alert('Username: ' + studentID.value + '<br>Password: ' + cardID.value + '<br>Birthdate: ' + birthdate.value, () => {
    f7.loginScreen.close();
  });
}

onMounted(() => {
  f7ready(() => {

    // Init capacitor APIs (see capacitor-app.js)
    if (device.capacitor) {
      capacitorApp.init(f7);
    }
    // Call F7 APIs here
  });
});
</script>