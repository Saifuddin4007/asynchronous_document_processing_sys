import {jsonExport} from './jsonExport.js';
import {textExport} from './textExport.js';
export const exportDispatcher = async (content, format) => {

    if (format === 'json') {
        return jsonExport(content);
    }
    if (format === 'txt') {
        return textExport(content);
    }

    throw new Error("Unsupported format");

}