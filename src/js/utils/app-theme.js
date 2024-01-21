export function adaptStatusbar() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        window.darkMode = true
        setStatusbarDark()
    } else {
        window.darkMode = false
        setStatusbarLight()
    }
}

export function setStatusbarDark() {
    document.querySelector("#theme-color-meta").setAttribute("content", "#121212")
}

export function setStatusbarLight() {
    document.querySelector("#theme-color-meta").setAttribute("content", "#F7F7F8")
}