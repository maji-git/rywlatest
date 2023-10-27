import { CapacitorHttp } from '@capacitor/core';

export async function getEvents(page, searchQuery) {
    const eventData = await CapacitorHttp.get({
        url: `https://rayongwit.ac.th/wp-json/tribe/events/v1/events?page=${page}${searchQuery ? `&search=${searchQuery}` : ''}`
    });

    return eventData.data
}