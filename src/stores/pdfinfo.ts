import { store } from '@dasig/store'

export const _optn = store('string')
export const _applicationNo = store('string')
export const _date = store('string')
export const _name = store('string')
export const _location = store('string')
export const _type = store('string')
export const _code = store('string')
export const _assessor = store('string')
export const _assessorid = store('number')

export const _feeList = store('arraynumbers')
export const _codeList = store('arraystring')
export const _amountList = store('arraynumbers')

export const _signatureAssessor = store('string')
export const _signatureApprover = store('string')

export const _approvedDate = store('string')
export const _assessedDate = store('string')

export const _units = store('number')
export const _totalUnits = store('number')
export const _floorArea = store('number')

export const _additional = store('boolean')
export const _additionalFeeList = store('arraynumbers')
export const _additionalCodeList = store('arraystring')
export const _additionalAmountList = store('arraynumbers')
export const _additionalUnitList = store('arraynumbers')
