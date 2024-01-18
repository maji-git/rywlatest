<template>
    <f7-popup v-model:opened="ifAppLaunched">
        <f7-page>
            <f7-button popup-close class="ifapp-close-btn"><f7-icon material="close" size="20"></f7-icon></f7-button>
            <iframe ref="iframeEl" class="ifapp-view" :src="ifAppSrc" @load="onIfAppLoaded" frameborder="0"></iframe>
        </f7-page>
    </f7-popup>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useEmitter } from '@/js/composables/events.js'
import { IfAppConnection } from "@/js/services/ifapp.js"

const emitter = useEmitter()
const ifAppLaunched = ref(false)
const ifAppSrc = ref("")
const iframeEl = ref()
let ifConnection;

const onIfAppLoaded = () => {
    console.log("ifApp loaded")
}

onMounted(() => {
    emitter.on("ifAppLaunch", (d) => {
        console.log(d)
        ifAppSrc.value = d
        ifAppLaunched.value = true

        ifConnection = new IfAppConnection({origin: ifAppSrc, iframeEl: iframeEl.value})
    })

    window.addEventListener(
        "message",
        (event) => {
  
            const chk1 = new URL(event.origin)
            const chk2 = new URL(ifAppSrc.value)
            if (chk2.hostname !== chk1.hostname) return;

            ifConnection.handleRequest(event.data, event)
        },
        false,
    );
})
</script>

<style scoped>
.ifapp-view {
    width: 100%;
    height: 100%;
}

.ifapp-close-btn {
    position: absolute;
    right: 10px;
    top: 10px;
}
</style>