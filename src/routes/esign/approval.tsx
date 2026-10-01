import { useNavigate } from '@solidjs/router'
import dayjs from 'dayjs'
import { FaSolidThumbsUp, FaSolidUserGear } from 'solid-icons/fa'
import { FileField } from '@kobalte/core/file-field'
import { FiLogOut } from 'solid-icons/fi'
import { VsRefresh } from 'solid-icons/vs'
import { createEffect, createSignal, flush, onSettled, Show } from 'solid-js'
import { Box, Button, Clickable, Column, Input, Link, Logo, Modal, ModalButton, Padding, Page, Row, Image } from '@dasig'
// import { checkConnection, deleteApi, getApi, getApiMulti, getDateTime, lockData, postApi, saveNewName, saveNewPassword, saveNewSignature, securePassword, voidPopsApi, voidApi, statusPopsApi } from '../../utils/functions'
import { checkConnection, getDateTime, lockData, securePassword } from '../../utils'
import { getApi, postApi, deleteApi } from '@dasig/api'
import { AiOutlineLoading3Quarters } from 'solid-icons/ai'
import { $logged_in, $login_role, $login_name, $login_id } from 'cache/login'

import { RiDocumentFileCloseFill } from 'solid-icons/ri'
import getPassword from '../../utils/functions/getPassword'
// import getListForApproval from '../../utils/functions/getListForApproval'
// import { _listElectricalApplications, _listElectricalNames, _listMechanicalApplications, _listMechanicalNames, _listOccupancyApplications, _listOccupancyNames } from 'stores/prefetch'
import './approval.sass'

const PESO = '₱'
const ID = sessionStorage.getItem('id')!
const PUBLICIP = import.meta.env.VITE_PUBLICIP
const BACKEND = import.meta.env.VITE_BACKEND

export default () => {
  const navigate = useNavigate()
  const [file, setFile] = createSignal<File[]>()

  const [totalOp, setTotalOp] = createSignal('')
  const [assessor, setAssessor] = createSignal('')
  const [dateOp, setDateOp] = createSignal('')
  const [location, setLocation] = createSignal('')
  const [type, setType] = createSignal('')
  const [applicationId, setApplicationId] = createSignal(0)

  // const [gflgu, setGflgu] = createSignal<number[]>([])
  // const [gfdpwh, setGfdpwh] = createSignal<number[]>([])
  // const [tfbo, setTfbo] = createSignal<number[]>([])

  // const [descriptionList, setDescriptionList] = createSignal<string[]>([])
  // const [amountList, setAmountList] = createSignal<string[]>([])
  // const [dateOpList, setDateOpList] = createSignal<string[]>([])

  const [applicationListElectrical, setApplicationListElectrical] = createSignal<string[]>([])
  const [nameListElectrical, setNameListElectrical] = createSignal<string[]>([])
  const [applicationListOccupancy, setApplicationListOccupancy] = createSignal<string[]>([])
  const [nameListOccupancy, setNameListOccupancy] = createSignal<string[]>([])
  const [applicationListMechanical, setApplicationListMechanical] = createSignal<string[]>([])
  const [nameListMechanical, setNameListMechanical] = createSignal<string[]>([])

  const [errorMessage, setErrorMessage] = createSignal('')
  const [connected, setConnected] = createSignal(true)
  const [approved, setApproved] = createSignal(false)
  const [approvedApplication, setApprovedApplication] = createSignal('')

  const [employeeId, setEmployeeId] = createSignal(0)
  const [employeeName, setEmployeeName] = createSignal('')

  // const [apology, setApology] = createSignal(false)
  const [openConfig, setOpenConfig] = createSignal(false)
  const [configEncPassword, setConfigEncPassword] = createSignal('')
  const [configNewName, setConfigNewName] = createSignal('')
  const [configPassword, setConfigPassword] = createSignal('')
  const [configNewPassword, setConfigNewPassword] = createSignal('')
  const [configNewEncPassword, setConfigNewEncPassword] = createSignal('')
  const [configError, setConfigError] = createSignal('')
  const [postError, setPostError] = createSignal(false)

  const [configNotification, setConfigNotification] = createSignal(false)
  const [isIncomplete, setIsIncomplete] = createSignal(false)
  const [isLoading, setIsLoading] = createSignal(false)
  const [loadingText, setLoadingText] = createSignal('')

  // const [multipleSelect, setMultitpleSelect] = createSignal(false)
  // const [selectedApplications, setSelectedApplications] = createSignal<string[]>([])
  // const [selectedNames, setSelectedNames] = createSignal<string[]>([])
  // const [selectedLocations, setSelectedLocations] = createSignal<string[]>([])
  // const [selectedTypes, setSelectedTypes] = createSignal<string[]>([])
  // const [selectedAssessors, setSelectedAssessors] = createSignal<string[]>([])
  // const [selectedDates, setSelectedDates] = createSignal<string[]>([])
  // const [selectedTotals, setSelectedTotals] = createSignal<string[]>([])
  const [selectedApplication, setSelectedApplication] = createSignal<string>('')
  const [selectedName, setSelectedName] = createSignal<string>('')
  const [selectedLocation, setSelectedLocation] = createSignal<string>('')
  const [selectedType, setSelectedType] = createSignal<string>('')
  const [selectedAssessor, setSelectedAssessor] = createSignal<string>('')
  const [selectedDate, setSelectedDate] = createSignal<string>('')
  const [selectedTotal, setSelectedTotal] = createSignal<string>('')
  const [showDetails, setShowDetails] = createSignal(false)
  const [division, setDivision] = createSignal('')

  let bldgadditional = false
  let loggedin = false

  // const getListForApprovalElectrical = async () => {
  //   const prefetchedElectricalApplications = _listElectricalApplications.get()
  //   const prefetchedElectricalNames = _listElectricalNames.get()

  //   if (prefetchedElectricalApplications.length > 0) {
  //     setApplicationListElectrical(prefetchedElectricalApplications)
  //     setNameListElectrical(prefetchedElectricalNames)
  //     return
  //   }

  //   const [applications, names] = await getListForApproval('electrical')
  //   setApplicationListElectrical(applications)
  //   setNameListElectrical(names)
  // }

  // const getListForApprovalOccupancy = async () => {
  //   const prefetchedOccupancyApplications = _listOccupancyApplications.get()
  //   const prefetchedOccupancyNames = _listOccupancyNames.get()

  //   if (prefetchedOccupancyApplications.length > 0) {
  //     setApplicationListOccupancy(prefetchedOccupancyApplications)
  //     setNameListOccupancy(prefetchedOccupancyNames)
  //     return
  //   }

  //   const [applications, names] = await getListForApproval('occupancy')
  //   setApplicationListOccupancy(applications)
  //   setNameListOccupancy(names)
  // }

  // const getListForApprovalMechanical = async () => {
  //   const prefetchedMechanicalApplications = _listMechanicalApplications.get()
  //   const prefetchedMechanicalNames = _listMechanicalNames.get()

  //   if (prefetchedMechanicalApplications.length > 0) {
  //     setApplicationListMechanical(prefetchedMechanicalApplications)
  //     setNameListMechanical(prefetchedMechanicalNames)
  //     return
  //   }

  //   const [applications, names] = await getListForApproval('mechanical')
  //   setApplicationListMechanical(applications)
  //   setNameListMechanical(names)
  // }

  // const load = async (division: string) => {
  //   setConnected(await checkConnection())
  //   if (connected() === false) {
  //     setErrorMessage('Failed to fetch application list')
  //     return
  //   }

  //   setIsLoading(true)
  //   setLoadingText('Getting List to Approve')

  //   const password = await getPassword(ID)
  //   setConfigEncPassword(password)

  //   if (division === 'electrical') {
  //     await getListForApprovalElectrical()
  //   } else if (division === 'occupancy') {
  //     await getListForApprovalOccupancy()
  //   } else if (division === 'mechanical') {
  //     // await getListForApprovalMechanical()
  //   } else {
  //     await getListForApprovalElectrical()
  //     await getListForApprovalOccupancy()
  //     // await getListForApprovalMechanical()
  //   }
  //   setIsLoading(false)
  // }

  // const reloadExcept = async (application: string) => {
  //   const newApplicationListElectrical = applicationListElectrical().filter((item) => item !== application)
  //   const applicationIndexElectrical = applicationListElectrical().findIndex((x) => x === application)
  //   const newNameListElectrical = nameListElectrical()
  //     .map((item, index) => (index === applicationIndexElectrical ? null : item))
  //     .filter((item) => item !== null)

  //   setApplicationListElectrical(newApplicationListElectrical)
  //   setNameListElectrical(newNameListElectrical)

  //   const newApplicationListMechanical = applicationListMechanical().filter((item) => item !== application)
  //   const applicationIndexMechanical = applicationListMechanical().findIndex((x) => x === application)
  //   const newNameListMechanical = nameListMechanical()
  //     .map((item, index) => (index === applicationIndexMechanical ? null : item))
  //     .filter((item) => item !== null)

  //   setApplicationListMechanical(newApplicationListMechanical)
  //   setNameListMechanical(newNameListMechanical)

  //   const newApplicationListOccupancy = applicationListOccupancy().filter((item) => item !== application)
  //   const applicationIndexOccupancy = applicationListOccupancy().findIndex((x) => x === application)
  //   const newNameListOccupancy = nameListOccupancy()
  //     .map((item, index) => (index === applicationIndexOccupancy ? null : item))
  //     .filter((item) => item !== null)

  //   setApplicationListOccupancy(newApplicationListOccupancy)
  //   setNameListOccupancy(newNameListOccupancy)
  // }

  // const getopdetails = async (division: string, applicationNo: string) => {
  //   // const op = await getApiMulti(`get-opdetails-${division}`, applicationNo)
  //   let op: any
  //   if (division === 'electrical') {
  //     op = await getApiMulti('533b63af79c27bb782f3', applicationNo)
  //   } else if (division === 'mechanical') {
  //     op = await getApiMulti('ab0aec88a5615fd28f48', applicationNo)
  //   } else if (division === 'occupancy') {
  //     op = await getApiMulti('185caa987eba4376ba0d', applicationNo)
  //   }

  //   if (isDetailsComplete(op.result, op.result2, op.result3, op.result4, op.result5, op.result6)) {
  //     setIsIncomplete(false)
  //     setLocation(op.result[0])
  //     setType(op.result2[0])
  //     setAssessor(op.result3[0])
  //     const total = calculateTotal(op.result4)
  //     const formattedTotal = new Intl.NumberFormat('en-US', {
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     }).format(total)
  //     setTotalOp(formattedTotal)
  //     setDateOp(dayjs(op.result5[0]).format('MMMM DD, YYYY'))
  //     setApplicationId(op.result6[0])
  //   } else {
  //     setIsIncomplete(true)
  //   }
  // }

  // const getopdetailsCard = async (division: string, applicationNo: string) => {
  //   let op: any
  //   setDivision(division)

  //   if (division === 'electrical') {
  //     op = await getApiMulti('94e46bde0e2a857ed33a', applicationNo)
  //   } else if (division === 'mechanical') {
  //     op = await getApiMulti('ab0aec88a5615fd28f48', applicationNo)
  //   } else if (division === 'occupancy') {
  //     op = await getApiMulti('28f6c55c9123e46460ff', applicationNo)
  //   }

  //   if (isDetailsComplete(op.result, op.result2, op.result3, op.result4, op.result5, op.result6)) {
  //     setIsIncomplete(false)
  //     setSelectedApplication(applicationNo)
  //     setSelectedName(op.result7[0])
  //     setSelectedLocation(op.result[0])
  //     setSelectedType(op.result2[0])
  //     setSelectedAssessor(op.result3[0])
  //     const total = calculateTotal(op.result4)
  //     const formattedTotal = new Intl.NumberFormat('en-US', {
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     }).format(total)
  //     setSelectedTotal(formattedTotal)
  //     setSelectedDate(dayjs(op.result5[0]).format('MMMM DD, YYYY'))
  //     setApplicationId(op.result6[0])
  //   } else {
  //     setIsIncomplete(true)
  //   }
  // }

  // const getopdetailsMultiple = async (division: string, applicationNo: string, index: number) => {
  //   // const op = await getApiMulti(`get-opdetails-${division}`, applicationNo)
  //   let op: any
  //   if (division === 'electrical') {
  //     op = await getApiMulti('533b63af79c27bb782f3', applicationNo)
  //   } else if (division === 'mechanical') {
  //     op = await getApiMulti('ab0aec88a5615fd28f48', applicationNo)
  //   } else if (division === 'occupancy') {
  //     op = await getApiMulti('185caa987eba4376ba0d', applicationNo)
  //   }

  //   if (isDetailsComplete(op.result, op.result2, op.result3, op.result4, op.result5, op.result6)) {
  //     setIsIncomplete(false)
  //     setSelectedLocations((prev) => [...prev, op.result[index]])
  //     setSelectedTypes((prev) => [...prev, op.result2[index]])
  //     setSelectedAssessors((prev) => [...prev, op.result3[index]])
  //     const total = calculateTotal(op.result4)
  //     const formattedTotal = new Intl.NumberFormat('en-US', {
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     }).format(total)
  //     // setTotalOp(formattedTotal)
  //     setSelectedTotals((prev) => [...prev, formattedTotal])
  //     setDateOp(dayjs(op.result5[0]).format('MMMM DD, YYYY'))
  //     setApplicationId(op.result6[0])
  //   } else {
  //     setIsIncomplete(true)
  //   }
  // }

  const isDetailsComplete = (result: string[], result2: string[], result3: string[], result4: string[], result5: string[], result6: string[]) => {
    return result.length > 0 && result2.length > 0 && result3.length > 0 && result4.length > 0 && result5.length > 0 && result6.length > 0 ? true : false
  }

  const calculateTotal = (list: number[]) => {
    const total = list.map((item) => parseFloat(item.toString())).reduce((acc, curr) => acc + curr, 0)
    return total
  }

  // const approveHandler = async (division: string, application: string) => {
  //   let signed: boolean = false
  //   let forprinting: boolean = false
  //   let updateOrderofpayment: boolean = false

  //   let popsExist: boolean = false
  //   let popsPaid: boolean = false

  //   setConnected(await checkConnection())
  //   if (connected() === false) {
  //     setErrorMessage('No Connection on Server')
  //     return
  //   }

  //   setIsLoading(true)
  //   setLoadingText('Checking POPS record')

  //   if (BACKEND.includes('localhost')) {
  //     const status = await checkStatusPopsLocal(application)
  //     if (status.result > 0) popsExist = true
  //     if (status.result2 > 0) popsPaid = true
  //   } else {
  //     const status = await await statusPopsOp(application)
  //     if (status.message === 'Success') popsExist = true
  //     if (status.pops_paid === true) popsPaid = true
  //   }

  //   if (popsExist) {
  //     if (popsPaid) {
  //       setIsLoading(false)
  //       setPostError(true)
  //       setErrorMessage('Application Already Paid')
  //       return
  //     } else {
  //       if (BACKEND.includes('localhost')) {
  //         setLoadingText('Clearing unpaid POPS record')
  //         const voidOP = await voidPopsOpLocal(application)

  //         if (!voidOP) {
  //           setIsLoading(false)
  //           setPostError(true)
  //           setErrorMessage('POPS Record found but failed to void')
  //           return
  //         }
  //       } else {
  //         setLoadingText('Clearing unpaid POPS record')
  //         const voidOP = await voidPopsOp(application)

  //         if (voidOP.toUpper().includes('ERROR')) {
  //           setIsLoading(false)
  //           setPostError(true)
  //           setErrorMessage('POPS Record found but failed to void')
  //           return
  //         }
  //       }
  //       setIsLoading(false)
  //       setPostError(true)
  //       setErrorMessage(`A potential duplicate was found for ${application}; please contact IT to fix it`)
  //       return
  //     }
  //   }

  //   setLoadingText('Posting new record to POPS')
  //   // await postPops(division, application)

  //   setLoadingText(`Approving ${application}`)
  //   const dataLocked = await lockOpData(division, application)

  //   if (dataLocked) {
  //     if (division === 'electrical') {
  //       setLoadingText(`Pushing ${application} for printing`)
  //       signed = await setNewStatus(division, 'ELECTRICAL ORDER OF PAYMENT APPROVED AND SIGNED', '170', 'ELECOPAPPROVEDSIGNED', 1)
  //       updateDocflow(division, application, 'FOR ELECTRICAL ORDER OF PAYMENT APPROVAL')
  //       if (!signed) return

  //       forprinting = await setNewStatus(division, 'FOR ELECTRICAL ORDER OF PAYMENT PRINTING', '95', 'ELECOPPRINT', 0)
  //       if (!forprinting) return

  //       updateOrderofpayment = await updateOp(division)

  //       if (updateOrderofpayment) {
  //         setLoadingText('Adding new transaction record')
  //         postTransaction()
  //         setApprovedApplication(application)
  //         setApproved(true)
  //       }
  //     } else if (division === 'occupancy') {
  //       setLoadingText('Checking for building additionals')
  //       const additionalResult = await getApi('316badad46015679b94e', application)
  //       // bldgadditional = additionalResult > 0

  //       signed = await setNewStatus(division, 'OCCUPANCY ORDER OF PAYMENT APPROVED AND SIGNED', '172', 'OCCOPAPPROVEDSIGNED', 1)
  //       updateDocflow(division, application, 'FOR OCCUPANCY RECOMMENDING APPROVAL')
  //       if (bldgadditional) {
  //         const neededToUpdate = await checkIfApprovalOccupancy(application, 'FOR ADDITIONAL ORDER OF PAYMENT RECOMMENDING APPROVAL')
  //         if (!neededToUpdate) updateDocflow(division, application, 'FOR ADDITIONAL ORDER OF PAYMENT RECOMMENDING APPROVAL')
  //       }
  //       if (!signed) return

  //       forprinting = await setNewStatus(division, 'APPROVED FOR PRINTING OF BUREAU OF FIRE AND ORDER OF PAYMENT', '23', 'OCORDEROFPAYMENT', 0)
  //       if (!forprinting) return

  //       updateOrderofpayment = await updateOp(division)

  //       if (updateOrderofpayment) {
  //         setLoadingText('Adding new transaction record')
  //         postTransaction()
  //         setApprovedApplication(application)
  //         setApproved(true)
  //       }
  //     } else if (division === 'mechanical') {
  //       setLoadingText(`Pushing ${application} for printing`)
  //       signed = await setNewStatus(division, 'MECHANICAL ORDER OF PAYMENT APPROVED AND SIGNED', '175', 'MECHCOPAPPROVEDSIGNED', 1)

  //       updateDocflow(division, application, 'FOR MECHANICAL ORDER OF PAYMENT APPROVAL')
  //       if (!signed) return

  //       forprinting = await setNewStatus(division, 'FOR MECHANICAL ORDER OF PAYMENT PRINTING', '112', 'MECHOPPRINT', 0)
  //       if (!forprinting) return

  //       updateOrderofpayment = await updateOp(division)

  //       if (updateOrderofpayment) {
  //         setLoadingText('Adding new transaction record')
  //         postTransaction()
  //         setApprovedApplication(application)
  //         setApproved(true)
  //       }
  //     }
  //   } else {
  //     setIsLoading(false)
  //     setPostError(true)
  //     setErrorMessage('Error on posting on POPS Server, please try again')
  //     return
  //   }
  //   setIsLoading(false)
  // }

  // const showDetailsHandlerGroup = async (division: string, items: Array<string>) => {
  //   setMultitpleSelect(true)
  //   Promise.all(items.map((item, index) => getopdetailsMultiple(division, item, index)))
  //   setShowDetails(true)
  // }

  // const approveElectrical = async (division: string, application: string) => {
  //   let signed: boolean = false
  //   let forprinting: boolean = false
  //   let updateOrderofpayment: boolean = false

  //   await postPops(division, application)
  //   const popsResult = await checkPops(application)
  //   const lockResult = await lockOpData(division, application)

  //   if (popsResult && lockResult) {
  //     signed = await setNewStatus(division, 'ELECTRICAL ORDER OF PAYMENT APPROVED AND SIGNED', '170', 'ELECOPAPPROVEDSIGNED', 1)
  //     updateDocflow(division, application, 'FOR ELECTRICAL ORDER OF PAYMENT APPROVAL')
  //     if (!signed) return

  //     forprinting = await setNewStatus(division, 'FOR ELECTRICAL ORDER OF PAYMENT PRINTING', '95', 'ELECOPPRINT', 0)
  //     if (!forprinting) return

  //     updateOrderofpayment = await updateOp(division)

  //     if (updateOrderofpayment) {
  //       postTransaction()
  //       setApprovedApplication(application)
  //       setApproved(true)
  //     }
  //   } else {
  //     setPostError(true)
  //     setErrorMessage('Error on posting on POPS Server, please try again')
  //     return
  //   }
  // }

  // const lockOpData = async (division: string, application: string) => {
  //   // const dataToLock = await getApi(`get-opdata-${division}`, application)
  //   let dataToLock
  //   if (division === 'electrical') {
  //     dataToLock = await getApi('8c72fe205d3cba3d417c', application)
  //   } else if (division === 'mechanical') {
  //     dataToLock = await getApi('60c54d25f24c9aa3c446', application)
  //   } else if (division === 'occupancy') {
  //     dataToLock = await getApi('74c13dcb597ce97f6193', application)
  //   }
  //   const lockedData = await lockData(dataToLock)
  //   const fixedLockedData = lockedData.replace(/\//g, '~')
  //   const saveLockedData = await postApi('8c019ea819-531f73875c', { data: application, data2: fixedLockedData })
  //   return saveLockedData
  // }

  // const voidPopsOp = async (application: string) => {
  //   const response = await voidPopsApi(application)
  //   return response
  // }

  // const voidPopsOpLocal = async (application: string) => {
  //   const response = await voidApi('fe377458d5-527793ef64', { data: application })
  //   return response
  // }

  // const checkStatusPopsLocal = async (application: string) => {
  //   const response = await getApiMulti('1431ee20d8f6a0a03c74', application)
  //   return response
  // }

  // const statusPopsOp = async (application: string) => {
  //   const response = await statusPopsApi(application)
  //   return response
  // }

  // const returnAssessment = async (division: string, application: string) => {
  //   const id = await getApplicationById(division, application)
  //   setApplicationId(id)
  //   let forassessment

  //   if (division === 'electrical') {
  //     forassessment = await setNewStatus(division, 'FOR ELECTRICAL ASSESSMENT', '88', 'ELECASSESSMENT', 0)
  //   } else if (division === 'occupancy') {
  //     forassessment = await setNewStatus(division, 'OCCUPANCY ASSESSMENT', '21', 'OCASSESSMENT', 0)
  //   } else if (division === 'mechanical') {
  //     forassessment = await setNewStatus(division, 'FOR MECHANICAL ASSESSMENT', '105', 'MECHASSESSMENT', 0)
  //   }
  //   if (!forassessment) return

  //   if (division === 'electrical') {
  //     updateDocflow(division, application, 'FOR ELECTRICAL ORDER OF PAYMENT APPROVAL')
  //   } else if (division === 'occupancy') {
  //     updateDocflow(division, application, 'FOR OCCUPANCY RECOMMENDING APPROVAL')
  //   } else if (division === 'mechanical') {
  //     updateDocflow(division, application, 'FOR MECHANICAL ORDER OF PAYMENT APPROVAL')
  //   }

  //   await deleteOrderofPayment(division, id)
  //   await load('all')
  // }

  // const getApplicationById = async (division: string, application: string) => {
  //   // const id = await getApi(`get-idbyapplication-${division}`, application)
  //   let id
  //   if (division === 'electrical') {
  //     id = await getApi('76cce54882da3d8015cf', application)
  //   } else if (division === 'mechanical') {
  //     id = await getApi('112305fae2fb0443d595', application)
  //   } else if (division === 'occupancy') {
  //     id = await getApi('1f2977b2ed8e267ab533', application)
  //   } else if (division === 'building') {
  //     id = await getApi('bbab4662f5d5054aa663', application)
  //   }
  //   return parseInt(id)
  // }

  // const deleteOrderofPayment = async (division: string, id: number) => {
  //   const deleteOp = await deleteApi(`delete-orderofpayment-${division}`, {
  //     data: id,
  //   })
  //   let deleteOp
  //   if (division === 'electrical') {
  //     deleteOp = await deleteApi('f78dea0eb4-35f307d3f4', {
  //       data: id,
  //     })
  //   } else if (division === 'mechanical') {
  //     deleteOp = await deleteApi('hEpqSx6rXJaIlw_kjnTIsPSQS', {
  //       data: id,
  //     })
  //   } else if (division === 'occupancy') {
  //     deleteOp = await deleteApi('f78dea0eb4-01d0dafaaa', {
  //       data: id,
  //     })
  //   }
  //   return deleteOp
  // }

  const setNewStatus = async (division: string, status: string, tag: string, tagword: string, approved: number) => {
    // const today = new Date()
    const today = await getDateTime()
    const formattedDate = dayjs(today).format('YYYY-MM-DD HH:mm:ss')
    const statusid = parseInt(applicationId().toString())

    // if (division === 'electrical') {
    //   return await postApi('post-newstatus-electrical', { data: statusid, data2: formattedDate, data3: status, data4: tag, data5: tagword, data6: parseInt(approved.toString()), data7: parseInt(ID) })
    // } else if (division === 'oc') {
    //   return await postApi('post-newstatus-occupancy', { data: statusid, data2: formattedDate, data3: status, data4: tag, data5: tagword, data6: parseInt(approved.toString()), data7: parseInt(ID) })
    // }
    // return await postApi(`post-newstatus-${division}`, { data: statusid, data2: formattedDate, data3: status, data4: tag, data5: tagword, data6: parseInt(approved.toString()), data7: parseInt(ID) })

    let result: boolean
    if (division === 'electrical') {
      result = await postApi('4cd315b87a-901cde1e64', { data: statusid, data2: formattedDate, data3: status, data4: tag, data5: tagword, data6: parseInt(approved.toString()), data7: parseInt(ID) })
    } else if (division === 'mechanical') {
      result = await postApi('4cd315b87a-34b8064d45', { data: statusid, data2: formattedDate, data3: status, data4: tag, data5: tagword, data6: parseInt(approved.toString()), data7: parseInt(ID) })
    } else if (division === 'occupancy') {
      result = await postApi('4cd315b87a-8f2df1a3b4', { data: statusid, data2: formattedDate, data3: status, data4: tag, data5: tagword, data6: parseInt(approved.toString()), data7: parseInt(ID) })
    } else result = false
    return result
  }

  const updateOp = async (division: string) => {
    if (division === 'electrical') {
      return await postApi('48e0a71f62-582dfc159b', { data: parseInt(applicationId().toString()) })
    } else if (division === 'occupancy') {
      const occupancy = await postApi('48e0a71f62-9c440c5a04', { data: parseInt(applicationId().toString()) })
      if (bldgadditional) await postApi('48e0a71f62-b8a40f9b8c', { data: parseInt(applicationId().toString()) })
      return occupancy
    } else {
      return await postApi('48e0a71f62-49fa6766c9', { data: parseInt(applicationId().toString()) })
    }
  }

  // const postPops = async (division: string, application: string) => {
  //   let response

  //   if (division === 'electrical') {
  //     response = await getApiMulti('935758ca840c20723c72', application)
  //   } else if (division === 'mechanical') {
  //     response = await getApiMulti('7cff1c47fd874ce8eefc', application)
  //   } else if (division === 'occupancy') {
  //     response = await getApiMulti('bee657d5fb112e8fade9', application)
  //   }

  //   const customerid = response.result2[0]
  //   const customerName = response.result3[0]
  //   const location = response.result4[0]
  //   const amountList = response.result5
  //   const lguList = response.result6
  //   const dpwhList = response.result7
  //   const boList = response.result8
  //   const codeList = response.result9

  //   const today = await getDateTime()
  //   const formattedDate = dayjs(today).format('YYYY-MM-DD')
  //   const formattedDatewithTime = dayjs(today).format('YYYY-MM-DD HH:mm:ss')

  //   if (BACKEND.includes('localhost')) {
  //     for (let i = 0; i < response.result.length; i++) {
  //       await postApi('4cd315b87a-5eac74e8cd', {
  //         data: application,
  //         data2: formattedDate,
  //         data3: customerid,
  //         data4: customerName,
  //         data5: location,
  //         data6: codeList[i],
  //         data7: amountList[i],
  //         data8: assessor(),
  //         data9: formattedDatewithTime,
  //         data10: lguList[i],
  //         data11: dpwhList[i],
  //         data12: boList[i],
  //         data13: PUBLICIP,
  //       })
  //     }
  //   } else {
  //     for (let i = 0; i < response.result.length; i++) {
  //       await postApi('4cd315b87a-dd1854c8df', {
  //         data: application,
  //         data2: formattedDate,
  //         data3: customerid,
  //         data4: customerName,
  //         data5: location,
  //         data6: codeList[i],
  //         data7: amountList[i],
  //         data8: assessor(),
  //         data9: formattedDatewithTime,
  //         data10: lguList[i],
  //         data11: dpwhList[i],
  //         data12: boList[i],
  //         data13: PUBLICIP,
  //       })
  //     }
  //   }
  // }

  // const checkPops = async (application: string) => {
  //   const response = await getApi('check-popsrecord', application)
  //   const result = response

  //   return parseInt(result) > 0
  // }

  // const calculateAmounts = () => {
  //   const amounts: string[] = amountList()
  //   let gflguList: number[] = []
  //   let gfdpwhList: number[] = []
  //   let tfboList: number[] = []

  //   for (let i = 0; i < amounts.length; i++) {
  //     const gflgu = parseFloat(amounts[i]) * 0.8
  //     const gfdpwh = parseFloat(amounts[i]) * 0.05
  //     const tfbo = parseFloat(amounts[i]) * 0.15

  //     const roundedGflgu = parseFloat(gflgu.toFixed(2))
  //     const roundedGfdpwh = parseFloat(gfdpwh.toFixed(2))
  //     const roundedTfbo = parseFloat(tfbo.toFixed(2))

  //     gflguList.push(roundedGflgu)
  //     gfdpwhList.push(roundedGfdpwh)
  //     tfboList.push(roundedTfbo)
  //   }

  //   setGflgu(gflguList)
  //   setGfdpwh(gfdpwhList)
  //   setTfbo(tfboList)
  // }

  const closeNotification = async (application: string) => {
    setApproved(false)
    // await reloadExcept(application)
  }

  const removeEmployee = () => {
    $logged_in.delete()
    $login_role.delete()
    $login_name.delete()
    $login_id.delete()
  }

  const checkLogged = async () => {
    const logged = $logged_in.get()
    const loginName = $login_name.get()
    const loginId = $login_id.get()
    const loginRole = $login_role.get()

    setEmployeeId(parseInt(loginId!))
    setEmployeeName(loginName!)

    loggedin = logged ? true : false

    if (!loggedin) {
      console.log('a')
      removeEmployee()
      navigate('/esign', { replace: true })
      return false
    }
    return true
  }

  const geteSignId = async () => {
    try {
      const [response] = await getApi('773ed4450f9a5809fad7', ID)
      return response.result
    } catch {
      return 0
    }
  }

  // const postTransaction = async () => {
  //   const id = await geteSignId()
  //   const today = await getDateTime()
  //   const formattedDate = dayjs(today).format('YYYY-MM-DD HH:mm:ss')

  //   await postApi('4cd315b87a-781a6781ad', { data: parseInt(id), data2: approvedApplication(), data3: formattedDate })
  // }

  // const updateDocflow = async (division: string, application: string, status: string) => {
  //   await postApi(`update-docflow-${division}`, { data: status, data2: application })
  //   if (division === 'electrical') {
  //     await postApi('48e0a71f62-0604d816c0', { data: status, data2: application })
  //   } else if (division === 'mechanical') {
  //     await postApi('48e0a71f62-d465ed3536', { data: status, data2: application })
  //   } else if (division === 'occupancy') {
  //     await postApi('48e0a71f62-12e025162c', { data: status, data2: application })
  //   }
  // }

  // const refresh = async (division: string) => {
  //   if (division === 'electrical') {
  //     await load('electrical')
  //   } else if (division === 'occupancy') {
  //     await load('occupancy')
  //   } else if (division === 'mechanical') {
  //     await load('mechanical')
  //   } else {
  //     await load('all')
  //   }
  // }

  const checkIfApprovalOccupancy = async (application: string, status: string) => {
    const response = await getApi('e9b9c18b8b915066aa83', status, application)
    return response
  }

  // const checkCurrentPassword = async () => {
  //   const encCurrentPasswordV1 = await securePassword(configPassword(), 'v1')
  //   const encCurrentPasswordV2 = await securePassword(configPassword(), 'v2')

  //   if (encCurrentPasswordV1 === configEncPassword() || encCurrentPasswordV2 === configEncPassword()) {
  //     if (configNewPassword() === '') {
  //       setConfigError('New Password not provided')
  //       setConfigNewEncPassword('')
  //     } else {
  //       setConfigError('')
  //       encryptNewPassword()
  //     }
  //   } else {
  //     setConfigError('Invalid Password')
  //     setConfigNewEncPassword('')
  //   }
  // }

  // const encryptNewPassword = async () => {
  //   const encNewPassword = await securePassword(configNewPassword(), 'v2')
  //   setConfigNewEncPassword(encNewPassword)
  // }

  const convertBase64 = (blob: Blob) => {
    return new Promise((resolve, _) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  }

  // const saveConfig = async () => {
  //   let base64image = ''
  //   if (configNewName() !== '') await saveNewName(parseInt(ID), configNewName())
  //   if (configNewPassword() !== '') await saveNewPassword(parseInt(ID), configNewEncPassword())

  //   if (file() !== undefined) {
  //     const blob = new Blob(file())
  //     const base64 = await convertBase64(blob)
  //     base64image = base64 as string

  //     await saveNewSignature(parseInt(employeeId().toString()), base64image)
  //   }

  //   setConfigNotification(true)
  // }

  // const saveNewName = async (name: string) => {
  //   await postApi('update-name', {
  //     data: parseInt(ID),
  //     data2: name
  //   })
  // }

  // const saveNewPassword = async (password: string) => {
  //   await postApi('update-password', {
  //     data: parseInt(ID),
  //     data2: password
  //   })
  // }

  const logout = async () => {
    removeEmployee()
    navigate('/esign')
  }

  // const updateHeadName = async () => {
  //   const response = await getApi('5a211530266757b41510')

  //   setEmployeeName(response!)
  // }

  // const closeConfig = async () => {
  //   await updateHeadName()
  //   setConfigNotification(false)
  //   setOpenConfig(false)

  //   setConfigEncPassword('')
  //   setConfigNewName('')
  //   setConfigPassword('')
  //   setConfigNewPassword('')
  //   setConfigNewEncPassword('')
  //   setConfigError('')
  // }

  const closeInfo = async () => {
    setSelectedApplication('')
    setSelectedName('')
    setSelectedLocation('')
    setSelectedType('')
    setSelectedAssessor('')
    setSelectedTotal('')
    setSelectedDate('')

    setShowDetails(false)
  }

  const init = async () => {
    checkLogged()

    // const logged = await checkLogged()
    // if (logged) {
    //   await load('all')
    // }
  }

  onSettled(() => {
    flush()
    init()
  })

  // createEffect(() => {
  //   if (configPassword() !== '') {
  //     checkCurrentPassword()
  //   } else {
  //     checkCurrentPassword()
  //   }

  //   if (configNewPassword() !== '') {
  //     encryptNewPassword()
  //   } else {
  //     encryptNewPassword()
  //   }
  // })

  return (
    <Page title='e-Sign - Approval' font='roboto'>
      <Row content='split'>
        <Row content='left' gap={2}>
          <Image name='esign' size={160} />
          <h1>OCBO e-Sign</h1>
        </Row>

        <Clickable onClick={logout}>
          <Row gap={0.25}>
            <FiLogOut size={20} />
            <span>Logout</span>
          </Row>
        </Clickable>
      </Row>
    </Page>
  )
}
