<template>
    <f7-page name="behaviours" ptr :ptr-mousewheel="true" @ptr:refresh="loadData">
        <div class="text-align-center">
            <h4>คะแนนพฤติกรรม</h4>
            <f7-gauge type="circle" value="100" size="300" border-color="#2196f3" border-width="5" value-text="0"
                value-font-size="100" value-text-color="#2196f3" label-text="ไม่มีคะแนนพฤติกรรม" />
        </div>

        <f7-block>
            <f7-button tonal @click="printPaper">ดาวน์โหลดใบแก้คะแนน</f7-button>
        </f7-block>

        <f7-block-title>ประวัติพฤติกรรม</f7-block-title>
        <f7-list strong inset>
            <ul>
                <f7-list-item media-item link="#" popup-open="#behaviour-info"
                    title="2.1 แต่งกายผิดระเบียบ แต่งกายไม่สุภาพเรียบร้อย" subtitle="07/06/2023 • กัลยวรรธน์ สัตย์อุดม"
                    badge="ตักเตือน" badge-color="orange"></f7-list-item>
                <f7-list-item media-item link="#" title="2.2 ทรงผมผิดระเบียบ" subtitle="06/06/2023 • กัลยวรรธน์ สัตย์อุดม"
                    badge="ตัดคะแนน" badge-color="red"></f7-list-item>
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
                            <img class="img-field rounded"
                                src="https://rayongwit.ac.th/ticket/uploads/1686096490%E0%B8%81%E0%B8%B1%E0%B8%A5%E0%B8%A2%E0%B8%A7%E0%B8%A3%E0%B8%A3%E0%B8%98%E0%B8%99%E0%B9%8C.jpg">
                            <f7-chip text="ตักเตือน" color="orange"></f7-chip>
                            <h1>2.1 แต่งกายผิดระเบียบ แต่งกายไม่สุภาพเรียบร้อย</h1>
                        </div>
                    </f7-block>

                    <f7-block inset>
                        <f7-block-title>หมายเหตุ</f7-block-title>
                        <f7-block strong>
                            ถุงเท้าลูกฟูก
                        </f7-block>
                    </f7-block>

                    <f7-block inset>
                        <f7-list strong outline-ios dividers-ios accordion-list>
                            <f7-list-item accordion-item title="ข้อมูลเพิ่มเติม" class="accordion-item-expanded">
                                <f7-accordion-content>
                                    <f7-list>
                                        <f7-list-item title="ว/ด/ป">07/06/2023</f7-list-item>
                                        <f7-list-item title="ผู้รายงาน">กัลยวรรธน์ สัตย์อุดม</f7-list-item>
                                    </f7-list>
                                </f7-accordion-content>
                            </f7-list-item>
                        </f7-list>
                    </f7-block>

                    <f7-block inset>
                        <div class="grid grid-cols-2 grid-gap">
                            <f7-button tonal>บันทึกรูปภาพ</f7-button>
                            <f7-button tonal>พิมพ์ใบแก้คะแนน</f7-button>
                        </div>
                    </f7-block>
                </f7-page>
            </f7-view>
        </f7-popup>
    </f7-page>
</template>
  
<script setup>
import { onMounted, ref } from "vue";
import { getStdFixPDF } from "@/js/lib/stdsession.js"
import { Browser } from '@capacitor/browser';
import writeBlob from "capacitor-blob-writer";
import { Directory } from "@capacitor/filesystem";
import { FileOpener } from "@capacitor-community/file-opener"

const openSite = async (url) => {
    await Browser.open({ url });
}

const annoucements = ref({})
const isLoaded = ref(false)

const loadData = async (done) => {
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

onMounted(async () => {
    loadData()
})
</script>