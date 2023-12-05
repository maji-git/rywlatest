<template>
    <f7-page name="watpol">
        <f7-navbar title="วัดผล" back-link="ย้อนกลับ"></f7-navbar>

        <f7-list strong-ios dividers-ios inset-ios>
            <f7-list-input label="รหัสผ่าน" type="text" placeholder="ใส่รหัสผ่าน..." :value="passwordInput"
                @input="passwordInput = $event.target.value" clear-button></f7-list-input>
            <f7-block class="mt-2">
                <f7-segmented tag="p" strong>
                    <f7-button :active="currentServer === 0" @click="currentServer = 0">Server 1</f7-button>
                    <f7-button :active="currentServer === 1" @click="currentServer = 1">Server 2</f7-button>
                    <f7-button :active="currentServer === 2" @click="currentServer = 2">Server 3</f7-button>
                    <f7-button :active="currentServer === 3" @click="currentServer = 3">Custom</f7-button>
                </f7-segmented>

                <f7-input label="ที่อยู่เซิร์ฟเวอร์" class="animate__animated animate__fadeIn animate__faster" type="url" placeholder="ที่อยู่เซิร์ฟเวอร์" v-if="currentServer == 3"
                    :value="userServer" @input="userServer = $event.target.value" clear-button></f7-input>

                <f7-block class="mt-4" v-if="!requesting">
                    <f7-button tonal @click="loadGrades">เช็คเกรด</f7-button>
                </f7-block>
            </f7-block>
        </f7-list>

        <f7-block strong inset color="orange">
            <strong><f7-icon material="lightbulb" size="20"></f7-icon> เกี่ยวกับรหัสผ่าน</strong>
            รหัสผ่านจะเป็นวันเกิดของคุณ โดยจะอยู่ในรูปแบบ วว/ดด/ปปปป
        </f7-block>


        <f7-block strong inset color="red" v-if="errorData">
            <strong><f7-icon material="error" size="20"></f7-icon> ข้อผิดพลาด:</strong>
            {{ errorData }}
        </f7-block>

        <div class="text-align-center" v-if="!isLoaded">
            <f7-preloader />
        </div>

        <f7-block class="text-align-center" v-if="gradesData">
            <f7-gauge type="circle" :value="parseFloat(gradesData.result.fields['ผลการเรียนเฉลี่ย GPA']) / 4"
                :value-text="gradesData.result.fields['ผลการเรียนเฉลี่ย GPA']" value-text-color="#2196f3"
                border-color="#2196f3" label-text="ผลการเรียนเฉลี่ย GPA" :border-width="6" :size="350" />
        </f7-block>

        <div class="data-table" v-if="gradesData">
            <table>
                <tbody>
                    <tr>
                        <th scope="col">รหัส</th>
                        <th scope="col">ชื่อวิชา</th>
                        <th scope="col">ประเภท</th>
                        <th scope="col">หน่วยกิต</th>
                        <th scope="col">รวมหน่วย</th>
                        <th scope="col">กลางภาค</th>
                        <th scope="col">ปลายภาค</th>
                        <th scope="col">รวม</th>
                        <th scope="col">เกรด</th>
                        <th scope="col">แก้ตัว</th>
                        <th scope="col">คุณฯ</th>
                        <th scope="col">อ่าน</th>
                        <th scope="col">ครู</th>
                    </tr>
                    <tr v-for="grade in gradesData.result.grades">
                        <td>{{ grade.subjectCode }}</td>
                        <td>{{ grade.subjectName }}</td>
                        <td>{{ grade.subjectType }}</td>
                        <td>{{ grade.subjectGrid }}</td>
                        <td>{{ grade.totalUnit }}</td>
                        <td>{{ grade.midTerm }}</td>
                        <td>{{ grade.finalTerm }}</td>
                        <td>{{ grade.totalScore }}</td>
                        <td>{{ grade.grade == true ? 'ผ่าน' : (grade.grade == false ? "ไม่ผ่าน" : grade.grade) }}</td>
                        <td>{{ isNaN(grade.gradeFix) ? "-" : grade.gradeFix }}</td>
                        <td>{{ isNaN(grade.traitScore) ? "-" : grade.traitScore }}</td>
                        <td>{{ isNaN(grade.readScore) ? "-" : grade.readScore }}</td>
                        <td>{{ grade.teacherName }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <f7-list strong outline-ios dividers-ios inset-md accordion-list v-if="gradesData">
            <f7-list-item accordion-item title="ข้อมูลเกรด">
                <f7-accordion-content>
                    <f7-list>
                        <f7-list-item v-for="(value, name) in gradesData.result.fields" :title="name">{{ value
                        }}</f7-list-item>
                    </f7-list>
                </f7-accordion-content>
            </f7-list-item>
        </f7-list>

        <f7-block inset v-if="gradesData">
            <div class="grid grid-cols-1 grid-gap">
                <f7-button tonal @click="exportCSV">เปิด CSV</f7-button>
            </div>
        </f7-block>
    </f7-page>
</template>
  
<script setup>
import { ref } from "vue";
import { getTermResults } from "@/js/lib/watpol.js"
import store from '@/js/store.js';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileOpener } from "@capacitor-community/file-opener"
import Logger from "js-logger"

const gradesData = ref(null)
const passwordInput = ref()
const errorData = ref(null)
const isLoaded = ref(true)
const currentServer = ref(1)
const userServer = ref()
const requesting = ref(false)

const exportCSV = async () => {
    let result = "รหัส,ชื่อวิชา,ประเภท,หน่วยกิต,รวมหน่วย,กลางภาค,ปลายภาค,รวม,เกรด,แก้ตัว,คุณฯ,อ่าน,ครู\n"

    for (const grade of gradesData.value.result.grades) {
        for (const [key, value] of Object.entries(grade)) {
            let displayData = value
            if (key == "grade") {
                displayData = value == true ? 'ผ่าน' : (value == false ? "ไม่ผ่าน" : value)
            } else {
                if (typeof (displayData) != "string") {
                    displayData = isNaN(displayData) ? '' : displayData
                }
            }
            result += `${displayData},`
        }
        result = result.slice(0, -1)
        result += '\n'
    }

    const fpath = await Filesystem.writeFile({
        path: `ryw-grades-${new Date().getTime()}.csv`,
        data: result,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
    });

    FileOpener.open({
        filePath: fpath.uri
    })
}

const loadGrades = async () => {
    isLoaded.value = false
    requesting.value = true
    errorData.value = null
    try {
        let targetServer = ""

        if (currentServer.value != 3) {
            targetServer = store.state.watpolServers[currentServer.value]
        } else {
            targetServer = userServer.value
        }

        Logger.info("Server Target: ", targetServer)

        const data = await getTermResults(store.state.userData.studentID, passwordInput.value, targetServer)
        if (data.success) {
            gradesData.value = data
        } else {
            errorData.value = data.err
        }
    } catch (err) {
        errorData.value = err
    }

    isLoaded.value = true
    requesting.value = false
}
</script>