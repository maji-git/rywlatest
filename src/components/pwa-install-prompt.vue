<template>
    <f7-popup id="pwa-install-popup">
        <f7-view>
            <f7-page>
                <div class="pwa-install-page">
                    <div class="text-center">
                        <img src="/pwa/apple-touch-icon.png" height="110" class="app-icon">
                        <h2>อีกไม่กี่ขั้นตอน!</h2>
                        <p>เพิ่ม ล่าสุด ระยองวิทย์ ไปที่หน้าหลัก เพื่อให้เข้าถึงได้ง่ายขึ้น</p>
                        <div class="divc">กดที่ <img src="/share-ios.png" class="m-2" height="25"> แล้ว “เพิ่มไปยังหน้าจอโฮม”</div>
                    </div>
                </div>

                <img src="/bubble-arrow.png?v=2" class="install-arrow" height="50">

            </f7-page>
        </f7-view>
    </f7-popup>
</template>

<style scoped>
.pwa-install-page {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(/bg.png?v=2);
    background-size: cover;
}

.app-icon {
    border-radius: 20px;
    box-shadow: 0px 4px 13.2px 0px rgba(0, 0, 0, 0.25);
}

.divc {
    display: flex;
    justify-content: center;
    align-items: center;
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
</style>