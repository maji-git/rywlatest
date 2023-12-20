import store from "./store";

export function fixData() {
    if (!store.state['extraUserData']) {
        store.state['extraUserData'] = {}
    }

    if (!store.state.extraUserData['preferredPfp'])  {
        store.state.extraUserData['preferredPfp'] = "default"
    }
}