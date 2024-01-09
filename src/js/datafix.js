import store from "./store";

export function fixData() {
    console.log(store.state)
    if (!store.state['extraUserData']) {
        store.state['extraUserData'] = {}
    }

    if (!store.state.extraUserData['preferredPfp'])  {
        store.state.extraUserData['preferredPfp'] = "default"
    }

    if (!store.state.extraUserData['preferredPfpType'])  {
        store.state.extraUserData['preferredPfpType'] = "image"
    }

    if (!store.state.extraUserData['preferredPfpExtra'])  {
        store.state.extraUserData['preferredPfpExtra'] = {}
    }

    if (!store.state.extraUserData['emojiPfpCache'])  {
        store.state.extraUserData['emojiPfpCache'] = "😉"
    }
}