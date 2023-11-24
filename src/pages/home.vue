<template>
  <f7-page name="home" ptr :ptr-mousewheel="true" @ptr:refresh="loadData">

    <f7-navbar large :sliding="false">
      <f7-nav-left>
        <f7-link href="/notifications/">
          <f7-icon ios="f7:notifications" md="material:notifications">
            <f7-badge color="red" v-if="newNotify"></f7-badge>
          </f7-icon>
        </f7-link>
      </f7-nav-left>

      <f7-nav-title class="text-center" sliding>RYW Latest</f7-nav-title>

      <f7-nav-right>
        <f7-link href="/settings/" v-if="userData" class="user-avatar"
          :style="`background-image: url(${userData.headshot})`"></f7-link>

        <f7-link href="/settings/" v-else>
          <f7-icon ios="f7:user" md="material:account_circle">
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

    <f7-block strong inset color="green">
      <strong><f7-icon material="lightbulb" size="20"></f7-icon> แอพนี้อยู่ในระหว่างการทดสอบ</strong>
      ถ้าเจอบัค หรือมีไอเดียดีๆ ก็ผ่ากส่งมาได้ที่ IG <f7-link
        @click="openSite('https://www.instagram.com/devpoxl')">@devpoxl</f7-link> 😺
    </f7-block>

    <f7-block>
      <div class="grid grid-cols-2 grid-gap mb-3">
        <f7-button tonal href="/news/" color="purple" class="block-action-btn">
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
          <f7-icon material="school"></f7-icon>
          <p>ห้อง</p>
        </f7-button>
      </div>
    </f7-block>

    <f7-block strong inset v-if="userData != null">
      <f7-block-title>คะแนนพฤติกรรม</f7-block-title>
      <h1
        :style="`color: ${behaviourData?.status == 'ไม่มีคะแนนพฤติกรรม' ? 'var(--f7-color-teal)' : 'var(--f7-color-deeporange)'};`"
        :class="{ 'skeleton-text': !behaviourData['status'] }">{{ behaviourData.status ?? "กำลังโหลด" }}</h1>
    </f7-block>

    <f7-block strong inset v-if="userData != null && !isHoliday">
      <f7-block-title>ระบบบันทึกการมาโรงเรียน</f7-block-title>
      <div class="display-flex align-items-center" style="color: var(--f7-color-teal);" v-if="checkedIn">
        <f7-icon material="check_circle" size="40"></f7-icon>
        <div class="ml-2">
          <h2 class="m-0">บันทึกแล้ว</h2>
          <p class="m-0"><strong>{{ checkedInTime }}</strong></p>
        </div>
      </div>

      <h1 v-if="checkedIn == false && isLoading == false" style="color: var(--f7-color-deeporange);"><f7-icon
          material="error" size="30"></f7-icon> ยังไม่ได้บันทึก</h1>
      <h1 v-if="!checkedIn && isLoading" style="color: var(--f7-md-secondary);">กำลังโหลด</h1>
    </f7-block>

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

    <page-end />

    <br>
  </f7-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAnnouncements, getBanners } from "@/js/lib/announcements.js"
import { getBehaviourData, getAttendees } from "@/js/lib/stdsession.js"
import { Browser } from '@capacitor/browser';
import store from '@/js/store.js';
import { LottieAnimation } from "lottie-web-vue"
import LogoTextJSON from "@/assets/lottie/logo-text.json"
import LogoTextDarkJSON from "@/assets/lottie/logo-text-dark.json"
import { f7, useStore } from 'framework7-vue';

const openSite = async (url) => {
  await Browser.open({ url });
}

const newNotify = useStore('newNotify')
const userData = useStore('userData')

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

const loadData = async (done) => {
  isOnline.value = navigator.onLine

  if (!navigator.onLine) {
    if (done) {
      done()
    }
    return
  }

  isLoading.value = true
  checkedIn.value = false

  logoAnim.value.setDirection(-1)
  logoAnim.value.play()

  try { annoucements.value = (await getAnnouncements()).slice(0, 5) } catch (err) { console.error(err) }
  if (store.state.userData) {
    try { behaviourData.value = await getBehaviourData() } catch (err) { console.error(err) }

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
      } catch (err) { console.error(err) }
    }
  }

  try { banners.value = await getBanners() } catch (err) { console.error(err) }

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