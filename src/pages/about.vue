<template>
  <f7-page name="about">
    <f7-navbar title="เกี่ยวกับแอพนี้" back-link="ย้อนกลับ"></f7-navbar>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <f7-block>
            <img src="@/assets/ver.png" class="img-field">
            <p class="text-center text-sub text-sm m-0">RYW LATEST</p>
            <h1 class="text-center m-0 mb-2 version-txt">"starry" {{ appVersion }}</h1>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;สวัสดีครับ! และขอขอบคุณที่ติดตั้งแอพนี้ครับ
            </p>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;แอพนี้ทำงานโดยดึงข้อมูลมาจากหน้าเว็บระยองวิทย์ ผ่านวิธี Web-Scraping เพื่อให้เข้าถึงข้อมูลของตนได้ง่ายขึ้น
            </p>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;แอพนี้เป็นแอพที่เปิดให้ใช้ได้กับเพื่อนๆ ระยองวิทย์ทุกคน โดยไม่แสวงหาผลกำไร สำหรับใครที่สนใจในตัวโค้ด สามารถหาได้บน <f7-link @click="openSite('https://github.com/SK-Fast/rywlatest')">Github</f7-link>
            </p>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;แอพพัฒนาโดยเด็กชายธรรมจิตร กล่ำจันทร์ คับผม :>
            </p>
            <p>เขียนด้วย Framework7 Vue, Capacitor. ซอฟต์แวร์ License บนสัญญาอนุญาต MIT</p>
        
          </f7-block>
          <page-end/>
        </div>
      </div>
    </div>
  </f7-page>
</template>

<script setup>
import { Browser } from '@capacitor/browser';
import { ref } from 'vue';

const appVersion = ref(__APP_VERSION__)

const openSite = async (url) => {
  await Browser.open({ url });
}
</script>

<style scoped>
.text-sub, .version-txt {
  font-family: 'JetBrains Mono', monospace;
}
</style>