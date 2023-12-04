import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { LocalNotifications } from '@capacitor/local-notifications';
import store from '@/js/store.js';
import { Preferences } from "@capacitor/preferences"
import { getMessaging, getToken, deleteToken, onMessage } from "firebase/messaging";

const notifications = []

export async function saveToPrefs() {
    await Preferences.set({ key: "notifyData", value: JSON.stringify(store.state.notify) })
}

export async function loadPrefs() {
    const res = await Preferences.get({ key: "notifyData" })

    if (res.value) {
        store.state.notify = JSON.parse(res.value)

        if (store.state.userData && !store.state.notify['room_subbed']) {
            console.log("Subbed to level")
            await FirebaseMessaging.subscribeToTopic({ topic: `level_${store.state.userData.mathayom}` });
            store.state.notify['room_subbed'] = true
            saveToPrefs()
        }
    }
}

export function getNotifications() {
    return notifications
}

export function waitForMessages() {
    if (window.isNative) {
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
    } else {
        onMessage(getMessaging(), (data) => {
            console.log(data)
            store.state.newNotify = true
            notifications.push(data.notification)

            const notification = new Notification(data.notification.title, {
                body: data.notification.body
            });

            console.log(notification)
        })
    }
}

export function enableNotify() {
    if (window.isNative) {
        return new Promise(async (resolve) => {
            const permRes = await FirebaseMessaging.requestPermissions()

            if (permRes.receive === 'granted') {
                const token = await FirebaseMessaging.getToken()
                await FirebaseMessaging.subscribeToTopic({ topic: 'all' });
                if (store.state.userData) {
                    await FirebaseMessaging.subscribeToTopic({ topic: `level_${store.state.userData.mathayom}` });
                }

                console.log("Notify Service Enabled via Native")
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
    } else {
        return new Promise(async (resolve) => {
            const messaging = getMessaging()

            console.log('Requesting permission...');
            const permission = await Notification.requestPermission()

            console.log(store.state.notifyVapidKey)

            if (permission == "granted") {
                const token = await getToken(messaging, { vapidKey: store.state.notifyVapidKey ?? undefined });

                if (token) {

                    console.log("Subscribing to FCM Topics...")

                    await messaging.subscribeToTopic(token, "test");

                    console.log("Notify Service Enabled via Firebase web FCM")
                    console.log(token)

                    store.state.notify.enabled = true
                    store.state.notify.token = token
                    saveToPrefs()
                    resolve({
                        success: true,
                        token: token
                    })
                }
            } else {
                resolve({
                    success: false,
                    msg: "ERR_NO_PERM"
                })
            }
        })
    }
}

export async function disableNotify() {
    if (window.isNative) {
        await FirebaseMessaging.deleteToken()
    } else {
        await deleteToken(getMessaging())
    }
    console.log("Notify Service Disabled")
    store.state.notify.enabled = false
    store.state.notify.token = ""
    saveToPrefs()
}