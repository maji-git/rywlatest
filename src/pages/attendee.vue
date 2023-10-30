<template>
    <f7-page name="attendee" ptr :ptr-mousewheel="true" @ptr:refresh="loadData" @page:tabshow="loadData">
        <f7-navbar title="บันทึกการมาโรงเรียน" back-link="Back"></f7-navbar>

        <f7-block-title>การบันทึกในวันนี้</f7-block-title>
        <f7-block class="animate__animated animate__bounceIn" strong inset color="green" v-if="checkedIn">
            <strong><f7-icon material="check_circle" size="20"></f7-icon> บันทึกแล้ว</strong>
            เข้าโรงเรียนเวลา {{ attendees[0].entranceTime }}
        </f7-block>

        <f7-block strong inset color="orange" class="animate__animated animate__bounceIn" v-if="checkedIn == false && isLoaded">
            <strong><f7-icon material="error" size="20"></f7-icon> ยังไม่ได้บันทึก</strong>
        </f7-block>

        <f7-block-title>ประวัติการบันทึก</f7-block-title>
        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th class="label-cell">&nbsp;&nbsp;วัน/เดือน/ปี&nbsp;&nbsp;</th>
                        <th class="numeric-cell">เวลามา</th>
                        <th class="numeric-cell">เวลากลับ</th>
                        <th class="label-cell">หมายเหตุ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="attendee of attendees">
                        <td class="label-cell">{{ attendee.dateTxt }}</td>
                        <td class="numeric-cell">{{ attendee.entranceTime }}</td>
                        <td class="numeric-cell">{{ attendee.exitTime }}</td>
                        <td class="label-cell">{{ attendee.comment }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

    </f7-page>
</template>
  
<script setup>
import { getAttendees } from "@/js/lib/stdsession.js"
import { ref, onMounted } from "vue"

const isLoaded = ref(false)
const checkedIn = ref(false)
const attendees = ref([])

const loadData = async (done) => {
    isLoaded.value = false
    checkedIn.value = false

    const today = new Date()

    const data = (await getAttendees(today.getMonth() + 1)).reverse()

    if (data[0]) {
        if (data[0].date.getDate() == today.getDate()) {
            checkedIn.value = true
        }
    }

    attendees.value = data

    isLoaded.value = true
    if (done) {
        done()
    }
}

onMounted(() => {
    loadData()
})
</script>