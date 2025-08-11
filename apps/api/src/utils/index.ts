export const formatDate = (date: Date, locale: string = 'en-US'): string => {
    return new Intl.DateTimeFormat(locale).format(date);
};

export const generateUniqueId = (): string => {
    return 'id-' + Math.random().toString(36).substr(2, 16);
};

export const parseJson = (jsonString: string): any => {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        throw new Error('Invalid JSON string');
    }
};