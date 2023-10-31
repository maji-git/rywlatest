<template>
    <f7-page name="behaviours" ptr :ptr-mousewheel="true" @ptr:refresh="loadData" @page:tabshow="loadData">
        <f7-block class="text-align-center" v-if="!isLoggedin">
            <p>ต้องลงชื่อเข้าใช้เพื่อใช้งานฟีเจอร์นี้</p>
            <f7-button fill login-screen-open="#info-register-screen">ลงชื่อเข้าใช้</f7-button>
        </f7-block>

        <div v-if="isLoggedin">
            <div class="text-align-center">
                <h4>คะแนนพฤติกรรม</h4>
                <f7-gauge v-if="!isLoaded" type="circle" value="100" size="300" border-color="#9BA9BA" border-width="7" />
                <f7-gauge v-else type="circle" value="100" size="300"
                    :border-color="behaviourStatus == 'ไม่มีคะแนนพฤติกรรม' ? '#3CDB83' : '#FF7A00'" border-width="7"
                    :value-text="behaviourStatus == 'ไม่มีคะแนนพฤติกรรม' ? ':D' : '!'" value-font-size="100"
                    :value-text-color="behaviourStatus == 'ไม่มีคะแนนพฤติกรรม' ? '#3CDB83' : '#FF7A00'"
                    :label-text="behaviourStatus" />
            </div>

            <f7-block>
                <f7-button tonal @click="printPaper">ดาวน์โหลดใบแก้คะแนน</f7-button>
            </f7-block>

            <f7-block-title>ประวัติพฤติกรรม</f7-block-title>
            <div class="text-align-center text-muted" v-if="isLoaded && behaviours.length == 0">
                เอี่ยมอ่อง...
            </div>
            <f7-list strong inset>
                <div class="text-align-center" v-if="!isLoaded">
                    <f7-preloader />
                </div>
                <ul v-else>
                    <f7-list-item media-item link="#" v-for="b in behaviours" @click="previewInfo(b.index)"
                        :title="b.behaviour" :subtitle="`${b.date} • ${b.reporter}`" :badge="b.consequence"
                        :badge-color="b.consequence == 'ตักเตือน' ? 'orange' : 'red'"></f7-list-item>
                </ul>
            </f7-list>
        </div>

        <f7-popup id="behaviour-info">
            <f7-view>
                <f7-page>
                    <f7-navbar title="">
                        <f7-nav-right>
                            <f7-link popup-close>ปิด</f7-link>
                        </f7-nav-right>
                    </f7-navbar>
                    <f7-block>
                        <div class="block">
                            <img v-if="previewData.evidence" class="img-field rounded" :src="previewData.evidence">
                            <f7-chip :text="previewData.consequence"
                                :color="previewData.consequence == 'ตักเตือน' ? 'orange' : 'red'"></f7-chip>
                            <h1>{{ previewData.behaviour }}</h1>
                        </div>
                    </f7-block>

                    <f7-block inset>
                        <f7-block-title>หมายเหตุ</f7-block-title>
                        <f7-block strong>
                            {{ previewData.comment ?? "-" }}
                        </f7-block>
                    </f7-block>

                    <f7-block inset>
                        <f7-list strong outline-ios dividers-ios accordion-list>
                            <f7-list-item accordion-item title="ข้อมูลเพิ่มเติม" class="accordion-item-expanded">
                                <f7-accordion>
                                    <f7-accordion-item :opened="true">
                                        <f7-accordion-content>
                                            <f7-list>
                                                <f7-list-item title="ว/ด/ป">{{ previewData.date }}</f7-list-item>
                                                <f7-list-item title="ผู้รายงาน">{{ previewData.reporter }}</f7-list-item>
                                            </f7-list>
                                        </f7-accordion-content>
                                    </f7-accordion-item>
                                </f7-accordion>
                            </f7-list-item>
                        </f7-list>
                    </f7-block>

                    <f7-block inset>
                        <div class="grid grid-cols-2 grid-gap">
                            <f7-button tonal v-if="previewData.evidence" @click="saveImage">บันทึกรูปภาพ</f7-button>
                            <f7-button tonal @click="printPaper">พิมพ์ใบแก้คะแนน</f7-button>
                        </div>
                    </f7-block>
                </f7-page>
            </f7-view>
        </f7-popup>
    </f7-page>
</template>
  
<script setup>
import { ref } from "vue";
import { getStdFixPDF, getBehaviourData } from "@/js/lib/stdsession.js"
import { resolveImg } from "@/js/utils/img.js"
import writeBlob from "capacitor-blob-writer";
import { Directory } from "@capacitor/filesystem";
import { FileOpener } from "@capacitor-community/file-opener"
import { Media } from "@capacitor-community/media"
import { f7 } from 'framework7-vue';
import store from '@/js/store.js';

const behaviourStatus = ref("-")
const behaviours = ref([])
const previewData = ref({})
const isLoaded = ref(false)
const isLoggedin = ref(false)

const saveImage = async () => {
    const loadDialog = f7.dialog.progress("กำลังดาวน์โหลด...")
    loadDialog.open()

    try {
        const imgURL = await resolveImg(previewData.value.evidence)
        const albums = await Media.getAlbums()
        const targetAlbum = albums.albums.find((e) => e.name == "Download").identifier

        const res = await Media.savePhoto({
            path: imgURL,
            albumIdentifier: targetAlbum
        })

        FileOpener.open({
            filePath: res.filePath
        })
    } catch (err) {
        f7.dialog.alert(`ข้อผิดผลาด: ${err}`).open()
    }

    loadDialog.close()
}

const previewInfo = (index) => {
    previewData.value = behaviours.value.find((v) => v.index == index)
    f7.popup.open("#behaviour-info")
}

const loadData = async (done) => {
    isLoaded.value = false
    if (store.state.userData) {
        isLoggedin.value = true
    } else {
        isLoggedin.value = false
    }
    const data = await getBehaviourData()
    behaviours.value = data.history
    behaviourStatus.value = data.status
    isLoaded.value = true
    if (done) {
        done()
    }
}

const printPaper = async () => {
    const data = await getStdFixPDF()
    if (data) {
        const blo = await writeBlob({
            path: "ryw-stdfix.pdf",
            directory: Directory.Cache,
            blob: data
        })

        FileOpener.open({
            filePath: blo
        })
    }
}
</script>