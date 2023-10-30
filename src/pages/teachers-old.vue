<template>
    <f7-page name="about">
        <f7-navbar title="ข้อมูลคุณครู" back-link="Back">
        </f7-navbar>

        <f7-block>
            <f7-list v-for="subject in subjects">
                <f7-block-title>{{ subject.subjectName }}</f7-block-title>
                <f7-list-item swipeout v-for="t in subject.teachers" :title="t.name" :badge="t.role"
                    :badge-color="store.state.teacherRoleColor[t.role] ?? 'green'">
                    <f7-swipeout-actions right>
                        <f7-swipeout-button color="green">โทร</f7-swipeout-button>
                        <f7-swipeout-button color="orange">บันทึก</f7-swipeout-button>
                    </f7-swipeout-actions>
                </f7-list-item>
            </f7-list>
        </f7-block>
    </f7-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAllTeachers } from "@/js/lib/teacherinfo.js"
import store from '@/js/store.js';

const subjects = ref([])

const listTeachers = async () => {
    const teacherData = await getAllTeachers()
    subjects.value = Object.freeze(teacherData)
    store.state.teacherData = subjects.value
}

onMounted(() => {
    if (!store.state.teacherData) {
        listTeachers()
    } else {
        subjects.value = store.state.teacherData
    }
})
</script>