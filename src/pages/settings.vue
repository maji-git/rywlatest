<template>
  <f7-page name="settings">
    <f7-navbar title="เกี่ยวกับฉัน"></f7-navbar>

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
            <f7-list-item title="แผนการเรียน">{{ userData.classPlan }}</f7-list-item>
            <f7-list-item title="รหัสนักเรียน">{{ userData.studentID }}</f7-list-item>
            <f7-list-item title="บัตรประชาชน">{{ userData.nationalID }}</f7-list-item>
            <f7-list-item title="วันที่เกิด"><f7-button fill>แก้ไข</f7-button></f7-list-item>
            <f7-list-item title="ครูที่ปรึกษา">
              <ul>
                <li v-for="teacher in userData.classTeachers">{{teacher}}</li>
              </ul>
            </f7-list-item>
          </f7-list>
        </f7-accordion-content>
      </f7-list-item>
    </f7-list>
    
    <f7-block class="text-align-center">
      <p v-if="userData == null">ทำการกรอกข้อมูลพื้นฐานเพื่อใช้งานระบบได้มากขึ้น</p>
      <f7-button fill login-screen-open="#info-register-screen" v-text="userData == null ? 'กรอกข้อมูล' : 'แก้ไขข้อมูล'"></f7-button>
    </f7-block>
  </f7-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getInfo } from "@/js/lib/stdsession.js"
import { Browser } from '@capacitor/browser';
import store from '@/js/store.js';
import { useStore } from "framework7-vue"
const userData = useStore(store, "userData")

onMounted(() => {
  console.log(userData.value)
})
</script>