<template>
    <f7-page name="การตั้งค่า" @page:beforein="prefStateLoad">
        <f7-navbar title="การตั้งค่า" back-link="ย้อนกลับ"></f7-navbar>

        <f7-block>
            <f7-list accordion-list>
                <f7-block strong inset v-if="!isNative">
                    <f7-icon material="info" size="20"></f7-icon> ฟีเจอร์การแจ้งเตือนยังไม่พร้อมใช้งานในเวอร์ชั่นเว็บ
                </f7-block>

                <f7-list-item title="รับการแจ้งเตือน" v-if="isNative">
                    <template #after>
                        <f7-toggle class="no-fastclick" v-model:checked="notifyUserToggle" @click="onNotifyToggled" />
                    </template>
                </f7-list-item>

                <f7-list-item title="ซ่อนข้อมูลส่วนตัว">
                    <template #after>
                        <f7-toggle class="no-fastclick" v-model:checked="incognitoToggle" @click="onIncognitoToggled" />
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
                                    <f7-list-button tonal popup-open="#notify-popup">เปิด Notifications
                                        Prompt</f7-list-button>
                                    <f7-list-button tonal popup-open="#changelogs-popup">เปิด Chagelogs</f7-list-button>
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
import { ref } from "vue";
import { enableNotify, disableNotify } from '@/js/services/notifications.js';
import store from '@/js/store.js';

const notifyUserToggle = ref(false)
const incognitoToggle = ref(false)

const rerunApp = () => {
    location.reload()
}

const onNotifyToggled = async () => {
    const val = !notifyUserToggle.value

    if (val) {
        console.log("Requesting Notify Enable...")
        const res = await enableNotify()
    } else {
        disableNotify()
    }
}

const onIncognitoToggled = async () => {
    const val = !incognitoToggle.value

    store.state.incognitoEnabled = val

    if (val) {
        store.state.displayUserData = {
            sessionID: "<>",
            headshot: "/external-assets/pfp/incognito.png",
            firstname: "ไม่ระบุชื่อ",
            surname: "",
            mathayom: 1,
            room: 0,
            no: 0,
            studentID: 0,
            classPlan: "ปกติ",
            classTeachers: ["ครู"],
            nationalID: 0
        }
    } else {
        store.state.displayUserData = store.state.userData
    }
}

const prefStateLoad = () => {
    if (store.state.notify.enabled) {
        notifyUserToggle.value = true
    }

    if (store.state.incognitoEnabled) {
        incognitoToggle.value = true
    }
}
</script>