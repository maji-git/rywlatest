import { RYWLHttp } from '../utils/http.js';

export async function getEvents(page, searchQuery) {
    const eventData = await fetch(`https://rayongwit.ac.th/wp-json/tribe/events/v1/events?page=${page}${searchQuery ? `&search=${searchQuery}` : ''}`)

    return (await eventData.json())
}