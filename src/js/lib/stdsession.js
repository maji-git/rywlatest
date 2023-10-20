import { CapacitorHttp } from '@capacitor/core';
import store from '@/js/store.js';

const url = "https://rayongwit.ac.th/student/index.php"
const stdPrintUrl = "https://rayongwit.ac.th/student/print.php"

export async function getInfo(username, password) {
    const res = await CapacitorHttp.post({
        url: url,
        data: `username=${username}&password=${password}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    let sessionID = document.cookie + "; path=/"

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
            console.log(splitd)
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

    console.log(classPlan)

    const result = {
        sessionID: sessionID,
        headshot: "https://rayongwit.ac.th/ticket/pic/" + username + "s.JPG",
        firstname: realname,
        surname: surname,
        mathayom: mathayom,
        room: room,
        no: studentNumber,
        studentID: username,
        classPlan: classPlan,
        classTeachers: teachers,
        nationalID: password
    }

    return result
}