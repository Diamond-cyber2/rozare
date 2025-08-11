"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJson = exports.generateUniqueId = exports.formatDate = void 0;
const formatDate = (date, locale = 'en-US') => {
    return new Intl.DateTimeFormat(locale).format(date);
};
exports.formatDate = formatDate;
const generateUniqueId = () => {
    return 'id-' + Math.random().toString(36).substr(2, 16);
};
exports.generateUniqueId = generateUniqueId;
const parseJson = (jsonString) => {
    try {
        return JSON.parse(jsonString);
    }
    catch (error) {
        throw new Error('Invalid JSON string');
    }
};
exports.parseJson = parseJson;
