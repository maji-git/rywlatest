<template>
  <f7-page name="home" ptr :ptr-mousewheel="true" @ptr:refresh="loadData" @page:beforein="beforeLoadIn">

    <f7-navbar large :sliding="false">
      <f7-nav-left>
        <!--
        <f7-link href="/notifications/" v-if="isNative">
          <f7-icon ios="f7:bell" md="material:notifications">
            <f7-badge color="red" v-if="newNotify"></f7-badge>
          </f7-icon>
        </f7-link>
        -->

        <f7-link popup-open="#proxy-popup" v-if="!isNative">
          <f7-icon material="cloud_sync" color="teal">
          </f7-icon>
        </f7-link>

        <f7-link class="external" @click="openFeedback">
          <f7-icon material="rate_review">
          </f7-icon>
        </f7-link>
      </f7-nav-left>

      <f7-nav-title class="text-center" sliding>RYW Latest</f7-nav-title>

      <f7-nav-right>
        <f7-link href="/settings/" v-if="userData" class="user-avatar"
          :style="`background-image: url(${userPfp})`"></f7-link>

        <f7-link href="/settings/" v-else>
          <f7-icon ios="f7:person" md="material:account_circle">
          </f7-icon>
        </f7-link>
      </f7-nav-right>

      <f7-nav-title-large>
        <LottieAnimation v-if="!darkMode" :animation-data="LogoTextJSON" :auto-play="false" :loop="false" :speed="1"
          style="height: 80px;" ref="logoAnim" />
        <LottieAnimation v-if="darkMode" :animation-data="LogoTextDarkJSON" :auto-play="false" :loop="false" :speed="1"
          style="height: 80px;" ref="logoAnim" />

      </f7-nav-title-large>
    </f7-navbar>

    <!--
    <div class="home-head">
      <LottieAnimation :animation-data="LogoTextJSON" :auto-play="false" :loop="false" :speed="1"
        style="height: 80px;position: relative;top: 8px;" ref="logoAnim" />
    </div>
    -->

    <div class="alert alert-warn" v-if="!isOnline">
      ไม่มีอินเตอร์เน็ต
    </div>

    <swiper-container :pagination="true" class="swiper-multiple" :space-between="50" :slides-per-view="'auto'">
      <swiper-slide v-for="banner in banners">
        <div class="banner-img" :style="`background-image: url('${banner}');`" @click="$refs.page.open()"></div>
      </swiper-slide>
    </swiper-container>

    <f7-photo-browser ref="page" :photos="banners" :thumbs="banners" type="page" page-back-link-text="Back">
    </f7-photo-browser>

    <f7-block class="text-align-center" v-if="userData == null && !isLoading">
      <p>ทำการกรอกข้อมูลพื้นฐานเพื่อใช้งานระบบได้มากขึ้น</p>
      <f7-button fill login-screen-open="#info-register-screen">กรอกข้อมูล</f7-button>
    </f7-block>

    <f7-block v-if="store.state.wideAlerts?.enabled" strong inset :color="store.state.wideAlerts.colour"
      v-html="store.state.wideAlerts.msg"></f7-block>

    <f7-block>
      <div class="grid grid-cols-2 medium-grid-cols-5 grid-gap mb-3">
        <f7-button tonal href="/news/" color="purple" class="block-action-btn" v-if="isNative">
          <f7-icon material="newspaper"></f7-icon>
          <p>ข่าวสารโรงเรียน</p>
        </f7-button>
        <f7-button tonal href="/attendee/" color="blue" class="block-action-btn" v-if="userData">
          <f7-icon material="meeting_room"></f7-icon>
          <p>บันทึกการมาโรงเรียน</p>
        </f7-button>
        <f7-button tonal href="/watpol/" color="green" class="block-action-btn" v-if="userData">
          <f7-icon material="scoreboard"></f7-icon>
          <p>ดูผลการเรียน</p>
        </f7-button>
        <f7-button tonal href="/teachers/" color="orange" class="block-action-btn" v-if="userData">
          <f7-icon material="school"></f7-icon>
          <p>ข้อมูลคุณครู</p>
        </f7-button>
        <f7-button tonal href="/rooms/" color="red" class="block-action-btn">
          <f7-icon material="sensor_door"></f7-icon>
          <p>ห้อง</p>
        </f7-button>

        <!--<f7-button tonal href="/quota/" color="tint" class="block-action-btn">
          <f7-icon material="meeting_room"></f7-icon>
          <p>โควตา</p>
        </f7-button>-->

      </div>
    </f7-block>

    <f7-block class="mb-0 pb-0 pt-0 mt-2">
      <div class="mb-3" v-if="store.state.iframeApps" v-for="ifApp in iframeApps" @click="emitter.emit('ifAppLaunch', ifApp.url)">

        <div class="row justify-content-center">
          <iframe class="col-11 p-0 ifapp-banner" :src="`${ifApp.url}/banner.html`" frameborder="0" height="150" scrolling="no"></iframe>

        </div>
      </div>
    </f7-block>

    <f7-block strong inset v-if="userData != null" @click="openTab('#view-behavior')">
      <f7-block-title>คะแนนพฤติกรรม</f7-block-title>
      <h1
        :style="`color: ${behaviourData?.status == 'ไม่มีคะแนนพฤติกรรม' ? 'var(--f7-color-teal)' : 'var(--f7-color-deeporange)'};`"
        :class="{ 'skeleton-text': !behaviourData['status'] }">{{ behaviourData.status ?? "กำลังโหลด" }}</h1>
    </f7-block>

    <f7-block strong inset v-if="userData != null && !isHoliday" @click="openRoute('/attendee/')">
      <f7-block-title>ระบบบันทึกการมาโรงเรียน</f7-block-title>
      <div class="display-flex align-items-center" style="color: var(--f7-color-teal);" v-if="checkedIn">
        <f7-icon material="check_circle" size="40"></f7-icon>
        <div class="ms-2">
          <h2 class="m-0">บันทึกแล้ว</h2>
          <p class="m-0"><strong>{{ checkedInTime }}</strong></p>
        </div>
      </div>

      <h1 v-if="checkedIn == false && isLoading == false" style="color: var(--f7-color-deeporange);"><f7-icon
          material="error" size="30"></f7-icon> ยังไม่ได้บันทึก</h1>
      <h1 v-if="!checkedIn && isLoading" style="color: var(--f7-md-secondary);">กำลังโหลด</h1>
    </f7-block>

    <div v-if="isNative">
      <f7-block-title>ข่าวสารโรงเรียน</f7-block-title>
      <div class="text-align-center" v-if="isLoading">
        <f7-preloader />
      </div>
      <f7-list strong inset>
        <ul>
          <f7-list-item media-item v-for="(item, index) in annoucements" :key="index" link="#" :title="item.title"
            :subtitle="item.date" @click="openSite(item.article)"></f7-list-item>
        </ul>
      </f7-list>
      <div class="text-align-center">
        <f7-link href="/news/">ดูทั้งหมด</f7-link>
      </div>
    </div>

    <div class="mb-5" v-if="currentPlatform == 'Safari'"></div>

    <page-end />

    <br>
  </f7-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAnnouncements, getBanners } from "@/js/lib/announcements.js"
import { getBehaviourData, getAttendees } from "@/js/lib/stdsession.js"
import { openSite } from "@/js/utils/opener.js"
import store from '@/js/store.js';
import { LottieAnimation } from "lottie-web-vue"
import LogoTextJSON from "@/assets/lottie/logo-text.json"
import LogoTextDarkJSON from "@/assets/lottie/logo-text-dark.json"
import { f7, useStore } from 'framework7-vue';
import { loadPrefs as notifyLoadPrefs } from "@/js/services/notifications.js"
import Logger from "js-logger"
import platform from "platform"
import { useEmitter } from '@/js/composables/events.js'

const emitter = useEmitter()

const openRoute = (path) => {
  f7.view.main.router.navigate(path)
}

const openTab = (path) => {
  f7.tab.show(path)
}

const userData = useStore('displayUserData')
const iframeApps = useStore('iframeApps')

const targetLogoText = ref(LogoTextJSON)
const annoucements = ref({})
const behaviourData = ref({})
const banners = ref([])
const logoAnim = ref()
const isLoading = ref(false)
const checkedIn = ref(false)
const isHoliday = ref(false)
const isOnline = ref(true)
const darkMode = ref(window.darkMode)
const checkedInTime = ref("")
const userPfp = ref("")

const loadBehaviour = async () => {
  try { behaviourData.value = await getBehaviourData() } catch (err) { Logger.error(err) }

  const today = new Date()

  // Check Holidays
  if (today.getDay() == 6 || today.getDay() == 0) {
    isHoliday.value = true
  } else {
    isHoliday.value = false

    // Not holiday, check for attendee
    try {
      const attendeeData = (await getAttendees(today.getMonth() + 1)).reverse()

      if (attendeeData[0]) {
        if (attendeeData[0].date.getDate() == today.getDate()) {
          checkedIn.value = true
          checkedInTime.value = attendeeData[0].entranceTime
        }
      }
    } catch (err) { Logger.error(err) }
  }
}

const beforeLoadIn = () => {
  userPfp.value = store.getters.preferredPfp.value
}

const openFeedback = () => {
  const formURL = new URL("https://docs.google.com/forms/d/e/1FAIpQLScEZgm8WwSJsS4BpqMNMna5kvtOGkJMxjdP5rlrVzlGYJ4x1Q/viewform")
  formURL.searchParams.append("usp", "pp_url")

  if (store.state.userData) {
    formURL.searchParams.append("entry.1374260474", `มัธยมศึกษาปีที่ ${store.state.userData.mathayom}`)
  }

  let osField = "Unknown"

  switch (platform.os.family) {
    case "Android":
      osField = "Android"
      break;
    case "iOS":
      osField = "iOS"
      break;
  }

  formURL.searchParams.append("entry.1467095533", osField)

  formURL.searchParams.append("entry.1404173330", `${platform.name}/${platform.version}`)
  formURL.searchParams.append("entry.1404398283", __APP_VERSION__)

  openSite(formURL.toString())
}

const loadData = async (done) => {
  isOnline.value = navigator.onLine

  if (!navigator.onLine) {
    if (done) {
      done()
    }
    return
  }

  if (store.state.userData) {
    notifyLoadPrefs()
  }

  isLoading.value = true
  checkedIn.value = false

  logoAnim.value.setDirection(-1)
  logoAnim.value.play()

  if (store.state.userData) {
    await loadBehaviour()
  }

  if (window.isNative) {
    try { annoucements.value = (await getAnnouncements()).slice(0, 5) } catch (err) { Logger.error(err) }
    try { banners.value = await getBanners() } catch (err) { Logger.error(err) }
  }

  logoAnim.value.setDirection(1)
  logoAnim.value.play()

  isLoading.value = false
  if (done) {
    done()
  }
}

onMounted(() => {
  if (window.darkMode) {
    targetLogoText.value = LogoTextDarkJSON
  }

  loadData()
})
</script>