<template>
    <f7-page name="watpol" ptr :ptr-mousewheel="true" @ptr:refresh="loadAnnouncements">
        <f7-navbar title="วัดผล" back-link="Back"></f7-navbar>

        <f7-list strong-ios dividers-ios inset-ios>
            <f7-list-input label="เลขประจำตัวนักเรียน" type="text" placeholder="00000" clear-button></f7-list-input>

            <f7-list-input label="วันเกิด" type="date" clear-button></f7-list-input>
        </f7-list>
    </f7-page>
</template>
  
<script setup>
import { onMounted, ref } from "vue";
import { getAnnouncements } from "@/js/lib/announcements.js"
import { Browser } from '@capacitor/browser';

const openSite = async (url) => {
    await Browser.open({ url });
}

const annoucements = ref({})
const isLoaded = ref(false)

const loadAnnouncements = async (done) => {
    isLoaded.value = false
    isLoaded.value = true
}

onMounted(async () => {
})
</script>