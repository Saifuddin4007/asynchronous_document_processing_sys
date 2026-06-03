

export const textExport = (content) => {

    const result = content.reviewed_data ? content.reviewed_data.text : content.extracted_data.text;
    return result
        .split("\n")
        .map(line => line.trim())
        .filter(line => line !== "")
        .join("\n");


}