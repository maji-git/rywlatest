import { compress, decompress } from "./compression.js"

export async function storeUserImage() {
    if (window.isNative) {

    } else {
    }
}

export async function pickMedia() {
    if (window.isNative) {

    } else {
        return new Promise((resolve) => {
            const input = document.createElement("input")
            input.setAttribute("type", "file")
            input.setAttribute("accept", "image/png, image/jpeg")

            input.click()

            const reader = new FileReader();

            reader.onload = async () => {
                const contents = reader.result;
                console.log(contents)

                const decoder = new TextDecoder()
                const encoder = new TextEncoder()

                const d = decoder.decode(await compress(contents, "gzip"))

                console.log(d)

                console.log("NXt-")

                const e = encoder.encode(d)

                console.log(e)

                console.log("FINAL-")

                const dd = await decompress(contents, "gzip")

                console.log(dd)

            };

            input.addEventListener("change", () => {
                if (input.files[0]) {
                    reader.readAsDataURL(input.files[0]);
                }

                input.remove()
            })
        })
    }
}