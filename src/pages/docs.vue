<template>
  <f7-page name="settings">
    <f7-navbar title="เอกสาร"></f7-navbar>

    <f7-block class="grid grid-cols-2 grid-gap">
      <div v-for="doc in docs" @click="openDoc(doc)" @taphold="holdOptions(doc)" class="doc-item" :title="doc.title">
        <img :src="`https://rywlatest.web.app/app/doc-thumbnails/${doc.thumbnail}`" class="img-field rounded shadow img-uncopyable">
        <p>{{ doc.title }}</p>
      </div>
    </f7-block>

    <f7-popover id="docs-options">
      <f7-list>
        <f7-block-title class="p-4 mb-0 doc-title-collapse">{{ holdedDoc['title'] ?? "" }}</f7-block-title>

        <f7-list-item @click="openDoc(holdedDoc)" link="#" popover-close title="เปิด">
          <template #media>
            <f7-icon ios="f7:link" md="material:open_in_new" size="20"></f7-icon>
          </template>
        </f7-list-item>
        <f7-list-item @click="shareDoc(holdedDoc)" link="#" popover-close title="แชร์">
          <template #media>
            <f7-icon ios="material:ios_share" md="material:share" size="20"></f7-icon>
          </template>
        </f7-list-item>
      </f7-list>
    </f7-popover>
  </f7-page>
</template>

<script setup>
import { getDocs } from "@/js/lib/docs.js"
import { onMounted, ref } from "vue"
import { downloadFileBlob } from '@/js/utils/downloader.js'
import { openBlob } from "@/js/utils/opener.js"
import { FileOpener } from "@capacitor-community/file-opener"
import { f7 } from "framework7-vue"
import { Browser } from "@capacitor/browser"
import { Share } from '@capacitor/share'
import { Haptics } from "@capacitor/haptics"

const docs = ref([])
const holdedDoc = ref({})

const openDoc = async (doc) => {
  f7.popover.close("#docs-options")

  if (doc.isPDF) {
    f7.preloader.show()
    const data = await downloadFileBlob(doc.source)

    openBlob(data, `${doc.title}.pdf`)

    f7.preloader.hide()
  } else {
    Browser.open({
      url: doc.source
    })
  }
}

const shareDoc = async (doc) => {
  f7.popover.close("#docs-options")

  if (window.isNative) {
    await Share.share({
      url: doc.source
    })
  } else {
    navigator.share({
      title: "่แชร์ลิงค์เอกสาร",
      text: doc.title,
      url: doc.source,
    })
  }
}

const holdOptions = (doc) => {
  Haptics.vibrate({ duration: 40 })
  holdedDoc.value = doc
  f7.popover.open("#docs-options", `.doc-item[title="${doc.title}"]`)
}

onMounted(async () => {
  docs.value = await getDocs()
})
</script>