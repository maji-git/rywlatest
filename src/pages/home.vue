<template>
  <f7-page name="home">
    <f7-navbar large :sliding="false">
      <f7-nav-left>
        <f7-link icon-ios="f7:menu" icon-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>RYW Latest</f7-nav-title>
      <f7-nav-title-large>
        <img src="@/assets/logo-txt.png" class="img-fluid" height="80">
      </f7-nav-title-large>
    </f7-navbar>

    <f7-block class="text-align-center" v-if="store.state.userData == null">
      <p>ทำการกรอกข้อมูลพื้นฐานเพื่อใช้งานระบบได้มากขึ้น</p>
      <f7-button fill login-screen-open="#info-register-screen">กรอกข้อมูล</f7-button>
    </f7-block>

    <f7-block>
      <div class="grid grid-cols-2 grid-gap">
        <f7-button tonal>ข่าวสารโรงเรียน</f7-button>
        <f7-button tonal href="/events/">ตารางกิจกรรม</f7-button>
      </div>
      <div class="grid grid-cols-2 grid-gap">
        <f7-button tonal>ตารางสอน</f7-button>
        <f7-button tonal href="/watpol/">ดูผลการเรียน</f7-button>
      </div>
      <div class="grid grid-cols-2 grid-gap">
        <f7-button tonal>กรอกใบลา</f7-button>
        <f7-button tonal>ประวัติพฤติกรรม</f7-button>
      </div>
    </f7-block>

    <f7-block-title>ข่าวสารโรงเรียน</f7-block-title>
    <div class="text-align-center" v-if="!isALoading">
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

    <f7-block-title>Modals</f7-block-title>
    <f7-block class="grid grid-cols-2 grid-gap">
      <f7-button fill popup-open="#my-popup">Popup</f7-button>
      <f7-button fill login-screen-open="#my-login-screen">Login Screen</f7-button>
    </f7-block>

    <f7-block-title>Panels</f7-block-title>
    <f7-block class="grid grid-cols-2 grid-gap">
      <f7-button fill panel-open="left">Left Panel</f7-button>
      <f7-button fill panel-open="right">Right Panel</f7-button>
    </f7-block>

    <f7-list strong inset dividersIos>
      <f7-list-item title="Dynamic (Component) Route"
        link="/dynamic-route/blog/45/post/125/?foo=bar#about"></f7-list-item>
      <f7-list-item title="Default Route (404)" link="/load-something-that-doesnt-exist/"></f7-list-item>
      <f7-list-item title="Request Data & Load" link="/request-and-load/user/123456/"></f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAnnouncements } from "@/js/lib/announcements.js"
import { Browser } from '@capacitor/browser';
import store from '@/js/store.js';

const openSite = async (url) => {
  await Browser.open({ url });
}

const annoucements = ref({})
const isALoading = ref(false)

onMounted(async () => {
  annoucements.value = (await getAnnouncements()).slice(0, 5);
  isALoading.value = true
})
</script>