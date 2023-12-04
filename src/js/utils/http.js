import { CapacitorHttp } from '@capacitor/core';
import axios from "axios"

const doTheJob = async (method, options) => {
    if (window['rywlUseProxy']) {
        const res = await axios.request({
            url: options.url,
            method: "POST",
            data: {
                method: method,
                data: options["data"],
                headers: options["headers"],
            }
        })

        return {
            data: res.data.data,
            headers: {},
            cookie: res.data["set-cookie"],
            status: res.status,
            url: options.url
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