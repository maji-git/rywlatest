import writeBlob from "capacitor-blob-writer";
import { Directory } from "@capacitor/filesystem";
import { FileOpener } from "@capacitor-community/file-opener"

export async function openBlob(blob, filename = "rywl-file") {
    if (window.isNative) {
        const blo = await writeBlob({
            path: filename,
            directory: Directory.Cache,
            blob: blob
        })

        FileOpener.open({
            filePath: blo
        })
    } else {
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = filename
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove()
    }
}