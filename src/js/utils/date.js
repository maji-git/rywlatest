const monthEng = {
    "ม.ค.": "January", "ก.พ.": "February", "มี.ค.": "March", "เม.ย.": "April", "พ.ค.": "May", "มิ.ย.": "June", "ก.ค.": "July", "ส.ค.": "August", "ก.ย.": "September", "ต.ค.": "October", "พ.ย.": "November", "ธ.ค.": "December"
}

export function thaiToDate(str) {
    let finalStr = ""
    const splitStr = str.split(" ")

    finalStr = `${parseInt(splitStr[0])} ${splitStr[1]} `

    for (const [key, value] of Object.entries(monthEng)) {
        finalStr = finalStr.replace(key, value)
    }

    let yr = parseInt(`25${splitStr[2]}`) - 543

    finalStr += yr

    return new Date(finalStr)
}