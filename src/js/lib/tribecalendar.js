import { CapacitorHttp } from '@capacitor/core';

export async function getEvents(page) {
    const eventData = await CapacitorHttp.get({
        url: `https://rayongwit.ac.th/wp-json/tribe/events/v1/events?page=${page}`
    });

    return eventData.data
}