<template>
  <f7-page name="rooms" ptr :ptr-mousewheel="true" @ptr:refresh="loadData">
    <f7-navbar title="ตารางการใช้ห้องเรียน" back-link="Back">
      <f7-nav-right>
        <f7-link class="searchbar-enable" data-searchbar=".room-searchbar" icon-ios="f7:search"
          icon-md="material:search" />
      </f7-nav-right>
      <f7-searchbar class="room-searchbar" expandable placeholder="ค้นหาห้อง..." :clear-button="true"
        @searchbar:enable="searching = true" @searchbar:disable="loadData" @search="searchRequest" />
    </f7-navbar>

    <f7-block strong inset color="orange" v-if="currentPeriod == -1">
      <strong><f7-icon material="warning" size="20"></f7-icon> เวลานอกตารางเรียน</strong>
      ข้อมูลอาจจะไม่ตรงกัน
    </f7-block>

    <f7-list>
      <f7-list-item v-for="(item, index) in availabilites" key="index" :title="index" @click="previewInfo(index)"
        :badge="isAvailable(item) ? 'ว่าง' : 'ใช้อยู่'" :badge-color="isAvailable(item) ? 'green' : 'red'">
      </f7-list-item>
    </f7-list>

    <f7-photo-browser ref="roomPreview" :photos="[`https://rywlatest.web.app/app/room-tables/${previewRoomCode}.png`]" :thumbs="[`https://rywlatest.web.app/app/room-tables/${previewRoomCode}.png`]" page-back-link-text="Back">
    </f7-photo-browser>

    <f7-sheet id="room-info" swipe-to-close swipe-to-step style="height: auto;">
      <div class="swipe-handler" @click="toggleSwipeStep"></div>

      <div class="sheet-modal-swipe-step">
        <f7-block>
          <div class="grid grid-cols-2 grid-gap">
            <div class="block mt-1">
              <p class="m-0">ห้องเรียน</p>
              <h1 class="m-0">{{ previewRoomCode }}</h1>

              <div class="display-flex mt-1">
                <f7-link color="red">
                  <f7-icon material="flag"></f7-icon>
                </f7-link>
              </div>
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

              <i class="display-block text-center text-muted mt-2">(เลื่อนลงเพื่อดูเพิ่มเติม)</i>
            </div>
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

      <f7-block class="sheet-modal-swipe-step">
        <div class="block mt-1">
          <f7-block-title>ตารางสำหรับห้องนี้</f7-block-title>

          <img class="img-field rounded" :src="`https://rywlatest.web.app/app/room-tables/${previewRoomCode}.png`" @click="$refs.roomPreview.open()">
        </div>
      </f7-block>

    </f7-sheet>

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

const toggleSwipeStep = () => {
  f7.sheet.stepToggle('#room-info')
}

const searchRequest = async (event) => {
  availabilites.value = {}
  console.log(originAData.value)

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
  availabilites.value = await getAvailabilites()
  originAData.value = availabilites.value

  if (done) {
    done()
  }
}

onMounted(() => {
  loadData()
})
</script>