<template>
    <f7-popup id="notify-popup" class="landing-page">
        <f7-block class="text-align-center landing-container">
            <div class="landing-img">
                <p style="font-size: 30vw;" class="m-0">🔔</p>
            </div>
            <div class="landing-content">
                <h1>ต้องการรับการแจ้งเตือนไหม?</h1>
                <p>ไม่พลาดข่าวประชาสัมพันธ์จากโรงเรียน และอื่นๆ</p>
            </div>
        </f7-block>

        <div class="landing-actions">
            <f7-button class="w-100 mb-2" @click="requestNotify" fill>รับการแจ้งเตือน</f7-button>
            <f7-button popup-close class="w-100">ยังไม่ดีกว่า...</f7-button>
        </div>
    </f7-popup>
</template>


<script setup>
import { enableNotify } from '@/js/services/notifications.js';
import { f7 } from "framework7-vue"

const requestNotify = async () => {
    await enableNotify()
    f7.popup.close("#notify-popup")
}
</script>