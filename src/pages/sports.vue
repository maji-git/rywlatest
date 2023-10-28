<template>
    <f7-page name="about">
        <f7-navbar title="ระยองวิทย์เกมส์ 66"></f7-navbar>
        
    </f7-page>
</template>
  
<script setup>
import { Browser } from '@capacitor/browser';

const openSite = async (url) => {
    await Browser.open({ url });
}
</script>