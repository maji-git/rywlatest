<template>
    <f7-popup id="landing-popup" class="popup-ignore-back">
        <f7-view>
            <f7-page>
                <f7-tabs animated>
                    <f7-tab id="landing-tab-1" class="landing-page" tab-active>
                        <f7-block class="text-align-center landing-container">
                            <div class="landing-img">
                                <img src="@/assets/landing/landing-head.svg" class="img-field">
                            </div>
                            <div class="landing-content">
                                <h1 class="m-0">สวัสดีฮะ!</h1>
                                <p>มาเริ่มกันเลยดีกว่า</p>
                            </div>
                        </f7-block>

                        <div class="landing-actions">
                            <f7-button tab-link="#landing-tab-2" class="w-100 mb-2" fill>ไปต่อ</f7-button>
                            <p class="text-center text-muted">
                                <f7-link href="/about/">เกี่ยวกับแอพนี้</f7-link>
                                •
                                <f7-link href="#"
                                    @click="openSite('https://rywlatest.web.app/legal/privacy')">นโยบายความเป็นส่วนตัว</f7-link>
                            </p>
                        </div>
                    </f7-tab>

                    <f7-tab id="landing-tab-2" class="landing-page">
                        <f7-block class="text-align-center landing-container">
                            <div class="landing-img">
                                <img src="@/assets/landing/landing-notice.svg" class="img-field">
                            </div>
                            <div class="landing-content">
                                <h1>ก่อนที่จะไปต่อ...</h1>
                                <p class="m-0">แอพนี้เป็นแอพข่าวสารและข้อมูลต่างๆ เกี่ยวกับโรงเรียนระยองวิทยาคม
                                    สร้างขึ้นมาเพื่ออำนวยความสะดวกเพื่อเพื่อนๆ ทุกคนในระยองวิทย์</p>
                                <p class="m-0 mt-2">แอพนี้ไม่มีการเข้าถึงข้อมูลใดๆ ในระบบ Admin ทั้งสิ้น, Source code
                                    ของแอพนี้สามารถหาได้บน Github</p>
                                <p class="m-0 mt-2">แอพนี้ไม่ได้ถูกสร้างขึ้นโดยบุคลากรในโรงเรียนเลย ฝืมือนักเรียนล้วนๆ :p
                                </p>
                            </div>
                        </f7-block>

                        <div class="landing-actions">
                            <f7-button tab-link="#landing-tab-3" class="w-100 mb-2" fill>รับทราบ</f7-button>
                            <f7-button tab-link="#landing-tab-1" class="w-100">กลับไป</f7-button>
                        </div>
                    </f7-tab>

                    <f7-tab id="landing-tab-3" class="landing-page">
                        <f7-block class="text-align-center landing-container">
                            <div class="landing-img">
                                <img src="@/assets/landing/landing-user.png" class="img-field img-shadow-sm">
                            </div>
                            <div class="landing-content">
                                <h1>ต้องการลงชื่อเข้าใช้ไหม?</h1>
                                <p>ลงชื่อเข้าใช้เพื่อใช้แอพนี้ดูคะแนนพฤติกรรม ผลการเรียน และอื่นๆ</p>
                            </div>
                        </f7-block>

                        <div class="landing-actions">
                            <f7-button @click="openLogin" tab-link="#landing-tab-empty" class="w-100 mb-2"
                                fill>ลงชื่อเข้าใช้</f7-button>
                            <f7-button popup-close tab-link="#landing-tab-1" @click="landingSetDone" class="w-100">ใช้แอพโดยไม่ลงชื่อเข้าใช้</f7-button>
                            <f7-button tab-link="#landing-tab-2" class="w-100">กลับไป</f7-button>
                        </div>
                    </f7-tab>

                    <f7-tab id="landing-tab-empty" class="landing-page">
                    </f7-tab>
                </f7-tabs>
            </f7-page>
        </f7-view>
    </f7-popup>

    <f7-popup id="landing-welcome-popup">
        <f7-view>
            <f7-page>
                <f7-tabs animated>
                    <f7-tab id="landing-welcome-tab-1" class="landing-page" tab-active>
                        <f7-block class="text-align-center landing-container" v-if="userData">
                            <div class="landing-img">
                                <p style="font-size: 30vw;" class="m-0">👋</p>
                            </div>
                            <div class="landing-content">
                                <h1>ยินดีต้อนรับฮะ!<br>คุณ{{ userData.firstname }} {{ userData.surname }}</h1>
                                <p>ยินดีต้อนรับเข้าสู่แอพ ล่าสุด ระยองวิทย์!</p>
                            </div>
                        </f7-block>

                        <div class="landing-actions">
                            <f7-button tab-link="#landing-welcome-preload" @click="startReload" class="w-100 mb-2"
                                fill>มาเริ่มกันเลย!</f7-button>
                        </div>
                    </f7-tab>

                    <f7-tab id="landing-welcome-preload" class="landing-page" tab-active>
                        <f7-preloader />
                        <i class="mt-2">รอสักครู่...</i>
                    </f7-tab>
                </f7-tabs>
            </f7-page>
        </f7-view>
    </f7-popup>
</template>

<script setup>
import { onMounted, ref } from "vue";
import store from '@/js/store.js';
import { f7 } from "framework7-vue"
import { Preferences } from "@capacitor/preferences"
import { Browser } from '@capacitor/browser';

const userData = ref(null)

const openSite = async (url) => {
    await Browser.open({ url });
}

const landingSetDone = async () => {
    await Preferences.set({ key: "landingDone", value: "1" })
}

const openLogin = async () => {
    const ls = f7.loginScreen.open("#info-register-screen")

    ls.once('close', () => {
        if (store.state.userData && store.state.userData["firstname"] != "") {
            userData.value = store.state.userData
            f7.popup.open("#landing-welcome-popup")

            landingSetDone()
        }
    })

    setTimeout(() => {
        f7.popup.close("#landing-popup", false)
    }, 250);
}

const startReload = () => {
    setTimeout(() => {
        window.location.reload()
    }, 2000);
}

onMounted(() => {
})
</script>