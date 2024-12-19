import { addDays, addHours, addMinutes, addMonths, addWeeks, getUnixTime } from 'date-fns'
export const addHoursToDate = (date: Date, hours: number) => {
  const hoursToAdd = hours * 60 * 60 * 1000
  date.setTime(date.getTime() + hoursToAdd)
  return date
}

export const toMilliseconds = (hrs, min, sec) => (hrs * 60 * 60 + min * 60 + sec) * 1000

export const convertTimeToUnixTime = (time: string) => {
  const [value, unit] = time.split(' ')
  const currentDate = new Date() // Current date and time
  if (unit === 'hours' || unit === 'hour') {
    const futureDate = addHours(currentDate, parseInt(value)) // Add the specified hours
    const unixTimeSeconds = getUnixTime(futureDate) // Get Unix time in seconds
    return unixTimeSeconds
  }

  if (unit === 'days' || unit === 'day') {
    const futureDate = addDays(currentDate, parseInt(value)) // Add the specified days
    const unixTimeSeconds = getUnixTime(futureDate) // Get Unix time in seconds
    return unixTimeSeconds
  }

  if (unit === 'weeks' || unit === 'week') {
    const futureDate = addWeeks(currentDate, parseInt(value)) // Add the specified weeks
    const unixTimeSeconds = getUnixTime(futureDate) // Get Unix time in seconds
    return unixTimeSeconds
  }

  if (unit === 'months' || unit === 'month') {
    const futureDate = addMonths(currentDate, parseInt(value)) // Add the specified months
    const unixTimeSeconds = getUnixTime(futureDate) // Get Unix time in seconds
    return unixTimeSeconds
  }

  const futureDate = addMinutes(currentDate, parseInt(value)) // Add the specified minutes
  const unixTimeSeconds = getUnixTime(futureDate) // Get Unix time in seconds
  return unixTimeSeconds
}
