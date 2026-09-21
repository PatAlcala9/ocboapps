import { atom, type WritableAtom } from 'nanostores'

type StoreValues = {
  string: string
  number: number
  boolean: boolean
  array: Array<any> 
}

export function store<K extends keyof StoreValues>(type: K ): WritableAtom<StoreValues[K]> {
  const values: StoreValues = {
    string: '',
    number: 0,
    boolean: false,
    array: []
  }

  return atom(values[type])
}