<template>
    <f7-page name="news" ptr :ptr-mousewheel="true" @ptr:refresh="loadAnnouncements">
        <f7-navbar title="ปฏิทินโรงเรียน" back-link="Back"></f7-navbar>

        <div class="timeline">
            <div class="timeline-item">
                <div class="timeline-item-date">21 <small>ตุลาคม</small></div>
                <div class="timeline-item-divider"></div>
                <div class="timeline-item-content">
                    <div class="timeline-item-inner">กิจกรรมเสริมทักษะเตรียมความพร้อม ระยองวิทยาคมคอนเสิร์ตครั้งที่ 1 ช่วงที่ 1</div>
                </div>
            </div>
        </div>
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