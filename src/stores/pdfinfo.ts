import { store } from "../../builtin/services/store";

export const _optn = store('string')
export const _applicationNo = store('string')
export const _date = store('string')
export const _name = store('string')
export const _location = store('string')
export const _type = store('string')
export const _code = store('string')
export const _assessor = store('string')
export const _assessorid = store('number')

export const _feeList = store('array')
export const _codeList = store('array')
export const _amountList = store('array')

export const _signatureAssessor = store('string')
export const _signatureApprover = store('string')

export const _approvedDate = store('string')
export const _assessedDate = store('string')

export const _units = store('number')
export const _totalUnits = store('number')
export const _floorArea = store('number')

export const _additional = store('boolean')
export const _additionalFeeList = store('array')
export const _additionalCodeList = store('array')
export const _additionalAmountList = store('array')
export const _additionalUnitList = store('array')
