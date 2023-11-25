<template>
    <f7-page name="การตั้งค่า" @page:beforein="prefStateLoad">
        <f7-navbar title="การตั้งค่า" back-link="Back"></f7-navbar>

        <f7-block>
            <f7-list accordion-list>
                <f7-list-item title="รับการแจ้งเตือน">
                    <template #after>
                        <f7-toggle class="no-fastclick" v-model:checked="notifyUserToggle" @click="onNotifyToggled" />
                    </template>
                </f7-list-item>

                <f7-list-item accordion-item title="สำหรับผู้พัฒนา">
                    <f7-accordion>
                        <f7-accordion-item>
                            <f7-accordion-content>
                                <f7-list>
                                    <f7-list-button tonal @click="rerunApp">เริ่มแอพใหม่</f7-list-button>
                                    <f7-list-button tonal popup-open="#landing-popup">เปิด Landing</f7-list-button>
                                    <f7-list-button tonal sheet-open="#update-sheet">เปิด Update Prompt</f7-list-button>
                                    <f7-list-button tonal popup-open="#notify-popup">เปิด Notifications Prompt</f7-list-button>
                                </f7-list>
                            </f7-accordion-content>
                        </f7-accordion-item>
                    </f7-accordion>
                </f7-list-item>

            </f7-list>
        </f7-block>
    </f7-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { enableNotify, disableNotify } from '@/js/services/notifications.js';
import store from '@/js/store.js';

import { f7 } from "framework7-vue"

const notifyUserToggle = ref(false)

const rerunApp = () => {
    location.reload()
}

const onNotifyToggled = async () => {
    const val = !notifyUserToggle.value

    if (val) {
        console.log("Requesting")
        const res = await enableNotify()
        console.log(res)
    } else {
        disableNotify()
    }
}

const prefStateLoad = () => {
    console.log(store.state.notify.enabled)
    if (store.state.notify.enabled) {
        notifyUserToggle.value = true
    }
}
</script>