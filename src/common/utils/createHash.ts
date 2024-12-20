import { createHash } from 'crypto'

export const hashObject = <T>(obj: Record<string, T>) => {
  const jsonString = JSON.stringify(obj, Object.keys(obj).sort()) // Sort keys for consistent hashing

  const hash = createHash('sha256')

  // Update the hash with the JSON string and digest it
  return hash.update(jsonString).digest('hex')
}
