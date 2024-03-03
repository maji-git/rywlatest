// Import Vue
import { createApp } from 'vue';
import { loadFromPreferences } from "./lib/stdsession.js"
import { Preferences } from '@capacitor/preferences';

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

import Logger from "js-logger"

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

// Init App
const app = createApp(App);

// Register Framework7 Vue components
registerComponents(app);


Logger.useDefaults()
Logger.setHandler(Logger.createDefaultHandler({
    formatter: function (messages, context) {
        messages.unshift(`[${context.level.name}]`)
    }
}))

console.log("------------")
console.log(`%cRYW Latest ${__APP_VERSION__}`, "color:#FFC700; font-size:30px");
console.log("Github:", "https://github.com/SK-Fast/rywlatest")
console.log("IG:", "https://www.instagram.com/rywlatest/")
console.log("Licensed under MIT License")
console.log("------------")

app.mount('#app')