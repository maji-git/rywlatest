<template>
    <f7-page name="news" infinite :infinite-distance="80" :infinite-preloader="showPreloader" @infinite="loadMore">
        <f7-navbar title="ปฏิทินโรงเรียน" back-link="Back">
            <f7-nav-right>
                <f7-link class="searchbar-enable" data-searchbar=".searchbar-demo" icon-ios="f7:search"
                    icon-md="material:search" />
            </f7-nav-right>
            <f7-searchbar class="searchbar-demo" expandable />
        </f7-navbar>

        <div class="timeline">
            <div class="timeline-item" v-for="event in events">
                <div class="timeline-item-date">{{ event.utc_start_date_details.day }} <small>{{
                    monthsName[event.utc_start_date_details.month - 1] }}</small></div>
                <div class="timeline-item-divider"></div>
                <div class="timeline-item-content">
                    <div class="timeline-item-inner">{{ decodeHTMLEntities(event.title) }}</div>
                </div>
            </div>
        </div>
    </f7-page>
</template>
  
<script setup>
import { onMounted, ref } from "vue";
import { getEvents } from "@/js/lib/tribecalendar.js"
import { decodeHTMLEntities } from "@/js/utils/text.js"
import { Browser } from '@capacitor/browser';

const openSite = async (url) => {
    await Browser.open({ url });
}

const events = ref([])
const showPreloader = ref(false)
const monthsName = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",];
const currentPage = ref(1)
const pageEnded = ref(false)

const loadMore = async () => {
    if (!pageEnded.value) {
        showPreloader.value = true
    }
    const eventz = await getEvents(currentPage.value)
    if (eventz['events']) {
        pageEnded.value = false
        events.value.push(...eventz.events)
        currentPage.value += 1
    } else {
        pageEnded.value = true
    }
    showPreloader.value = false
}

onMounted(async () => {
    loadMore()
})
</script>