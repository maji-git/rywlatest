<template>
    <f7-page name="news" infinite :infinite-distance="80" :infinite-preloader="showPreloader" @infinite="loadMoreSearches" @page:tabshow="onTabShow">
        <f7-navbar title="ปฏิทินโรงเรียน">
            <f7-nav-right>
                <f7-link class="searchbar-enable" data-searchbar=".event-searchbar" icon-ios="f7:search"
                    icon-md="material:search" />
            </f7-nav-right>
            <f7-searchbar class="event-searchbar" expandable placeholder="ค้นหากิจกรรม..." :clear-button="true"
                @searchbar:enable="searching = true" @searchbar:disable="resetSearch" @search="searchRequest" />
        </f7-navbar>

        <f7-progressbar class="event-progressbar" :class="{ 'event-progress-loadin': loading }" infinite />

        <div class="container-fluid">
            <div class="row">
                <div class="calendar-view col-md-5" :class="{ 'd-none': searching }">
                    <div v-if="calendarView" class="d-flex ps-3 pe-3 align-items-center">
                        <input id="event-calendar-date-select" type="date" class="d-none" readonly="readonly" />

                        <h2>{{ currentMonth }} {{ currentYr }}</h2>
                        <div class="flex-grow-1"></div>
                        <f7-button @click="calendarView.prevMonth()" class="me-2" tonal><f7-icon material="navigate_before"
                                size="20"></f7-icon></f7-button>
                        <f7-button @click="calendarView.nextMonth()" tonal><f7-icon material="navigate_next"
                                size="20"></f7-icon></f7-button>
                    </div>
                    <div id="event-calendar" :class="{ 'calendar-loading': loading }"></div>
                </div>
                <div class="col-md-5">
                    <div class="text-align-center" v-if="searching && events.length < 1 && !showPreloader">
                        <p>ไม่มีกิจกรรมที่ตรงกับที่คุณค้นหา</p>
                    </div>
                    <div class="timeline timeline-in" v-if="viewEvents.length != 0">
                        <div class="timeline-item" v-for="event in viewEvents">
                            <div class="timeline-item-date">{{ event.start_date_details.day }} <small>{{
                                monthsName[event.start_date_details.month - 1] }}</small></div>
                            <div class="timeline-item-divider"></div>
                            <div class="timeline-item-content" @click="previewEvent(event)">
                                <div class="timeline-item-inner">
                                    <p class="m-0">{{ decodeHTMLEntities(event.title) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center timeline-in" v-else>
                        <img src="@/assets/doddles/idk.png?v=2" height="200" class="doddle text-muted">
                    </div>
                </div>
            </div>
        </div>

        <f7-sheet id="event-info" backdrop swipe-to-close swipe-to-step style="height: auto;" v-if="previewEventInfo">

            <div class="sheet-modal-swipe-step">
                <f7-block>
                    <div class="block">
                        <h1 class="m-0">{{ decodeHTMLEntities(previewEventInfo.title) }}</h1>
                        <p>
                            <span>{{ previewEventInfo.start_date_details.day }} {{
                                monthsName[previewEventInfo.start_date_details.month - 1] }} {{
        previewEventInfo.start_date_details.year }}</span>

                            <span v-if="previewEventInfo.start_date_details.day != previewEventInfo.end_date_details.day">
                                <span class="ms-2 me-2">-</span>

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

                <br />
            </div>
        </f7-sheet>
    </f7-page>
</template>
  
<script setup>
import { onMounted, ref } from "vue";
import { getEvents, getByMonthYear } from "@/js/lib/tribecalendar.js"
import { decodeHTMLEntities } from "@/js/utils/text.js"
import { dateDiffInDays } from "@/js/utils/date.js"
import { Browser } from '@capacitor/browser';
import { f7 } from "framework7-vue";
import store from '@/js/store.js';

const previewEventInfo = ref(null)
const datepicker = ref()

const openSite = async (url) => {
    await Browser.open({ url });
}

const previewEvent = (event) => {
    previewEventInfo.value = event
    f7.sheet.open("#event-info")
}

const addToCalendar = () => {

}

const openSelectMenu = () => {
    datepicker.value.open()
}

const getColorOfStr = (str) => {
    return store.state.eventColors[Math.abs(Math.round(Math.sin(str.charCodeAt(str.length - 1)) * 9))]
}

const events = ref([])

const showPreloader = ref(false)
const loading = ref(false)
const monthsName = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",];
const currentPage = ref(1)
const pageEnded = ref(false)
const searchQuery = ref("")
const searching = ref(false)

const currentMonth = ref(0)
const currentYr = ref(0)

const calendarView = ref()
const viewEvents = ref([])

const firstPageLoad = ref(true)

const searchRequest = async (event) => {
    currentPage.value = 1
    viewEvents.value = []
    pageEnded.value = false
    searchQuery.value = event.target.value

    loadMoreSearches()
}

const resetSearch = () => {
    searching.value = false
    currentPage.value = 1
    viewEvents.value = []
    pageEnded.value = false
    searchQuery.value = undefined

    loadMoreSearches()
}

const constructDateFromDetails = (details) => {
    return new Date(details.year, details.month - 1, details.day)
}

const addToEvents = (evs) => {
    for (const e of evs) {
        // Filter out events with same ID
        if (events.value.find((a) => a.id == e.id)) {
            continue
        }

        const renderDate = constructDateFromDetails(e.start_date_details)

        events.value.push({
            ...e,
            renderDate: renderDate
        })

        const dateDifCount = dateDiffInDays(constructDateFromDetails(e.start_date_details), constructDateFromDetails(e.end_date_details))

        for (let i = 1; i <= dateDifCount; i++) {
            const td = constructDateFromDetails(e.start_date_details)
            td.setDate(td.getDate() + i)

            events.value.push({
                ...e,
                renderDate: td
            })
        }
    }

    calendarView.value.params.events = []

    for (const event of events.value) {
        calendarView.value.params.events.push({
            date: event.renderDate,
            hours: 12,
            minutes: 30,
            title: event.title,
            color: getColorOfStr(event.title),
            data: event
        })
    }

    calendarView.value.update()
}

const loadMoreSearches = async () => {
    if (!searching.value) {
        return
    }
    if (pageEnded.value) {
        return
    }
    if (!pageEnded.value) {
        showPreloader.value = true
    }
    const eventz = await getEvents(currentPage.value, searchQuery.value)

    if (eventz['events']) {
        pageEnded.value = false

        addToEvents(eventz.events)

        viewEvents.value.push(...eventz.events)

        currentPage.value += 1
    } else {
        pageEnded.value = true
    }
    showPreloader.value = false
}

const loadCalendarEvents = async (e) => {
    loading.value = true
    const eventz = await getByMonthYear(e.currentMonth + 1, e.currentYear)

    if (eventz['events']) {
        addToEvents(eventz.events)
    }

    loading.value = false
}

const onCalendarChange = (e) => {
    currentMonth.value = monthsName[e.currentMonth]
    currentYr.value = e.currentYear

    loadCalendarEvents(e)
}

const viewDayEvents = (date) => {
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    viewEvents.value = events.value.filter((e) => (e.renderDate.getDate() == day && e.renderDate.getMonth() == month && e.renderDate.getFullYear() == year))
}

onMounted(async () => {
    const calendar = f7.calendar.create({
        containerEl: '#event-calendar',
        toolbar: false,
        value: [new Date()],
        dayNamesShort: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
        events: [{
            date: new Date(2023, 11, 21),
            hours: 12,
            minutes: 30,
            color: '#2196f3',
        }]
    })

    calendarView.value = calendar

    calendar.on("monthYearChangeEnd", onCalendarChange)
    onCalendarChange(calendar)

    const yearSelectArray = []

    for (let yr = 2023; yr < new Date().getFullYear() + 2; yr++) {
        yearSelectArray.push(yr)
    }

    datepicker.value = f7.picker.create({
        inputEl: '#event-calendar-date-select',
        rotateEffect: true,
        cols: [
            {
                textAlign: 'center',
                values: monthsName,
            },
            {
                textAlign: 'center',
                values: yearSelectArray,
            },
        ],
    })

    calendar.on("change", (et) => viewDayEvents(et.value[0]))
})

const onTabShow = () => {
    if (firstPageLoad.value) {
        firstPageLoad.value = false
        firstLoad()
    }
}

const firstLoad = () => {
    viewDayEvents(new Date())
}
</script>

<style>
.calendar-day-event {
    animation: dayEventAppears 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.timeline-color {
    width: 5px;
    height: 100%;
    background-color: red;
}

@keyframes dayEventAppears {
    0% {
        transform: scale(0);
    }

    100% {
        transform: scale(1);
    }
}
</style>

<style scoped>
.event-progressbar {
    opacity: 0;
    transition: opacity 0.6s;
}

.event-progress-loadin {
    opacity: 1;
}

.timeline-in {
    animation: timelinePop 0.24s;
}

.calendar-loading {
    pointer-events: none;
}

@keyframes timelinePop {
    0% {
        transform: translateY(10px);
        opacity: 0;
    }
}
</style>