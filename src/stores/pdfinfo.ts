import { atom } from 'nanostores'

export const _optn = atom('')
export const _applicationNo = atom('')
export const _date = atom('')
export const _name = atom('')
export const _location = atom('')
export const _type = atom('')
export const _code = atom('')
export const _assessor = atom('')
export const _assessorid = atom(0)

export const _feeList = atom<string[]>([])
export const _codeList = atom<string[]>([])
export const _amountList = atom<string[]>([])

export const _signatureAssessor = atom('')
export const _signatureApprover = atom('')

export const _approvedDate = atom('')
export const _assessedDate = atom('')

export const _units = atom(0)
export const _totalUnits = atom(0)
export const _floorArea = atom(0)

export const _additional = atom(false)
export const _additionalFeeList = atom<string[]>([])
export const _additionalCodeList = atom<string[]>([])
export const _additionalAmountList = atom<string[]>([])
export const _additionalUnitList = atom<number[]>([])
