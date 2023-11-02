import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { LocalNotifications } from '@capacitor/local-notifications';
import store from '@/js/store.js';
import { Preferences } from "@capacitor/preferences"

const notifications = []

export async function saveToPrefs() {
    await Preferences.set({ key: "notifyData", value: JSON.stringify(store.state.notify) })
}

export async function loadPrefs() {
    const res = await Preferences.get({ key: "notifyData" })

    if (res.value) {
        store.state.notify = JSON.parse(res.value)
    }
}

export function getNotifications() {
    return notifications
}

export function waitForMessages() {
    FirebaseMessaging.addListener("notificationReceived", async (data) => {
        store.state.newNotify = true
        notifications.push(data.notification)
        const notifs = await LocalNotifications.schedule({
            notifications: [
                {
                    title: data.notification.title,
                    body: data.notification.body,
                    id: 1,
                    schedule: { at: new Date(Date.now() + 1000 * 5) },
                    sound: null,
                    attachments: null,
                    actionTypeId: '',
                    extra: null,
                },
            ],
        });
    })
}

export function enableNotify() {
    return new Promise(async (resolve) => {
        const permRes = await FirebaseMessaging.requestPermissions()

        if (permRes.receive === 'granted') {
            const token = await FirebaseMessaging.getToken()
            await FirebaseMessaging.subscribeToTopic({ topic: 'all' });

            console.log("Notify Service Enabled")
            console.log(token.token)

            store.state.notify.enabled = true
            store.state.notify.token = token.token
            saveToPrefs()
            resolve({
                success: true,
                token: token.token
            })
        } else {
            resolve({
                success: false,
                msg: "ERR_NO_PERM"
            })
            return
        }
    })
}

export async function disableNotify() {
    await FirebaseMessaging.deleteToken()
    console.log("Notify Service Disabled")
    store.state.notify.enabled = false
    store.state.notify.token = ""
    saveToPrefs()
}