<template>
  <f7-page name="rooms">
    <f7-navbar title="ห้อง" back-link="Back"></f7-navbar>

    <f7-list>
      <f7-list-item v-for="(item, index) in availabilites" key="index" :title="index"
        badge="ใช้อยู่">
      </f7-list-item>
    </f7-list>

  </f7-page>
</template>

<script setup>
import { getAvailabilites } from "@/js/lib/rooms.js"
import { onMounted, ref } from "vue"

const availabilites = ref({})

const loadData = async () => {
  availabilites.value = await getAvailabilites()
}

onMounted(() => {
  loadData()
})
</script>