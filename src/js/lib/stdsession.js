import { CapacitorHttp } from '@capacitor/core';
import store from '@/js/store.js';
import { f7 } from 'framework7-vue';
import html2pdf from 'html2pdf.js'
import { resolveImg } from '../utils/img';
import { Preferences } from '@capacitor/preferences';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

const url = "https://rayongwit.ac.th/student/index.php"
const stdPrintUrl = "https://rayongwit.ac.th/student/print.php"
const stdHistoryUrl = "https://rayongwit.ac.th/student/stdhistory.php"
const teacherTelUrl = "https://rayongwit.ac.th/student/telteacher.php"

export async function reauthenticate() {
    if (store.state.authData.username == "" || store.state.authData.password == "") {
        return
    }

    await CapacitorHttp.post({
        url: url,
        data: `username=${store.state.authData.username}&password=${store.state.authData.password}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    if (store.state.userData == null) {
        store.state.userData = {}
    }

    store.state.userData['sessionID'] = document.cookie + "; path=/"

    return store.state.userData['sessionID']
}

export async function getStdFixPDF() {
    const sessionID = await reauthenticate()

    if (sessionID) {
        const prog = f7.dialog.progress("กำลังประมวลผล...", 1)
        prog.setText("กำลังโหลดหน้า stdPrint...")
        prog.open()
        prog.setProgress(0)

        const stdPrint = await CapacitorHttp.get({
            url: stdPrintUrl,
            headers: {
                "Cookie": sessionID
            }
        });

        const tempElement = document.createElement("div")
        tempElement.innerHTML = `${stdPrint.data.replace("../", "https://rayongwit.ac.th/")}<style>* {font-family: Arial !important;}</style>`

        let i = 0
        let queryAll = tempElement.querySelectorAll("img")

        prog.setText("กำลังโหลดรูปภาพ...")

        for (const imgs of queryAll) {
            i++
            prog.setProgress((i / queryAll.length) * 100)

            const targetURL = imgs.src.replace("http://192.168.1.170:5173/", "https://rayongwit.ac.th/").replace("../", "https://rayongwit.ac.th/")
            imgs.setAttribute("onerror", "this.src=&quot;https://rayongwit.ac.th/ticket/pic/no-pic.JPG&quot;;")

            const resolved = await resolveImg(targetURL)
            imgs.src = resolved
        }

        // Format Text
        for (const p of tempElement.querySelectorAll("p")) {
            p.style.fontSize = "10.72px"
        }

        for (const p of tempElement.querySelectorAll("strong")) {
            p.style.fontSize = "10.72px"
        }

        for (const p of tempElement.querySelectorAll("td")) {
            p.style.fontSize = "14px"
        }

        tempElement.querySelector(".navbar").remove()
        tempElement.querySelector("button[onclick='window.print()']").remove()

        console.log(tempElement.innerHTML)

        const opt = {
            margin: 0.3,
            filename: "stdfix.pdf",
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 2, useCORS: true, dpi: 300 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
        };

        prog.setProgress(100, 100)

        prog.setText("กำลังส่งออกเป็น PDF... ใกล้เสร็จแล้ว :D")

        const data = await html2pdf().set(opt).from(tempElement).toPdf().output('blob')

        prog.close()

        return data
    }
}

export async function getBehaviourData() {
    const sessionID = await reauthenticate()

    if (sessionID) {
        const stdPrint = await CapacitorHttp.get({
            url: stdHistoryUrl,
            headers: {
                "Cookie": sessionID
            }
        });
        const parser = new DOMParser()
        const dom = parser.parseFromString(stdPrint.data, "text/html")
        const history = []

        //let dom = document
        for (const trs of dom.querySelectorAll("tbody tr")) {
            const tds = trs.querySelectorAll("td")
            if (tds.length > 4) {
                history.push({
                    index: parseInt(tds[0]?.textContent),
                    behaviour: tds[1]?.textContent,
                    consequence: tds[2]?.textContent,
                    date: tds[3]?.textContent,
                    reporter: tds[4]?.textContent,
                    evidence: tds[5]?.querySelector("a")?.getAttribute("href")?.replace("../", "https://rayongwit.ac.th/"),
                    comment: tds[6]?.textContent,
                })
            }
        }

        return {
            status: dom.querySelector("h5:nth-child(3) strong p:nth-child(3)")?.textContent,
            history: history
        }
    }
}

export async function getTeachersTel() {
    const sessionID = await reauthenticate()

    const stdPrint = await CapacitorHttp.get({
        url: teacherTelUrl,
        headers: {
            "Cookie": sessionID
        }
    });
    const parser = new DOMParser()
    const dom = parser.parseFromString(stdPrint.data, "text/html")

    const teachers = []

    for (const t of dom.querySelectorAll("tbody tr")) {
        const tds = t.querySelectorAll("td")
        teachers.push({
            name: tds[0].innerText,
            room: tds[1].innerText,
            tel: tds[2].innerText,
        })
    }

    return teachers
}

export async function getInfo() {
    const sessionID = await reauthenticate()

    if (sessionID) {
        const stdPrint = await CapacitorHttp.get({
            url: stdPrintUrl,
            headers: {
                "Cookie": sessionID
            }
        });
        const parser = new DOMParser()
        const dom = parser.parseFromString(stdPrint.data, "text/html")

        let realname = ""
        let surname = ""
        let mathayom = ""
        let room = ""
        let studentNumber = ""

        for (const par of dom.querySelectorAll("p")) {
            console.log(par.innerText)

            if (par.innerText?.includes("ชื่อผู้บำเพ็ญประโยชน์")) {
                const splitd = par.textContent.trim().split("  ")
                let namesplit = splitd[1].split("  ")
                realname = namesplit[0]
                surname = namesplit[1]
                let roomtsplit = splitd[2].split("    ")[1].split("/")
                mathayom = parseInt(roomtsplit[0])
                room = parseInt(roomtsplit[1])

                let numSplit = splitd[3].split(" ").filter((e) => e != '')
                studentNumber = parseInt(numSplit[1])
            }
        }

        const tds = dom.querySelectorAll("td")
        const potentials = []
        for (const par of tds) {
            if (par.innerText.startsWith("(")) {
                potentials.push(par.textContent.replace("(", "").replace(")", ""))
            }
        }

        const teachers = []

        if (tds.length > 2) {
            teachers.push(potentials[0])
            teachers.push(potentials[1])
        } else {
            teachers.push(potentials[0])
        }

        let targetPlan = {}

        if (mathayom > 3) {
            // ม.ปลาย
            targetPlan = store.state.classPlans.second
        } else {
            // ม.ต้น
            targetPlan = store.state.classPlans.first
        }

        let classPlan = "[ ไม่มีข้อมูล ]"

        for (const [key, value] of Object.entries(targetPlan)) {
            if (value.includes(room)) {
                classPlan = key
            }
        }

        const result = {
            sessionID: sessionID,
            headshot: "https://rayongwit.ac.th/ticket/pic/" + store.state.authData.username + "s.JPG",
            firstname: realname,
            surname: surname,
            mathayom: mathayom,
            room: room,
            no: studentNumber,
            studentID: store.state.authData.username,
            classPlan: classPlan,
            classTeachers: teachers,
            nationalID: store.state.authData.password
        }

        return result
    }

    return null
}

export function setToState(username, password) {
    store.state.authData.username = username
    store.state.authData.password = password
}

export function clearAuthState() {
    store.state.authData.username = ""
    store.state.authData.password = ""
}

export async function saveToPreferences() {
    await SecureStoragePlugin.set({
        key: "loginData",
        value: JSON.stringify(store.state.authData)
    })
}

export async function loadFromPreferences() {
    const loginDB = await SecureStoragePlugin.get({
        key: "loginData"
    })

    if (loginDB.value) {
        const loginData = JSON.parse(loginDB.value)
        store.state.authData = loginData
        store.state.userData = await getInfo()
    }
}