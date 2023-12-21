<template>
    <f7-popup id="pwa-install-popup" tablet-fullscreen>
        <f7-view>
            <f7-page>
                <div class="pwa-install-page" v-if="currentPlatform == 'Safari' && !isDesktop">
                    <div class="text-center">
                        <img src="/pwa/apple-touch-icon.png" height="110" class="app-icon">
                        <h2>อีกไม่กี่ขั้นตอน!</h2>
                        <p> เพิ่ม ล่าสุด ระยองวิทย์ ไปที่หน้าหลัก เพื่อให้เข้าถึงได้ง่ายขึ้น</p>
                        <div class="divc" v-if="inAppBrowserName == ''">กดที่ <img src="/share-ios.png" class="m-2" height="25"> แล้ว
                            “เพิ่มไปยังหน้าจอโฮม”</div>

                            <div class="divc" v-if="inAppBrowserName == 'ig'">กดที่ <img src="/share-ios.png" class="m-2" height="25"> แล้ว
                            “เปิดในเบราว์เซอร์ภายนอก”</div>
                        
                            <div class="divc" v-if="inAppBrowserName == 'line'">กดที่ <img src="/share-line.png" class="m-2" height="20"> แล้ว
                            “เปิดในเบราว์เซอร์”</div>
                    </div>
                </div>

                <div class="pwa-install-page" v-if="currentPlatform != 'Safari' && !isDesktop">
                    <div class="text-center">
                        <img src="/pwa/apple-touch-icon.png" height="110" class="app-icon">
                        <h2>ดาวน์โหลดแอพสำหรับ Android</h2>
                        <p>แอพ ล่าสุด ระยองวิทย์ สามารถดาวน์โหลดได้บน Play Store</p>

                        <a @click="openSite('https://play.google.com/store/apps/details?id=xyz.devpixels.rywlatest&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1')"><img
                                alt='ดาวน์โหลดได้จาก Google Play'
                                src='https://play.google.com/intl/en_us/badges/static/images/badges/th_badge_web_generic.png' height="80" /></a>

                                <p class="text-muted copyright-txt">Google Play และโลโก้ของ Google Play เป็นเครื่องหมายการค้าของ Google LLC.</p>
                    </div>
                </div>

                <div class="pwa-install-page" v-if="isDesktop">
                    <div class="text-center">
                        <img src="/pwa/apple-touch-icon.png" height="110" class="app-icon">
                        <h2>ยังไม่รองรับแพลตฟอร์มนี้</h2>
                        <p>ในขนาดนี้ แอพ ล่าสุด ระยองวิทย์ ยังไม่รองรับแพลตฟอร์มนี้ ต้องขออภัยด้วยนะครับ 🙏</p>
                    </div>
                </div>

                <div v-if="currentPlatform == 'Safari'">
                    <img src="/bubble-arrow.png?v=2" v-if="inAppBrowserName == '' || inAppBrowserName == 'ig'" class="install-arrow" height="50">
                    <img src="/bubble-arrow.png?v=2" v-if="inAppBrowserName == 'line'" class="install-arrow install-arrow-line" height="50">
                </div>

            </f7-page>
        </f7-view>
    </f7-popup>
</template>

<script setup>
import { Browser } from '@capacitor/browser';

const openSite = async (url) => {
  await Browser.open({ url });
}

</script>

<style scoped>
.pwa-install-page {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(/bg.png?v=2);
    background-size: cover;
}

.copyright-txt {
    font-size: 10px;
}

.app-icon {
    border-radius: 20px;
    box-shadow: 0px 4px 13.2px 0px rgba(0, 0, 0, 0.25);
}

.divc {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: whitesmoke;
    padding: 8px 32px;
    border-radius: 12px;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.077);
}

.install-arrow {
    position: fixed;
    bottom: 10px;
    left: calc(50% - 15px);
    transform: translate3d(-50%);

    animation: arrowMove 4s;
    animation-iteration-count: infinite;
}

@keyframes arrowMove {
    0% {
        bottom: 10px;
    }

    50% {
        bottom: 30px;
    }

    100% {
        bottom: 10px;
    }
}

.install-arrow-line {
    left: calc(100% - 38px) !important;
    transform: none !important;
}
</style>