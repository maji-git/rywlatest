<template>
    <f7-page name="การตั้งค่า">
        <f7-navbar title="การตั้งค่า" back-link="Back"></f7-navbar>

        <f7-block>
            <f7-list>
                <f7-list-button @click="rerunApp">รีเซ็ตแอพ</f7-list-button>
                <f7-list-button @click="openLanding">เปิด Landing</f7-list-button>
            </f7-list>
        </f7-block>
    </f7-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import store from '@/js/store.js';
import { useStore, f7 } from "framework7-vue"

const rerunApp = () => {
    location.reload()
}

const openLanding = () => {
    f7.popup.open("#landing-popup")
}

onMounted(() => {
})
</script>