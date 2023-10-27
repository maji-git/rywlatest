<template>
  <f7-page name="about">
    <f7-navbar title="เกี่ยวกับแอพนี้" back-link="Back"></f7-navbar>
    <f7-block>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;สวัสดีฮะ!
      </p>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;แอพนี่เป็นแอพทำเล่นๆ ระหว่างตอนช่วงเปิดเทอม เลยลองทำดู
      </p>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;แอพนี้ทำงานโดยดึงข้อมูลมาจากหน้าเว็บ เป็นข้อมูลที่สามารถเห็นได้อยู่แล้ว ไม่มีการเข้าถึงผ่านระบบ Admin หรือใดๆ ทั้งสิ้น (และ: มันเกิดขึ้นภายในแอพเอง ไม่มีการเข้าถึงเว็บเพิ่มเติม :D)
      </p>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;โปรเจคนี้เป็นโปรเจคแบบว่างจริง แอพฟรีไม่มีโฆษณา ไม่แสวงหาผลกำไร สามารถหาได้บน <f7-link @click="openSite('https://github.com/SK-Fast/rywlatest')">Github</f7-link>
      </p>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;แอพสร้างโดยปกป้องเอง (สักคนจากสมารทคอม)
      </p>
    </f7-block>
  </f7-page>
</template>

<script setup>
import { Browser } from '@capacitor/browser';

const openSite = async (url) => {
  await Browser.open({ url });
}
</script>