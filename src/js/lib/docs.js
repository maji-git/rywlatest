export async function getDocs() {
    const res = await fetch("https://rywlatest.web.app/app/docs.json")
    return (await res.json())
}