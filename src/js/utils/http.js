import { CapacitorHttp } from '@capacitor/core';

const doTheJob = async (method, options) => {
    if (window['rywlUseProxy']) {
        console.log(options['headers'])

        const headers = new Headers()
        if (options['headers']) {
            for (const [key, value] of Object.entries(options['headers'])) {
                headers.set(key, value)
            }
        }

        const res = await fetch(options.url, {
            method: method,
            body: options['data'],
            mode: "cors",
            headers: headers,
            credentials: 'include'
        })

        const resHeaders = {}

        for (const header of res.headers) {
            console.log(header[0], header[1])
            resHeaders[header[0]] = header[1]
        }

        console.log(resHeaders)

        return {
            data: (await res.text()),
            headers: resHeaders,
            status: res.status,
            url: res.url
        }
    } else {
        return (await CapacitorHttp[method](options))
    }
}

const RYWLHttpHandler = {
    post: async (options) => {
        return (await doTheJob("post", options))
    },
    get: async (options) => {
        return (await doTheJob("get", options))
    },
}

export const RYWLHttp = RYWLHttpHandler