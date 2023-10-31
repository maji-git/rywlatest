import { PushNotifications } from '@capacitor/push-notifications';
import store from '@/js/store.js';
import { Preferences } from "@capacitor/preferences"

export async function saveToPrefs() {
    await Preferences.set({key: "notifyData", value: JSON.stringify(store.state.notify)})
}

export async function loadPrefs() {
    const res = await Preferences.get({key: "notifyData"})

    if (res.value) {
        store.state.notify = JSON.parse(res.value)
    }
}

export function enableNotify() {
    return new Promise(async (resolve) => {

        const permRes = await PushNotifications.requestPermissions()
        if (permRes.receive === 'granted') {
            PushNotifications.register()
        } else {
            resolve({
                success: false,
                msg: "ERR_NO_PERM"
            })
            return
        }

        PushNotifications.addListener('registration',
            (token) => {
                store.state.notify.enabled = true
                store.state.notify.token = token.value
                saveToPrefs()
                resolve({
                    success: true,
                    token: token.value
                })
            }
        );
    })
}

export async function disableNotify() {
    await PushNotifications.unregister()
    store.state.notify.enabled = false
    store.state.notify.token = ""
    saveToPrefs()
}