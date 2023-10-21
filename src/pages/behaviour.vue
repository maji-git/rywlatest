<template>
    <f7-page name="behaviours" ptr :ptr-mousewheel="true" @ptr:refresh="loadData" @page:tabshow="loadData">
        <div class="text-align-center">
            <h4>คะแนนพฤติกรรม</h4>
            <f7-gauge type="circle" value="100" size="300" :border-color="behaviourStatus == 'ไม่มีคะแนนพฤติกรรม' ? '#3CDB83' : '#FF7A00'" border-width="7" :value-text="behaviourStatus == 'ไม่มีคะแนนพฤติกรรม' ? ':D' : '!'"
                value-font-size="100" :value-text-color="behaviourStatus == 'ไม่มีคะแนนพฤติกรรม' ? '#3CDB83' : '#FF7A00'" :label-text="behaviourStatus" />
        </div>

        <f7-block>
            <f7-button tonal @click="printPaper">ดาวน์โหลดใบแก้คะแนน</f7-button>
        </f7-block>

        <f7-block-title>ประวัติพฤติกรรม</f7-block-title>
        <f7-list strong inset>
            <ul>
                <f7-list-item media-item link="#" v-for="b in behaviours" @click="previewInfo(b.index)"
                    :title="b.behaviour" :subtitle="`${b.date} • ${b.reporter}`"
                    :badge="b.consequence" :badge-color="b.consequence == 'ตักเตือน' ? 'orange' : 'red'"></f7-list-item>
            </ul>
        </f7-list>

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
                            <img v-if="previewData.evidence" class="img-field rounded"
                                :src="previewData.evidence">
                            <f7-chip :text="previewData.consequence" :color="previewData.consequence == 'ตักเตือน' ? 'orange' : 'red'"></f7-chip>
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
                                <f7-accordion-content>
                                    <f7-list>
                                        <f7-list-item title="ว/ด/ป">{{ previewData.consequence }}</f7-list-item>
                                        <f7-list-item title="ผู้รายงาน">{{ previewData.reporter }}</f7-list-item>
                                    </f7-list>
                                </f7-accordion-content>
                            </f7-list-item>
                        </f7-list>
                    </f7-block>

                    <f7-block inset>
                        <div class="grid grid-cols-2 grid-gap">
                            <f7-button tonal>บันทึกรูปภาพ</f7-button>
                            <f7-button tonal @click="printPaper">พิมพ์ใบแก้คะแนน</f7-button>
                        </div>
                    </f7-block>
                </f7-page>
            </f7-view>
        </f7-popup>
    </f7-page>
</template>
  
<script setup>
import { onMounted, ref } from "vue";
import { getStdFixPDF, getBehaviourData } from "@/js/lib/stdsession.js"
import { Browser } from '@capacitor/browser';
import writeBlob from "capacitor-blob-writer";
import { Directory } from "@capacitor/filesystem";
import { FileOpener } from "@capacitor-community/file-opener"
import { f7 } from 'framework7-vue';

const behaviourStatus = ref("-")
const behaviours = ref([])
const previewData = ref({})

const previewInfo = (index) => {
    previewData.value = behaviours.value.find((v) => v.index == index)
    f7.popup.open("#behaviour-info")
}

const loadData = async (done) => {
    const data = await getBehaviourData()
    behaviours.value = data.history
    behaviourStatus.value = data.status
    if (done) {
        done()
    }
}

const printPaper = async () => {
    const data = await getStdFixPDF()
    if (data) {
        console.log(data)

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