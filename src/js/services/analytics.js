import { setUserProperties } from "firebase/analytics";

export function setUserProperty(analytics, name, value) {
    if (!name || !value) {
      return;
    }
  
    if (window.AnalyticsWebInterface) {
      // Call Android interface
      window.AnalyticsWebInterface.setUserProperty(name, value);
    } else if (window.webkit
        && window.webkit.messageHandlers
        && window.webkit.messageHandlers.firebase) {
      // Call iOS interface
      let message = {
        command: 'setUserProperty',
        name: name,
        value: value
     };
      window.webkit.messageHandlers.firebase.postMessage(message);
    } else {
        setUserProperties(analytics, {[name]: value})
    }
  }
  