import { RYWLHttp } from '../utils/http.js';

export async function getEvents(page, searchQuery) {
    const eventData = await RYWLHttp.get({
        url: `${window.rywlAPIs.main}/wp-json/tribe/events/v1/events?page=${page}${searchQuery ? `&search=${searchQuery}` : ''}`
    });

    return eventData.data
}