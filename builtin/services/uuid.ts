import { v7 as uuidv7, v4 as uuidv4 } from 'uuid'

export function uuid(timestamp: 'notimestamp' | 'timestamp' = 'timestamp') {
  if (timestamp === 'notimestamp') return uuidv4()
  return uuidv7()
}
