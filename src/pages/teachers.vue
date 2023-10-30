<template>
    <f7-page name="about" ptr :ptr-mousewheel="true" @ptr:refresh="listTeachers">
        <f7-navbar title="ข้อมูลคุณครู" back-link="Back">
            <f7-nav-right>
                <f7-link class="searchbar-enable" data-searchbar=".event-searchbar" icon-ios="f7:search"
                    icon-md="material:search" />
            </f7-nav-right>
            <f7-searchbar class="event-searchbar" expandable placeholder="ค้นหาครู..." :clear-button="true"
                @searchbar:enable="searching = true" @searchbar:disable="endSearch" @search="searchRequest" />
        </f7-navbar>

        <div class="text-align-center mt-3" v-if="!isLoaded">
            <f7-preloader />
        </div>

        <f7-list>
            <f7-list-item swipeout v-for="t in teachers" @click="previewInfo(t)" :title="t.name"
                :badge="t.room != '-' ? t.room : undefined">
                <f7-swipeout-actions right>
                    <f7-swipeout-button color="green" v-if="t.tel != '-'"
                        @click="callTeacher(t.tel)">โทร</f7-swipeout-button>
                    <f7-swipeout-button @click="createContact(t.name, t.tel)" color="orange"
                        v-if="t.tel != '-'">บันทึก</f7-swipeout-button>
                </f7-swipeout-actions>
            </f7-list-item>
        </f7-list>

        <f7-popup id="teacher-info">
            <f7-view>
                <f7-page>
                    <f7-navbar title="">
                        <f7-nav-right>
                            <f7-link popup-close>ปิด</f7-link>
                        </f7-nav-right>
                    </f7-navbar>
                    <f7-block>
                        <div class="block">
                            <h1 class="text-center">{{ previewData.name }}</h1>
                        </div>
                    </f7-block>

                    <f7-block inset>
                        <f7-block-title>หมายเหตุ</f7-block-title>
                        <f7-block strong>
                            <p v-if="previewData.room">ครูประจำชั้นห้องที่ {{ previewData.room }}</p>
                        </f7-block>
                    </f7-block>

                    <f7-block inset>
                        <div class="grid grid-cols-2 grid-gap">
                            <f7-button tonal color="green" class="block-action-btn" @click="callTeacher(previewData.tel)">
                                <f7-icon material="call"></f7-icon>
                                <p>โทร</p>
                            </f7-button>
                            <f7-button tonal color="orange" class="block-action-btn"
                                @click="createContact(previewData.name, previewData.tel)">
                                <f7-icon material="import_contacts"></f7-icon>
                                <p>เพื่มไปยังรายชื่อ</p>
                            </f7-button>
                        </div>
                    </f7-block>
                </f7-page>
            </f7-view>
        </f7-popup>

    </f7-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getTeachersTel } from "@/js/lib/stdsession.js"
import store from '@/js/store.js';
import { Contacts, PhoneType } from '@capacitor-community/contacts';
import { f7 } from "framework7-vue";

const teachers = ref([])
const teachersData = ref([])
const isLoaded = ref(false)
const searching = ref(false)
const previewData = ref({})

const callTeacher = (tel) => {
    window.open(`tel:${tel}`)
}

const previewInfo = (data) => {
    previewData.value = data
    f7.popup.open("#teacher-info")
}

const searchRequest = async(event) => {
    teachers.value = teachersData.value.filter((e) => e.name.toLowerCase().includes(event.target.value.toLowerCase()))
}

const endSearch = () => {
    searching.value = false
    teachers.value = teachersData.value
}

const createContact = async (teachName, tel) => {
    const res = await Contacts.createContact({
        contact: {
            name: {
                given: teachName,
            },
            phones: [
                {
                    type: PhoneType.Work,
                    label: 'work',
                    number: tel,
                },
            ],
        },
    });

    if (res.contactId) {
        f7.dialog.alert("เพิ่มไปยังรายชื่อโทรแล้ว")
    }
}

const listTeachers = async (done) => {
    isLoaded.value = false
    teachersData.value = (await getTeachersTel())
    teachers.value = teachersData.value
    store.state.teacherData = teachers.value
    isLoaded.value = true
    if (done) {
        done()
    }
}

onMounted(() => {
    if (!store.state.teacherData) {
        listTeachers()
    } else {
        isLoaded.value = false
        setTimeout(() => {
            teachersData.value = store.state.teacherData
            teachers.value = teachersData.value
            isLoaded.value = true
        }, 300);
    }
})
</script>