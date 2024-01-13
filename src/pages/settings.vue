<template>
  <f7-page name="settings">
    <f7-navbar title="เกี่ยวกับฉัน" back-link="ย้อนกลับ"></f7-navbar>

    <br>
    <div class="text-align-center" v-if="userData != null">
      <swiper-container ref="swipePfp" :effect="'cards'" :grabCursor="true" events-prefix="swiper-"
        class="pictures-swipe">
        <swiper-slide source="default"><img :src="`${userData.headshot}`" height="200"></swiper-slide>

        <swiper-slide v-for="dpfp in store.state.defaultPfps" :source="dpfp"><img :src="dpfp" height="200"></swiper-slide>

        <!--<swiper-slide v-for="dpfp in extraPfps" extra-section="external" :source="dpfp.path"><img :src="dpfp.src" height="200">
          <button class="pfp-delete"> <f7-icon ios="f7:minus" md="material:remove" size="15" color="white"></f7-icon>
          </button>
        </swiper-slide>-->

        <swiper-slide extra-section="emoji" class="flex-center-in rounded emoji-field-container"
          :style="{ 'background': emojiFieldBg }"><input type="text" class="emoji-field" v-model="emojiField"
            @input="emojiFieldChange" @change="emojiFieldChange">
          <img src="@/assets/doddles/pfpEmojiGuide.png" class="emoji-guide doddle" height="80" alt="">
        </swiper-slide>

        <!--<swiper-slide add-pfp="ye" class="add-pfp rounded" @click="addPfpRequest"><f7-icon ios="f7:plus_circle_fill" md="material:add_circle"
            size="60"></f7-icon></swiper-slide>-->
      </swiper-container>

      <h1 class="mt-5">{{ userData.firstname }} {{ userData.surname }}</h1>
      <p>ห้อง {{ userData.mathayom }}/{{ userData.room }}</p>
    </div>

    <f7-list strong outline-ios dividers-ios inset-md accordion-list v-if="userData != null">
      <f7-list-item accordion-item title="ข้อมูลนักเรียน">
        <f7-accordion-content>
          <f7-list>
            <f7-list-item title="ชื่อ นามสกุล">{{ userData.firstname }} {{ userData.surname }}</f7-list-item>
            <f7-list-item title="มัธยมศึกษาปีที่">{{ userData.mathayom }}</f7-list-item>
            <f7-list-item title="ห้อง">{{ userData.room }}</f7-list-item>
            <f7-list-item title="เลขที่">{{ userData.no }}</f7-list-item>
            <f7-list-item title="แผนการเรียน">
              <div class="display-flex align-items-center">
                <img v-if="store.state.classPlansLogos.includes(userData.classPlan)"
                  :src="`plan-icons/${userData.classPlan}.png`" class="me2" height="40">

                {{ userData.classPlan }}
              </div>
            </f7-list-item>
            <f7-list-item title="รหัสนักเรียน">{{ userData.studentID }}</f7-list-item>
            <f7-list-item title="บัตรประชาชน">{{ userData.nationalID }}</f7-list-item>
            <f7-list-item title="ครูที่ปรึกษา">
              <ul>
                <li v-for="teacher in userData.classTeachers">{{ teacher }}</li>
              </ul>
            </f7-list-item>
          </f7-list>
        </f7-accordion-content>
      </f7-list-item>
    </f7-list>

    <f7-block class="text-align-center">
      <p v-if="userData == null">ทำการกรอกข้อมูลพื้นฐานเพื่อใช้งานระบบได้มากขึ้น</p>
      <f7-button fill login-screen-open="#info-register-screen"
        v-text="userData == null ? 'กรอกข้อมูล' : 'แก้ไขข้อมูล'"></f7-button>
      <f7-list>
        <f7-list-button link="/prefs/" fill>การตั้งค่า</f7-list-button>
        <f7-list-button link="/about/" fill>เกี่ยวกับแอพนี้</f7-list-button>
        <f7-list-button fill v-if="userData != null" color="red" @click="clearUserdata">ลงชื่อออก</f7-list-button>
        <f7-list-button fill @click="clearAllData" color="red">ล้างข้อมูลออกทั้งหมด</f7-list-button>
      </f7-list>
    </f7-block>
  </f7-page>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { clearAuthState, saveToPreferences } from "@/js/lib/stdsession.js"
import { pickMedia } from "@/js/utils/files.js"
import { adjustBrightness } from '@/js/utils/color';
import store from '@/js/store.js';
import { useStore, f7 } from "framework7-vue"
import { Preferences } from "@capacitor/preferences";
const userData = useStore(store, "displayUserData")
import Logger from "js-logger"
import { generatePalette } from "emoji-palette";
import { compress, decompress } from "@/js/utils/compression.js"
import { readdir, readFile } from 'fs-web';

const swipePfp = ref(null)
const extraPfps = ref([])
const emojiField = ref("😉")
const emojiFieldBg = ref("var(--f7-md-primary-container)")

const clearAllData = () => {
  f7.dialog.confirm("คุณต้องการลบข้อมูลทั้งหมดหรือไม่? (จะทำการรีเซ็ตทั้งแอพ)", async () => {
    f7.dialog.close()

    Logger.info("Clearing user data...")

    const allKeys = await Preferences.keys()

    for (const k of allKeys.keys) {
      await Preferences.remove({ key: k })
    }

    await Preferences.remove({ key: "landingDone" })
    await Preferences.remove({ key: "changelogLatest" })
    await Preferences.remove({ key: "notifyPrompted" })
    await Preferences.remove({ key: "changelogLatest" })
    await Preferences.remove({ key: "landingDone" })
    await Preferences.remove({ key: "notifyData" })

    clearAuthState()
    await saveToPreferences()

    window.location.reload()
  })
}

const clearUserdata = () => {
  f7.dialog.confirm("คุณต้องการที่จะลงชื่อออกหรือไม่?", async () => {
    f7.dialog.close()
    store.state.userData = null
    store.state.displayUserData = null

    clearAuthState()
    await saveToPreferences()

    window.location.reload()
  })
}

const emojiFieldChange = () => {
  if (emojiField.value.length == 0) {
    return
  }
  const palette = generatePalette(emojiField.value)
  const c1 = adjustBrightness(palette[0], 80)
  const c2 = adjustBrightness(palette[1], 120)

  store.state.extraUserData.preferredPfpType = "emoji"
  store.state.extraUserData.preferredPfp = emojiField.value
  store.state.extraUserData.emojiPfpCache = emojiField.value
  store.state.extraUserData.preferredPfpExtra['start'] = c1
  store.state.extraUserData.preferredPfpExtra['end'] = c2

  emojiFieldAdaptColor()
}

const emojiFieldAdaptColor = () => {
  const palette = generatePalette(emojiField.value)
  const c1 = adjustBrightness(palette[0], 50)
  const c2 = adjustBrightness(palette[1], 100)

  const procBg = `linear-gradient(180deg, ${c1} 0%, ${c2}) 100%`

  emojiFieldBg.value = procBg
}

const pfpRequestChange = (i) => {
  const activeIndex = swipePfp.value.querySelectorAll("swiper-slide")[swipePfp.value.swiper.activeIndex]
  const targetPfpSource = activeIndex?.getAttribute("source")

  if (targetPfpSource) {
    store.state.extraUserData.preferredPfp = targetPfpSource
    store.state.extraUserData.preferredPfpType = "image"
    store.state.extraUserData.preferredPfpExtra = {}
  }

  if (activeIndex?.getAttribute("extra-section") == "emoji") {
    emojiFieldChange()
  }
}

const saveExtra = () => {
  Preferences.set({ key: "extraUserData", value: JSON.stringify(store.state.extraUserData) })
}

const addPfpRequest = async () => {
  await pickMedia()
  listPfps()
}

const listPfps = async () => {
  const pfps = await readdir("pfps")

  extraPfps.value = []

  for (const pf of pfps) {
    extraPfps.value.push({
      path: pf.path,
      src: (await decompress((await readFile(pf.path)), "gzip"))
    })
  }
}

onMounted(() => {
  if (swipePfp.value) {
    swipePfp.value.addEventListener('swiper-slidechange', pfpRequestChange);

    const allSlides = Array.from(swipePfp.value.querySelectorAll(`swiper-slide`))
    const targetPfpEl = swipePfp.value.querySelector(`swiper-slide[source='${store.state.extraUserData.preferredPfp}']`)

    if (targetPfpEl) {
      swipePfp.value.swiper.slideTo(allSlides.indexOf(targetPfpEl))
    }

    if (store.state.extraUserData.preferredPfpType == "emoji") {
      emojiField.value = store.state.extraUserData.preferredPfp
      swipePfp.value.swiper.slideTo(allSlides.indexOf(swipePfp.value.querySelector(`swiper-slide[extra-section='emoji']`)))
    } else {
      emojiField.value = store.state.extraUserData.emojiPfpCache
    }
  }

  //listPfps()

  emojiFieldAdaptColor()
})

onUnmounted(() => {
  saveExtra()
})
</script>

<style scoped>
.pictures-swipe {
  width: 151px;
  height: 200px;
  border-radius: 8px;
}

.pictures-swipe swiper-slide {
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
  overflow: visible;
}

.pictures-swipe swiper-slide img {
  border-radius: 8px;
}

.pfp-delete {
  position: absolute;
  right: -15px;
  top: -15px;
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: var(--f7-color-red);
  border: none;
  border-radius: 50%;
  pointer-events: none;
  transition: 0.5s opacity;
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide-active .pfp-delete {
  opacity: 1;
  pointer-events: all;
}

.appear-swiper-active {
  transition: 0.5s opacity;
  opacity: 0;
}

.swiper-slide-active .appear-swiper-active {
  opacity: 1;
  pointer-events: all;
}

.add-pfp {
  background-color: var(--f7-md-primary-container);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--f7-color-primary);
}

.emoji-field {
  width: 100%;
  height: 100%;
  display: inline-block;
  text-align: center;
  font-size: 70px;
  filter: drop-shadow(0px 3px 10px rgba(0, 0, 0, 0.156));
  font-family: 'Arial';
  color: black;
}

.emoji-guide {
  position: absolute;
  left: calc(100% + 5px);
  transition: 0.5s transform cubic-bezier(0.34, 1.56, 0.64, 1), 0.5s opacity cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: scale(0.5);
  transform-origin: left;
  opacity: 0;
}

.swiper-slide-active .emoji-guide {
  transform: scale(1);
  opacity: 0.5;
}
</style>