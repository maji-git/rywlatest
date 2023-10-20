import { stripHtml } from "string-strip-html";
import { CapacitorHttp } from '@capacitor/core';

const url = "https://rayongwit.ac.th/%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A7%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%8A%E0%B8%B2%E0%B8%AA%E0%B8%B1%E0%B8%A1%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B9%8C/"

export async function getAnnouncements() {
  const res = await CapacitorHttp.get({
    url: url
  });

  const parser = new DOMParser()
  const dom = parser.parseFromString(res.data, "text/html")

  const result = []

  for (const element of dom.querySelectorAll(".post-right-content")) {
    const title = element.querySelector(".tpg-post-link")
    const date = element.querySelector(".date a")

    if (title && date) {
      result.push({
        title: stripHtml(title.innerHTML.trim()).result,
        date: stripHtml(date.innerHTML.trim()).result,
        article: title.getAttribute("href"),
      })
    }
  }

  return result
}