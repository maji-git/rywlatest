import { CapacitorHttp } from '@capacitor/core';

export async function resolveImg(targetURL) {
    const db = await CapacitorHttp.get({
        url: targetURL,
        responseType: "arraybuffer"
    });

    return `data:${db.headers['Content-Type']};base64,${db.data.replace("\n", "")}`
}