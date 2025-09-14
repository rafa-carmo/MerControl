
export function formatToUtc(date: string): string {
    const localDate = new Date(date);
    const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
    return utcDate.toISOString();
}
