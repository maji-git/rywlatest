<template>
    <f7-page name="quota" ptr :ptr-mousewheel="true" @ptr:refresh="loadData" @page:tabshow="loadData">
        <f7-navbar title="โควตา" back-link="Back"></f7-navbar>

        <f7-block strong inset color="red" v-if="false">
            <strong><f7-icon material="warning" size="20"></f7-icon> ชื่อไม่ตรงกัน</strong>
            ชื่อในระบบโควตากับระบบนักเรียนไม่ตรงกัน แนะนำให้ตรวจสอบชื่ออีกครั้ง
        </f7-block>


        <f7-block-title>เวลารับสมัคร</f7-block-title>

        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th class="label-cell">ประเภท</th>
                        <th class="label-cell">เริ่มรับสมัคร</th>
                        <th class="label-cell">สิ้นสุดการรับสมัคร</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(value, name) in registerTimetable">
                        <td class="label-cell">{{ name }}</td>
                        <td class="label-cell">{{ formatDate(value.start) }}</td>
                        <td class="label-cell">{{ formatDate(value.end) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

    </f7-page>
</template>

<script setup>
import { getTimetable } from "@/js/lib/quotasession.js"
import { onMounted, ref } from "vue";
import { formatDate } from '@/js/utils/date';

const registerTimetable = ref({})

const loadData = async (done) => {
    const d = await getTimetable()
    console.log(d)
    registerTimetable.value = d

    if (done) {
        done()
    }
}

onMounted(() => {
    loadData()
})
</script>