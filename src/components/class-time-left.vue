<template>
    <f7-popup id="classtimeleft-modal">
        <f7-page>
            <f7-navbar title="เวลาก่อนหมดคาบ">
                <f7-nav-right>
                    <f7-link popup-close>ปิด</f7-link>
                </f7-nav-right>
            </f7-navbar>
            <div class="text-center d-flex justify-content-center flex-column align-items-center h-100">
                <h1 class="min m-0">{{ minLeft }}</h1>
                <p class="m-0 sub-t">นาที</p>
                <p>ก่อนหมดคาบ {{ currentPeriod }}</p>
            </div>
        </f7-page>
    </f7-popup>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getPeriod, timeStrToDate } from "@/js/utils/date.js"

const nextTime = ref(new Date())
const currentPeriod = ref(0)
const minLeft = ref(0)

function updateTime() {
    currentPeriod.value = getPeriod(new Date()) - 1


    if (currentPeriod.value >= 0 && store.state.periodTimes[currentPeriod.value + 1]) {
        nextTime.value = timeStrToDate(store.state.periodTimes[currentPeriod.value + 1][1], new Date())
    }

    const startTime = new Date();
    const endTime = new Date(nextTime.value);
    const difference = endTime.getTime() - startTime.getTime();
    const resultInMinutes = Math.round(difference / 60000);

    minLeft.value = resultInMinutes
}

onMounted(() => {
    setInterval(() => {
        updateTime()
    }, 400);
})
</script>

<style scoped>
.min {
    font-size: 160px;
}

.sub-t {
    font-size: 50px;
}
</style>