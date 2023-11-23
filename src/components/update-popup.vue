<template>
    <f7-sheet id="update-sheet" push swipe-to-close style="height: auto;">
        <!-- Scrollable sheet content -->
        <f7-page-content>
            <f7-block>
                <div class="text-center">
                    <h1>อัปเดตใหม่พร้อมแล้ว!!</h1>
                    <p>อัปเดตใหม่สามารถติดตั้งได้แล้ว</p>
                </div>

                <f7-button sheet-close @click="openStore" tonal>อัปเดตเลย!</f7-button>
                <f7-button class="mt-2" sheet-close>ยังดีกว่า...</f7-button>
            </f7-block>
        </f7-page-content>
    </f7-sheet>
</template>

<script setup>
import { AppUpdate } from '@capawesome/capacitor-app-update';

const openStore = () => {
    AppUpdate.openAppStore()
}
</script>