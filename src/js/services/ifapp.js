import { f7 } from 'framework7-vue';
import { openSite } from "@/js/utils/opener.js"

export class IfAppConnection {
    ctx = {}
    metadata = {appName: "default"}
    sessionData = {
        appWindow: null,
        appOrigin: null
    }
    ifappCodeHandlers = {
        "link_open": (data) => {
            f7.dialog.confirm(`ต้องการเปิดลิงค์ ${data.url} หรือไม่?`, () => {
                openSite(data.url)
            })
        },
        "get_userdata": (data) => {
            f7.dialog.confirm(`แอพ ${this.metadata.appName} ต้องการเข้าถึงข้อมูลผู้ใช้ของคุณ ต้องการยืนยอมหรือไม่?`, () => {

            })
        },
    }

    constructor(ctx) {
        this.ctx = ctx
    }

    sendData(code, data) {
        this.sessionData.appWindow.postMessage({code, data}, this.sessionData.appOrigin)
    }

    async handleRequest(data, ev) {
        console.log("HLR", data)

        if (data.code == "connect_init") {
            this.metadata = data.metadata
            this.sessionData.appWindow = ev.source
            this.sessionData.appOrigin = ev.origin

            this.sendData("connect_handshake", {})
        }

        if (this.ifappCodeHandlers[data.code]) {
            this.ifappCodeHandlers[data.code](data.data, this.ctx)
        }
    }
}