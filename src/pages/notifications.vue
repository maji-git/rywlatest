<template>
  <f7-page name="notifications">
    <f7-navbar title="การแจ้งเตือน" back-link="Back"></f7-navbar>

    <div class="text-muted text-center" v-if="notifications.length == 0">
      <p>ยังไม่มีการแจ้งเตือน...</p>
    </div>

    <f7-block strong inset v-for="n in notifications">
      <h3><f7-icon material="feed" size="20"></f7-icon> {{ n.title }}</h3>
      <p>{{ n.body }}</p>
    </f7-block>
  </f7-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import store from '@/js/store.js';
import { getNotifications } from "@/js/services/notifications.js"
import { f7 } from 'framework7-vue';

const notifications = ref([])

onMounted(() => {
  store.state.newNotify = false
  notifications.value = getNotifications()
  console.log(notifications.value)
})
</script>