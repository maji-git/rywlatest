import { CapacitorHttp } from '@capacitor/core';

export async function getAvailabilites() {
  const res = await CapacitorHttp.get({
    url: `${window.rywlAPIs.rywl}/app/room-avaib.json`
  });

  return res.data
}