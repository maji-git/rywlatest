// Import Vue
import { createApp } from 'vue';

// Import Framework7
import Framework7 from 'framework7/lite-bundle';

// Import Framework7-Vue Plugin
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle';

// Import Framework7 Styles
import 'framework7/css/bundle';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';

// Import App Component
import App from '../components/app.vue';
import store from "./store.js"

import PageEnd from '@/components/page-end.vue'
import ChipIcon from '@/components/chip-icon.vue'

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

// Init App
const app = createApp(App);

// Register Framework7 Vue components
registerComponents(app);

app.component('page-end', PageEnd);
app.component('chip-icon', ChipIcon);

console.log("RYW Latest Started")

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    window.darkMode = true
}

async function preStartup() {
    const res = await fetch("https://rywlatest.web.app/app/meta.json")
    const metadata = await res.json()

    console.log(metadata)

    for (const [key, value] of Object.entries(metadata.storeData)) {
        store.state[key] = value
    }

    /*
    window.rywlAPIs = {
        main: "https://rayongwit.ac.th",
        rywl: "https://rywlatest.web.app",
    }
    */

    window.rywlAPIs = {
        main: "http://192.168.1.170:3000",
        rywl: "https://rywlatest.web.app",
    }

    window.rywlUseProxy = true

    console.log(store.state)

    // Mount the app
    app.mount('#app')
}

preStartup()