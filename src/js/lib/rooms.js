import { CapacitorHttp } from '@capacitor/core';

const url = "https://rywlatest.web.app/app/room-avaib.json"

export async function getAvailabilites() {
  const res = await CapacitorHttp.get({
    url: url
  });

  return res.data
}