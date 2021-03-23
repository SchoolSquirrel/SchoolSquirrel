export const documentFileTypes = {
    text: ["docx", "doc", "txt", "rtf", "odt"],
    spreadsheet: ["xlsx", "xls", "ods"],
    presentation: ["pptx", "ppt", "odp"],
};

export const fileTypes = {
    document: [],
    image: ["jpg", "jpeg", "png", "tif", "svg", "gif", "bmp"],
    video: ["mp4", "avi", "mov", "webm"],
    audio: ["mp3", "wav"],
    pdf: ["pdf"],
};

for (const type in documentFileTypes) {
    if (documentFileTypes.hasOwnProperty(type)) {
        fileTypes.document.push(...documentFileTypes[type]);
    }
}

export const editableFileTypes = [
    ...fileTypes.document,
];
