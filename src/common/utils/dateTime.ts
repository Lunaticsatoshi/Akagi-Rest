export const addHoursToDate = (date: Date, hours: number) =>  {
    const hoursToAdd = hours * 60 * 60 * 1000;
    date.setTime(date.getTime() + hoursToAdd);
    return date;
}

export const toMilliseconds = (hrs,min,sec) => (hrs*60*60+min*60+sec)*1000;