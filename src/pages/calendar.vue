<template>
    <f7-page name="news" infinite :infinite-distance="80" :infinite-preloader="showPreloader" @infinite="loadMore">
        <f7-navbar title="ปฏิทินโรงเรียน">
            <f7-nav-right>
                <f7-link class="searchbar-enable" data-searchbar=".event-searchbar" icon-ios="f7:search"
                    icon-md="material:search" />
            </f7-nav-right>
            <f7-searchbar class="event-searchbar" expandable placeholder="ค้นหากิจกรรม..." :clear-button="true"
                @searchbar:enable="searching = true" @searchbar:disable="resetSearch" @search="searchRequest" />
        </f7-navbar>

        <div class="text-align-center" v-if="searching && events.length < 1 && !showPreloader">
            <p>หาไม่เจอ ._.</p>
        </div>

        <div class="timeline">
            <div class="timeline-item" v-for="event in events">
                <div class="timeline-item-date">{{ event.start_date_details.day }} <small>{{
                    monthsName[event.start_date_details.month - 1] }}</small></div>
                <div class="timeline-item-divider"></div>
                <div class="timeline-item-content" @click="previewEvent(event)">
                    <div class="timeline-item-inner">{{ decodeHTMLEntities(event.title) }}</div>
                </div>
            </div>
        </div>

        <f7-sheet id="event-info" backdrop swipe-to-close swipe-to-step style="height: auto;" v-if="previewEventInfo">

            <div class="sheet-modal-swipe-step">
                <f7-block>
                    <div class="block">
                        <h1 class="m-0">{{ previewEventInfo.title }}</h1>
                        <p>
                            <span>{{ previewEventInfo.start_date_details.day }} {{
                                monthsName[previewEventInfo.start_date_details.month - 1] }} {{
        previewEventInfo.start_date_details.year }}</span>

                            <span v-if="previewEventInfo.start_date_details.day != previewEventInfo.end_date_details.day">
                                <span class="ml-2 mr-2">-</span>

                                <span>{{ previewEventInfo.end_date_details.day }} {{
                                    monthsName[previewEventInfo.end_date_details.month - 1] }} {{
        previewEventInfo.end_date_details.year }}</span>
                            </span>
                        </p>
                    </div>
                </f7-block>
                <f7-block class="mb-3" inset strong outline-ios v-html="previewEventInfo.description"></f7-block>

                <!--
                <div class="grid grid-cols-2 grid-gap block mt-0">

                    <f7-button tonal color="red" class="block-action-btn" @click="addToCalendar">
                        <f7-icon material="event"></f7-icon>
                        <p>เพิ่มกิจกรรมบนปฏิทิน</p>
                    </f7-button>

                    <f7-button tonal color="blue" class="block-action-btn" @click="openSite(previewEventInfo.url)">
                        <f7-icon material="web"></f7-icon>
                        <p>เปิดหน้าเว็บ</p>
                    </f7-button>
                </div>
                -->

                <br/>
            </div>
        </f7-sheet>
    </f7-page>
</template>
  
<script setup>
import { onMounted, ref } from "vue";
import { getEvents } from "@/js/lib/tribecalendar.js"
import { decodeHTMLEntities } from "@/js/utils/text.js"
import { Browser } from '@capacitor/browser';
import { f7 } from "framework7-vue";

const previewEventInfo = ref(null)

const openSite = async (url) => {
    await Browser.open({ url });
}

const previewEvent = (event) => {
    previewEventInfo.value = event
    f7.sheet.open("#event-info")
}

const addToCalendar = () => {

}

const events = ref([])
const showPreloader = ref(false)
const monthsName = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",];
const currentPage = ref(1)
const pageEnded = ref(false)
const searchQuery = ref("")
const searching = ref(false)

const searchRequest = async (event) => {
    currentPage.value = 1
    events.value = []
    searchQuery.value = event.target.value

    loadMore()
}

const resetSearch = () => {
    searching.value = false
    currentPage.value = 1
    events.value = []
    searchQuery.value = undefined

    loadMore()
}

const loadMore = async () => {
    if (!pageEnded.value) {
        showPreloader.value = true
    }
    const eventz = await getEvents(currentPage.value, searchQuery.value)
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
    await loadMore()
    await loadMore()
})
</script>