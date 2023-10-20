<template>
    <f7-page name="news" ptr :ptr-mousewheel="true" @ptr:refresh="loadAnnouncements">
        <f7-navbar title="ข่าวสารทางโรงเรียน" back-link="Back"></f7-navbar>
        <f7-block-title>ข่าวสารโรงเรียน</f7-block-title>
        <div class="text-align-center" v-if="!isLoaded">
            <f7-preloader />
        </div>
        <f7-list strong inset>
            <ul>
                <f7-list-item media-item v-for="(item, index) in annoucements" :key="index" @click="openSite(item.article)" link="#" :title="item.title"
                    :subtitle="item.date"></f7-list-item>
            </ul>
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

const loadAnnouncements = async(done) => {
    isLoaded.value = false
    annoucements.value = await getAnnouncements();
    isLoaded.value = true

    if (done) {
        done()
    }
}

onMounted(async () => {
    loadAnnouncements()
})
</script>