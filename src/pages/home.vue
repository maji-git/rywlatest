<template>
  <f7-page name="home" ptr :ptr-mousewheel="true" @ptr:refresh="loadData">
    <f7-navbar large :sliding="false">
      <f7-nav-left>
        <f7-link icon-ios="f7:menu" icon-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>RYW Latest</f7-nav-title>
      <f7-nav-title-large>
        <LottieAnimation :animation-data="LogoTextJSON" :auto-play="false" :loop="false" :speed="1" style="height: 80px;" ref="logoAnim"/>

      </f7-nav-title-large>
    </f7-navbar>

    <swiper-container :pagination="true" class="swiper-multiple" :space-between="50" :slides-per-view="'auto'">
      <swiper-slide v-for="banner in banners">
        <div class="banner-img" :style="`background-image: url('${banner}');`" @click="$refs.page.open()"></div>
      </swiper-slide>
    </swiper-container>

    <f7-photo-browser ref="page" :photos="banners" :thumbs="banners" type="page" page-back-link-text="Back">
    </f7-photo-browser>

    <f7-block class="text-align-center" v-if="store.state.userData == null">
      <p>ทำการกรอกข้อมูลพื้นฐานเพื่อใช้งานระบบได้มากขึ้น</p>
      <f7-button fill login-screen-open="#info-register-screen">กรอกข้อมูล</f7-button>
    </f7-block>

    <f7-block>
      <div class="grid grid-cols-2 grid-gap mb-3">
        <f7-button tonal href="/news/" color="purple" class="home-action-btn">
          <f7-icon material="newspaper"></f7-icon>
          <p>ข่าวสารโรงเรียน</p>
        </f7-button>
        <f7-button tonal href="/calendar/" color="orange" class="home-action-btn">
          <f7-icon material="calendar_month"></f7-icon>
          <p>ตารางกิจกรรม</p>
        </f7-button>
      </div>
      <div class="grid grid-cols-1 grid-gap mb-3">
        <!--<f7-button tonal>ตารางสอน</f7-button>-->
        <f7-button tonal href="/watpol/" color="green" class="home-action-btn">
          <f7-icon material="scoreboard"></f7-icon>
          <p>ดูผลการเรียน</p>
        </f7-button>
        <!--
        <f7-button tonal href="/teachers/" color="blue" class="home-action-btn">
          <f7-icon material="badge"></f7-icon>
          <p>ข้อมูลคุณครู</p>
        </f7-button>
        -->
      </div>
    </f7-block>

    <f7-block strong inset v-if="store.state.userData != null">
      <f7-block-title>คะแนนพฤติกรรม</f7-block-title>
      <h1 :style="`color: ${behaviourData?.status == 'ไม่มีคะแนนพฤติกรรม' ? 'green' : 'orange'};`"
        :class="{ 'skeleton-text': !behaviourData['status'] }">{{ behaviourData.status ?? "กำลังโหลด" }}</h1>
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

    <br>
  </f7-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAnnouncements, getBanners } from "@/js/lib/announcements.js"
import { getBehaviourData } from "@/js/lib/stdsession.js"
import { Browser } from '@capacitor/browser';
import store from '@/js/store.js';
import { LottieAnimation } from "lottie-web-vue"
import LogoTextJSON from "@/assets/lottie/logo-text.json"

const openSite = async (url) => {
  await Browser.open({ url });
}

const annoucements = ref({})
const behaviourData = ref({})
const banners = ref([])
const logoAnim = ref()
const isLoading = ref(false)

const loadData = async (done) => {
  isLoading.value = true
  
  logoAnim.value.setDirection(-1)
  logoAnim.value.play()

  annoucements.value = (await getAnnouncements()).slice(0, 5);
  behaviourData.value = await getBehaviourData()
  banners.value = await getBanners()

  logoAnim.value.setDirection(1)
  logoAnim.value.play()
  
  isLoading.value = false
  if (done) {
    done()
  }
}

onMounted(() => {
  loadData()
})
</script>