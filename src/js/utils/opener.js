import writeBlob from "capacitor-blob-writer";
import { Directory } from "@capacitor/filesystem";
import { FileOpener } from "@capacitor-community/file-opener"
import { saveAs } from 'file-saver';

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
        saveAs(blob, filename);
    }
}