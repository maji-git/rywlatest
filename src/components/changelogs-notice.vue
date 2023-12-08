<template>
    <f7-popup v-model:opened="popupOpened" id="changelogs-popup" @popup:open="onChangelogOpen" @popup:close="onChangelogClose">
        <f7-page>
            <f7-navbar title="อัปเดตใหม่ๆ">
                <f7-nav-right>
                    <f7-link popup-close><f7-icon material="close" size="20"></f7-icon></f7-link>
                </f7-nav-right>
            </f7-navbar>

            <img src="https://rywlatest.web.app/app/update-splash.png" class="img-field">

            <f7-block v-html="changelogHTML">
                
            </f7-block>
        </f7-page>
    </f7-popup>
</template>

<script setup>
import { parse } from "marked"
import { ref } from "vue";
import { AppUpdate } from '@capawesome/capacitor-app-update'
import { Preferences } from "@capacitor/preferences"

const changelogHTML = ref("")

const onChangelogOpen = async () => {
    const res = await fetch("https://rywlatest.web.app/app/changelogs.md")
    const clmd = await res.text()

    changelogHTML.value = parse(clmd)
}

const onChangelogClose = async () => {
    Preferences.set({ key: "changelogLatest", value: __APP_VERSION__ })
}
</script>