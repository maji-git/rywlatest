<template>
    <f7-popup id="proxy-popup">
        <f7-view>
            <f7-page>
                <f7-navbar>
                    <f7-nav-left>
                        <f7-link><f7-icon size="20"></f7-icon></f7-link>
                    </f7-nav-left>

                    <f7-nav-title class="text-center">เกี่ยวกับการเชื่อมต่อ</f7-nav-title>

                    <f7-nav-right>
                        <f7-link popup-close><f7-icon material="close" size="20"></f7-icon></f7-link>
                    </f7-nav-right>
                </f7-navbar>

                <div class="text-align-center mt-5">
                    <f7-icon material="cloud_sync" color="teal" size="150" />
                    <h1 class="mt-0">กำลังทำงานผ่าน Proxy</h1>
                    <p class="mt-0"><f7-icon material="circle" color="teal" size="10" /> {{ serverURL }}</p>
                </div>

                <f7-block-title>อธิบายแบบเนิร์ดๆ 🤓</f7-block-title>
                <f7-block strong inset-md outline-ios>
                    <p>เนื่องจากข้อจำกัดทางเทคนิคของเว็บ ทำให้ไม่สามารถต่อกับระบบระยองวิทย์ได้โดยตรง
                        ตัวแอพได้ทำการเปลี่ยนจากเซิฟเวอร์ระยองวิทย์หลัก ไปหาเซิฟเวอร์ Proxy ก่อน</p>

                    <img src="@/assets/proxy-graph.png" alt="About Proxy" class="img-field rounded mt-3">

                    <p class="mt-3">ระบบนี้รับส่งข้อมูลได้อย่างปลอดภัยผ่าน HTTPS และไม่มีการเก็บข้อมูลไว้ที่เซิฟเวอร์ทั้งสิ้น
                        ข้อมูลเช่นรหัสนักเรียน เลขบัตรประชาชน และอื่นๆ จะถูกเก็บบนเครื่องเท่านั้น</p>

                    <p class="mt-3">ตัวซอฟต์แวร์นี้เปิด Open Source ด้วย หาได้ที่ <f7-link @click="openSite('https://github.com/SK-Fast/rywproxy')">Github</f7-link></p>

                    <i class="mt-3">ฟีเจอร์นี้สามารถใช้ได้บน PWA/iOS เท่านั้น</i>
                </f7-block>
            </f7-page>
        </f7-view>
    </f7-popup>
</template>

<script setup>
import { openSite } from "@/js/utils/opener.js"
import { ref } from 'vue';

const serverURL = ref(window.rywlAPIs.main)
</script>