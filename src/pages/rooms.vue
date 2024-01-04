<template>
  <f7-page name="rooms" ptr :ptr-mousewheel="true" @ptr:refresh="loadData">
    <f7-navbar title="ตารางการใช้ห้องเรียน" back-link="ย้อนกลับ">
      <f7-nav-right>
        <f7-link class="searchbar-enable" data-searchbar=".room-searchbar" icon-ios="f7:search"
          icon-md="material:search" />
      </f7-nav-right>
      <f7-searchbar class="room-searchbar" expandable placeholder="ค้นหาห้อง..." :clear-button="true"
        @searchbar:enable="searching = true" @searchbar:disable="loadData" @search="searchRequest" />
    </f7-navbar>

    <f7-block outline-ios strong inset color="orange" v-if="currentPeriod == -1">
      <strong><f7-icon material="warning" size="20"></f7-icon> เวลานอกตารางเรียน</strong>
      ข้อมูลอาจจะไม่ตรงกัน
    </f7-block>

    <f7-block>
      <f7-chip text="กรอง" id="filters-chip" color="blue" outline @click="openFilters">
        <template #media>
          <chip-icon>
            <f7-icon material="filter_alt" class="color-blue" size="14"></f7-icon>
          </chip-icon>
        </template>
      </f7-chip>

      <f7-chip text="ห้องว่าง" color="green" class="animate__animated animate__bounceIn" deleteable
        @delete="removeFilter('free')" v-if="filters.includes('free')">
        <template #media>
          <chip-icon>
            <f7-icon material="check" class="color-green" size="14"></f7-icon>
          </chip-icon>
        </template>
      </f7-chip>

      <f7-chip text="ห้องใช้อยู่" color="red" class="animate__animated animate__bounceIn" deleteable
        @delete="removeFilter('busy')" v-if="filters.includes('busy')">
        <template #media>
          <chip-icon>
            <f7-icon material="close" class="color-red" size="14"></f7-icon>
          </chip-icon>
        </template>
      </f7-chip>
    </f7-block>

    <f7-list class="list-fadein">
      <f7-list-item v-for="(item, index) in availabilites" key="index" :title="index" @click="previewInfo(index)"
        :badge="isAvailable(item) ? 'ว่าง' : 'ใช้อยู่'" :badge-color="isAvailable(item) ? 'green' : 'red'" link="#">
      </f7-list-item>
    </f7-list>

    <f7-photo-browser ref="roomPreview" :photos="[`https://rywlatest.web.app/app/room-tables/${previewRoomCode}.png`]"
      :thumbs="[`https://rywlatest.web.app/app/room-tables/${previewRoomCode}.png`]" page-back-link-text="Back">
    </f7-photo-browser>

    <f7-sheet id="room-info" swipe-to-close swipe-to-step backdrop style="height: auto;">
      <div class="swipe-handler" @click="toggleSwipeStep"></div>

      <div class="sheet-modal-swipe-step">
        <f7-block>
          <div class="grid grid-cols-2 grid-gap">
            <div class="block mt-1">
              <p class="m-0">ห้องเรียน</p>
              <h1 class="m-0">{{ previewRoomCode }}</h1>

              <!--
              <div class="display-flex mt-1">
                <f7-link color="orange" class="me3">
                  <f7-icon material="star"></f7-icon>
                </f7-link>
                <f7-link color="red">
                  <f7-icon material="flag"></f7-icon>
                </f7-link>
              </div>
              -->
            </div>
            <div>
              <f7-block v-if="previewIsAvailable" strong inset color="green" class="m-0 block-action-btn">
                <f7-icon material="check"></f7-icon>
                <p>ห้องว่าง</p>
              </f7-block>

              <f7-block v-if="!previewIsAvailable" strong inset color="red" class="m-0 block-action-btn">
                <f7-icon material="close"></f7-icon>
                <p>ใช้อยู่</p>
              </f7-block>

              <i class="display-block text-center text-muted mt-2">(เลื่อนขี้นเพื่อดูเพิ่มเติม)</i>
            </div>
          </div>

          <div class="block mt-1">
            <f7-block-title>ตารางสำหรับห้องนี้</f7-block-title>

            <img class="img-field rounded" :src="`https://rywlatest.web.app/app/room-tables/${previewRoomCode}.png`"
              @click="$refs.roomPreview.open()">
          </div>
        </f7-block>
      </div>

      <f7-block class="sheet-modal-swipe-step" v-if="previewData[todayIndex]">
        <div class="block mt-1">
          <f7-block-title>เกี่ยวกับวันนี้</f7-block-title>

          <div class="grid grid-cols-2 grid-gap">
            <f7-block strong class="rounded m-0">
              <f7-block-title>ห้องว่าง</f7-block-title>
              <h2>{{ previewData[todayIndex].filter((e) => e == 0).length }} คาบ</h2>
            </f7-block>

            <f7-block strong class="rounded m-0">
              <f7-block-title>ห้องไม่ว่าง</f7-block-title>
              <h2>{{ previewData[todayIndex].filter((e) => e == 1).length }} คาบ</h2>
            </f7-block>
          </div>

        </div>
      </f7-block>

    </f7-sheet>

    <f7-popover id="filter-options">
      <f7-list>
        <f7-list-item popover-close title="ห้องว่าง" @click="addFilter(`free`)">
          <template #media>
            <f7-icon material="check" size="20"></f7-icon>
          </template>
        </f7-list-item>
        <f7-list-item popover-close title="ห้องใช้อยู่" @click="addFilter(`busy`)">
          <template #media>
            <f7-icon material="close" size="20"></f7-icon>
          </template>
        </f7-list-item>
      </f7-list>
    </f7-popover>

  </f7-page>
</template>

<script setup>
import { getAvailabilites } from "@/js/lib/rooms.js"
import { getPeriod } from "@/js/utils/date.js"
import { onMounted, ref } from "vue"
import { f7 } from "framework7-vue";

const originAData = ref({})
const availabilites = ref({})
const currentPeriod = ref(-1)
const previewData = ref([])
const previewIsAvailable = ref(false)
const previewRoomCode = ref("")
const today = ref(new Date())
const todayIndex = ref(0)

const searching = ref(false)
const filters = ref([])

const dataCache = ref()

const openFilters = () => {
  f7.popover.open("#filter-options", `#filters-chip`)
}

const addFilter = (filterName) => {
  f7.popover.close("#filter-options")

  if (!filters.value.includes(filterName)) {
    filters.value.push(filterName)
    loadData()
  }
}

const removeFilter = (filterName) => {
  if (filters.value.includes(filterName)) {
    filters.value = filters.value.filter(e => e !== filterName)
    loadData()
  }
}

const toggleSwipeStep = () => {
  f7.sheet.stepToggle('#room-info')
}

const searchRequest = async (event) => {
  availabilites.value = {}

  for (const [key, value] of Object.entries(originAData.value)) {
    if (key.search(event.target.value) != -1) {
      availabilites.value[key] = value
    }
  }
}

const isAvailable = (item) => {
  if (!item) {
    return false
  }
  if (!item[todayIndex.value]) {
    return true
  }

  const d = item[todayIndex.value][currentPeriod.value]

  if (d && d == 1) {
    return false
  } else {
    return true
  }
}

const previewInfo = (index) => {
  previewRoomCode.value = index
  previewData.value = availabilites.value[index]
  previewIsAvailable.value = isAvailable(previewData.value)
  f7.sheet.open("#room-info")
}

const loadData = async (done) => {
  today.value = new Date()
  todayIndex.value = today.value.getDay() - 1

  currentPeriod.value = getPeriod(new Date())
  let data;

  if (dataCache.value) {
    data = dataCache.value
  } else {
    data = await getAvailabilites()
    dataCache.value = data
  }
  
  let processed = {}

  if (filters.value.length > 0) {
    for (const [key, value] of Object.entries(data)) {
      if (isAvailable(value)) {
        if (filters.value.includes("free")) {
          processed[key] = value
        }
      } else {
        if (filters.value.includes("busy")) {
          processed[key] = value
        }
      }
    }
  } else {
    processed = data
  }

  availabilites.value = processed
  originAData.value = availabilites.value

  if (done) {
    done()
  }
}

onMounted(() => {
  loadData()
})
</script>