import dayjs from 'dayjs'
import { createSignal, onSettled, Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { FiLogOut } from 'solid-icons/fi'
import { VsRefresh } from 'solid-icons/vs'
import { FaSolidThumbsUp, FaSolidUserGear } from 'solid-icons/fa'
import { Box, Button, Clickable, Column, Input, Modal, Padding, Page, Row, Image, Background, File, LoadingScreen } from '@dasig'
import { getApi, postApi, deleteApi } from '@dasig/api'
import { checkConnection, getDateTime, lockData, securePassword, saveNewSignature, saveNewName, saveNewPassword, getPassword, getListForApproval, checkPage, voidPopsApi, statusPopsApi } from 'services'
import { $logged_in, $login_role, $login_name, $login_id } from 'cache/login'
import { $head_id } from 'cache/head'
import { _listElectricalApplications, _listElectricalNames, _listMechanicalApplications, _listMechanicalNames, _listOccupancyApplications, _listOccupancyNames } from 'stores/prefetch'
import './approval.sass'

import EsignCard from 'components/EsignCard'
import api from 'configs/api.config.json'
import { RiDocumentFileCloseFill } from 'solid-icons/ri'

export default () => {
  const PESO = import.meta.env.VITE_PESO
  const ID = $head_id.get()!
  const PUBLICIP = import.meta.env.VITE_PUBLICIP
  const BACKEND = api.backend.url

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
  const [applicationListElectricalFiltered, setApplicationListElectricalFiltered] = createSignal<string[]>([])
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
  const [filtered, setFiltered] = createSignal('')

  let bldgadditional = false
  let loggedin = false
  let filter = ''

  const getListForApprovalElectrical = async () => {
    const prefetchedElectricalApplications = _listElectricalApplications.get()
    const prefetchedElectricalNames = _listElectricalNames.get()

    if (prefetchedElectricalApplications && prefetchedElectricalApplications.length > 0) {
      setApplicationListElectrical(prefetchedElectricalApplications)
      setNameListElectrical(prefetchedElectricalNames)
      return
    }

    const [applications, names] = await getListForApproval('electrical')
    setApplicationListElectrical(applications)
    setNameListElectrical(names)
  }

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

  const load = async (division: string) => {
    setIsLoading(true)
    setConnected(await checkConnection())
    if (connected() === false) {
      setErrorMessage('Failed to fetch application list')
      return
    }

    setLoadingText('Getting List for Approval')

    const loggedid = $login_id.get()!
    const password = await getPassword(loggedid)
    setConfigEncPassword(password)

    if (division === 'electrical') {
      await getListForApprovalElectrical()
    } else if (division === 'occupancy') {
      // await getListForApprovalOccupancy()
    } else if (division === 'mechanical') {
      // getListForApprovalMechanical()
    } else {
      await getListForApprovalElectrical()
      // getListForApprovalOccupancy()
      // getListForApprovalMechanical()
    }

    setIsLoading(false)
  }

  const reloadExcept = async (application: string) => {
    const newApplicationListElectrical = applicationListElectrical().filter((item) => item !== application)
    const applicationIndexElectrical = applicationListElectrical().findIndex((x) => x === application)
    const newNameListElectrical = nameListElectrical()
      .map((item, index) => (index === applicationIndexElectrical ? null : item))
      .filter((item) => item !== null)

    setApplicationListElectrical(newApplicationListElectrical)
    setNameListElectrical(newNameListElectrical)

    const newApplicationListMechanical = applicationListMechanical().filter((item) => item !== application)
    const applicationIndexMechanical = applicationListMechanical().findIndex((x) => x === application)
    const newNameListMechanical = nameListMechanical()
      .map((item, index) => (index === applicationIndexMechanical ? null : item))
      .filter((item) => item !== null)

    setApplicationListMechanical(newApplicationListMechanical)
    setNameListMechanical(newNameListMechanical)

    const newApplicationListOccupancy = applicationListOccupancy().filter((item) => item !== application)
    const applicationIndexOccupancy = applicationListOccupancy().findIndex((x) => x === application)
    const newNameListOccupancy = nameListOccupancy()
      .map((item, index) => (index === applicationIndexOccupancy ? null : item))
      .filter((item) => item !== null)

    setApplicationListOccupancy(newApplicationListOccupancy)
    setNameListOccupancy(newNameListOccupancy)
  }

  const getopdetailsCard = async (division: string, applicationNo: string) => {
    let op: any
    setDivision(division)

    if (division === 'electrical') {
      ;[op] = await getApi('94e46bde0e2a857ed33a', applicationNo)
    } else if (division === 'mechanical') {
      ;[op] = await getApi('ab0aec88a5615fd28f48', applicationNo)
    } else if (division === 'occupancy') {
      ;[op] = await getApi('28f6c55c9123e46460ff', applicationNo)
    }

    if (isDetailsComplete(op.result, op.result2, op.result3, op.result4, op.result5, op.result6)) {
      setIsIncomplete(false)
      setSelectedApplication(applicationNo)
      setSelectedName(op.result7[0])
      setSelectedLocation(op.result[0])
      setSelectedType(op.result2[0])
      setSelectedAssessor(op.result3[0])
      const total = calculateTotal(op.result4)
      const formattedTotal = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(total)
      setSelectedTotal(formattedTotal)
      setSelectedDate(dayjs(op.result5[0]).format('MMMM DD, YYYY'))
      setApplicationId(op.result6[0])
    } else {
      setIsIncomplete(true)
    }
  }

  const isDetailsComplete = (result: string[], result2: string[], result3: string[], result4: string[], result5: string[], result6: string[]) => {
    return result.length > 0 && result2.length > 0 && result3.length > 0 && result4.length > 0 && result5.length > 0 && result6.length > 0 ? true : false
  }

  const calculateTotal = (list: number[]) => {
    const total = list.map((item) => parseFloat(item.toString())).reduce((acc, curr) => acc + curr, 0)
    return total
  }

  const approveHandler = async (division: string, application: string) => {
    let signed: boolean = false
    let forprinting: boolean = false
    let updateOrderofpayment: boolean = false

    let popsExist: boolean = false
    let popsPaid: boolean = false

    setConnected(await checkConnection())
    if (connected() === false) {
      setErrorMessage('No Connection on Server')
      return
    }

    setIsLoading(true)
    setLoadingText('Checking POPS record')

    if (BACKEND.includes('localhost')) {
      const status = await checkStatusPopsLocal(application)
      if (status.result > 0) popsExist = true
      if (status.result2 > 0) popsPaid = true
    } else {
      const status = await statusPopsOp(application)
      if (status.message === 'Success') popsExist = true
      if (status.pops_paid === true) popsPaid = true
    }

    if (popsExist) {
      if (popsPaid) {
        setIsLoading(false)
        setPostError(true)
        setErrorMessage('Application Already Paid')
        return
      } else {
        if (BACKEND.includes('localhost')) {
          setLoadingText('Clearing unpaid POPS record')
          const voidOP = await voidPopsOpLocal(application)

          if (!voidOP) {
            setIsLoading(false)
            setPostError(true)
            setErrorMessage('POPS Record found but failed to void')
            return
          }
        } else {
          setLoadingText('Clearing unpaid POPS record')
          const voidOP = await voidPopsOp(application)

          if (voidOP.toUpper().includes('ERROR')) {
            setIsLoading(false)
            setPostError(true)
            setErrorMessage('POPS Record found but failed to void')
            return
          }
        }
        setIsLoading(false)
        setPostError(true)
        setErrorMessage(`A potential duplicate was found for ${application}; please contact IT to fix it`)
        return
      }
    }

    setLoadingText('Posting new record to POPS')
    await postPops(division, application)

    setLoadingText(`Approving ${application}`)
    const dataLocked = await lockOpData(division, application)

    if (dataLocked) {
      if (division === 'electrical') {
        setLoadingText(`Pushing ${application} for printing`)
        signed = await setNewStatus(division, 'ELECTRICAL ORDER OF PAYMENT APPROVED AND SIGNED', '170', 'ELECOPAPPROVEDSIGNED', 1)
        updateDocflow(division, application, 'FOR ELECTRICAL ORDER OF PAYMENT APPROVAL')
        if (!signed) return

        forprinting = await setNewStatus(division, 'FOR ELECTRICAL ORDER OF PAYMENT PRINTING', '95', 'ELECOPPRINT', 0)
        if (!forprinting) return

        updateOrderofpayment = await updateOp(division)

        if (updateOrderofpayment) {
          setLoadingText('Adding new transaction record')
          await postTransaction()
          setApprovedApplication(application)
          setApproved(true)
        }
      } else if (division === 'occupancy') {
        setLoadingText('Checking for building additionals')
        const [additionalResult] = await getApi('316badad46015679b94e', application)
        bldgadditional = additionalResult.result > 0

        signed = await setNewStatus(division, 'OCCUPANCY ORDER OF PAYMENT APPROVED AND SIGNED', '172', 'OCCOPAPPROVEDSIGNED', 1)
        updateDocflow(division, application, 'FOR OCCUPANCY RECOMMENDING APPROVAL')
        if (bldgadditional) {
          const neededToUpdate = await checkIfApprovalOccupancy(application, 'FOR ADDITIONAL ORDER OF PAYMENT RECOMMENDING APPROVAL')
          if (!neededToUpdate) updateDocflow(division, application, 'FOR ADDITIONAL ORDER OF PAYMENT RECOMMENDING APPROVAL')
        }
        if (!signed) return

        forprinting = await setNewStatus(division, 'APPROVED FOR PRINTING OF BUREAU OF FIRE AND ORDER OF PAYMENT', '23', 'OCORDEROFPAYMENT', 0)
        if (!forprinting) return

        updateOrderofpayment = await updateOp(division)

        if (updateOrderofpayment) {
          setLoadingText('Adding new transaction record')
          await postTransaction()
          setApprovedApplication(application)
          setApproved(true)
        }
      } else if (division === 'mechanical') {
        setLoadingText(`Pushing ${application} for printing`)
        signed = await setNewStatus(division, 'MECHANICAL ORDER OF PAYMENT APPROVED AND SIGNED', '175', 'MECHCOPAPPROVEDSIGNED', 1)

        updateDocflow(division, application, 'FOR MECHANICAL ORDER OF PAYMENT APPROVAL')
        if (!signed) return

        forprinting = await setNewStatus(division, 'FOR MECHANICAL ORDER OF PAYMENT PRINTING', '112', 'MECHOPPRINT', 0)
        if (!forprinting) return

        updateOrderofpayment = await updateOp(division)

        if (updateOrderofpayment) {
          setLoadingText('Adding new transaction record')
          postTransaction()
          setApprovedApplication(application)
          setApproved(true)
        }
      }
    } else {
      setIsLoading(false)
      setPostError(true)
      setErrorMessage('Error on posting on POPS Server, please try again')
      return
    }
    setIsLoading(false)
  }

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

  const lockOpData = async (division: string, application: string) => {
    let dataToLock
    if (division === 'electrical') {
      ;[dataToLock] = await getApi('8c72fe205d3cba3d417c', application)
    } else if (division === 'mechanical') {
      ;[dataToLock] = await getApi('60c54d25f24c9aa3c446', application)
    } else if (division === 'occupancy') {
      ;[dataToLock] = await getApi('74c13dcb597ce97f6193', application)
    }
    const lockedData = await lockData(dataToLock.result)
    const fixedLockedData = lockedData.replace(/\//g, '~')
    const saveLockedData = await postApi('8c019ea819-531f73875c', { data: application, data2: fixedLockedData })
    return saveLockedData
  }

  const voidPopsOp = async (application: string) => {
    const response = await voidPopsApi(application)
    return response
  }

  const voidPopsOpLocal = async (application: string) => {
    const response = await deleteApi('fe377458d5-527793ef64', { data: application })
    return response
  }

  const checkStatusPopsLocal = async (application: string) => {
    const [response] = await getApi('1431ee20d8f6a0a03c74', application)
    return response
  }

  const statusPopsOp = async (application: string) => {
    const response = await statusPopsApi(application)
    return response
  }

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
  //   let id
  //   if (division === 'electrical') {
  //     ;[id] = await getApi('76cce54882da3d8015cf', application)
  //   } else if (division === 'mechanical') {
  //     ;[id] = await getApi('112305fae2fb0443d595', application)
  //   } else if (division === 'occupancy') {
  //     ;[id] = await getApi('1f2977b2ed8e267ab533', application)
  //   } else if (division === 'building') {
  //     ;[id] = await getApi('bbab4662f5d5054aa663', application)
  //   }
  //   return parseInt(id.result)
  // }

  // const deleteOrderofPayment = async (division: string, id: number) => {
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
    const today = await getDateTime()
    const formattedDate = dayjs(today).format('YYYY-MM-DD HH:mm:ss')
    const statusid = parseInt(applicationId().toString())

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

  const postPops = async (division: string, application: string) => {
    let response

    if (division === 'electrical') {
      ;[response] = await getApi('935758ca840c20723c72', application)
    } else if (division === 'mechanical') {
      ;[response] = await getApi('7cff1c47fd874ce8eefc', application)
    } else if (division === 'occupancy') {
      ;[response] = await getApi('bee657d5fb112e8fade9', application)
    }

    const customerid = response.result2[0]
    const customerName = response.result3[0]
    const location = response.result4[0]
    const amountList = response.result5
    const lguList = response.result6
    const dpwhList = response.result7
    const boList = response.result8
    const codeList = response.result9

    const today = await getDateTime()
    const formattedDate = dayjs(today).format('YYYY-MM-DD')
    const formattedDatewithTime = dayjs(today).format('YYYY-MM-DD HH:mm:ss')

    if (BACKEND.includes('localhost')) {
      for (let i = 0; i < response.result.length; i++) {
        await postApi('4cd315b87a-5eac74e8cd', {
          data: application,
          data2: formattedDate,
          data3: customerid,
          data4: customerName,
          data5: location,
          data6: codeList[i],
          data7: amountList[i],
          data8: assessor(),
          data9: formattedDatewithTime,
          data10: lguList[i],
          data11: dpwhList[i],
          data12: boList[i],
          data13: PUBLICIP,
        })
      }
    } else {
      for (let i = 0; i < response.result.length; i++) {
        await postApi('4cd315b87a-dd1854c8df', {
          data: application,
          data2: formattedDate,
          data3: customerid,
          data4: customerName,
          data5: location,
          data6: codeList[i],
          data7: amountList[i],
          data8: assessor(),
          data9: formattedDatewithTime,
          data10: lguList[i],
          data11: dpwhList[i],
          data12: boList[i],
          data13: PUBLICIP,
        })
      }
    }
  }

  const closeNotification = async (application: string) => {
    setApproved(false)
    await reloadExcept(application)
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
    // const loginRole = $login_role.get()

    setEmployeeId(parseInt(loginId!))
    setEmployeeName(loginName!)

    loggedin = logged === 'true' ? true : false

    if (!loggedin) {
      removeEmployee()
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

  const postTransaction = async () => {
    const id = await geteSignId()
    const today = await getDateTime()
    const formattedDate = dayjs(today).format('YYYY-MM-DD HH:mm:ss')

    await postApi('4cd315b87a-781a6781ad', { data: parseInt(id), data2: approvedApplication(), data3: formattedDate })
  }

  const updateDocflow = async (division: string, application: string, status: string) => {
    // await postApi(`update-docflow-${division}`, { data: status, data2: application })
    if (division === 'electrical') {
      await postApi('48e0a71f62-0604d816c0', { data: status, data2: application })
    } else if (division === 'mechanical') {
      await postApi('48e0a71f62-d465ed3536', { data: status, data2: application })
    } else if (division === 'occupancy') {
      await postApi('48e0a71f62-12e025162c', { data: status, data2: application })
    }
  }

  const refresh = async (division: string) => {
    if (division === 'electrical') {
      await load('electrical')
    } else if (division === 'occupancy') {
      await load('occupancy')
    } else if (division === 'mechanical') {
      await load('mechanical')
    } else {
      await load('all')
    }
  }

  const checkIfApprovalOccupancy = async (application: string, status: string) => {
    const [response] = await getApi('e9b9c18b8b915066aa83', status, application)
    return response.result
  }

  const checkCurrentPassword = async () => {
    const encCurrentPassword = await securePassword(configPassword())

    if (encCurrentPassword === configEncPassword()) {
      if (configNewPassword() === '') {
        setConfigError('Please provide new password')
        setConfigNewEncPassword('')
      } else {
        setConfigError('')
        encryptNewPassword()
      }
    } else {
      setConfigError('Invalid Password')
      setConfigNewEncPassword('')
    }
  }

  const encryptNewPassword = async () => {
    const encNewPassword = await securePassword(configNewPassword())
    setConfigNewEncPassword(encNewPassword)
  }

  const convertBase64 = (blob: Blob) => {
    return new Promise((resolve, _) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  }

  const filterList = async (filter: string) => {
    const items = applicationListElectrical()
    const filteredApplications = items.filter((item: string) => item.includes(filter))

    setFiltered(filter)

    if (filter.length !== 0 && filteredApplications.length > 0) {
      setApplicationListElectrical(filteredApplications)
    } else if (filter.length !== 0 && filteredApplications.length === 0) {
      setApplicationListElectrical([])
    } else {
      await load('electrical')
    }
  }

  const saveConfig = async () => {
    let base64image = ''
    if (configNewName() !== '') await saveNewName(parseInt(ID), configNewName())
    if (configNewPassword() !== '') await saveNewPassword(parseInt(ID), configNewEncPassword())

    if (file() !== undefined) {
      const blob = new Blob(file())
      const base64 = await convertBase64(blob)
      base64image = base64 as string

      await saveNewSignature(parseInt(employeeId().toString()), base64image)
    }
    setConfigNotification(true)
  }

  const logout = async () => {
    removeEmployee()
    navigate('/esign')
  }

  const updateHeadName = async () => {
    const [response] = await getApi('5a211530266757b41510')
    setEmployeeName(response.result)
  }

  const closeConfig = async () => {
    await updateHeadName()
    setConfigNotification(false)
    setOpenConfig(false)

    setConfigEncPassword('')
    setConfigNewName('')
    setConfigPassword('')
    setConfigNewPassword('')
    setConfigNewEncPassword('')
    setConfigError('')
  }

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
    await checkPage()
    const logged = await checkLogged()
    if (logged) await load('all')
    else navigate('/esign', { replace: true })
  }

  onSettled(() => {
    void init()
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
    <>
      <Page title='e-Sign - Approval' font='roboto'>
        <Background image='background-esign' />

        <Row content='split'>
          <Row content='left' gap={2}>
            <Image name='esign' size={160} />
            <h1>OCBO e-Sign</h1>
          </Row>

          <Row content='left' gap={1.75}>
            <Box curved thickness={2} padding='1rem 1.5rem' background='#0f131d56' color='rgba(244,255,244,0.2)'>
              <span class='name'>{employeeName()}</span>
            </Box>
            <Clickable onClick={() => setOpenConfig(true)}>
              <Row gap={0.25}>
                <FaSolidUserGear size={20} />
                <span>Config</span>
              </Row>
            </Clickable>
            <Clickable onClick={logout}>
              <Row gap={0.25} margin='0 2rem 0 0'>
                <FiLogOut size={20} />
                <span>Logout</span>
              </Row>
            </Clickable>
          </Row>
        </Row>

        <Row content='split' padding='2rem 1rem 0 1rem'>
          <Row gap={0.5}>
            <span class='application-counter'>{applicationListElectrical().length}</span>
            <span class='application-counter__text'>{`${applicationListElectrical().length > 1 ? 'Electrical Applications' : 'Electrical Application'}`}</span>
          </Row>
          <Row gap={0.5}>
            <Input value={filter} onChange={(app) => filterList(app as string)} placeholder='Filter Application' width='18rem' />
            <Button corner='curved' design='bootstrap-primary' icon={VsRefresh} onClick={() => refresh('electrical')} noLabel />
          </Row>
        </Row>

        <Row>
          <Show when={isLoading()}>
            <Padding top={2}>
              <Column gap={1}>
                <LoadingScreen text={loadingText()} image='esign-boxonly-white' imageSize={96} animation='rotate' />
              </Column>
            </Padding>
          </Show>

          <Show when={!isLoading()}>
            <Show when={applicationListElectrical().length > 0}>
              <Row gap={1} padding='2rem 0 0 0'>
                {applicationListElectrical().map((item: string, index: number) => (
                  <EsignCard
                    division='Electrical'
                    applicationNo={item}
                    name={nameListElectrical()[index]}
                    onClick={async () => {
                      setShowDetails(true)
                      await getopdetailsCard('electrical', item)
                    }}
                  ></EsignCard>
                ))}
              </Row>
            </Show>

            <Show when={applicationListElectrical().length === 0}>
              <Padding top={2} bottom={0} left={0} right={0}>
                <Box thickness={1} padding='4rem 2rem' curved color='rgba(250, 250, 250, 0.3)'>
                  <Column gap={1}>
                    <RiDocumentFileCloseFill size={50} />
                    <Show when={filter.length !== 0}>
                      <span>No electrical applications available for approval</span>
                    </Show>
                    <Show when={filter.length === 0}>
                      <span>No electrical applications containing {filtered()}</span>
                    </Show>
                  </Column>
                </Box>
              </Padding>
            </Show>
          </Show>
        </Row>
      </Page>

      <div onClick={() => closeNotification(approvedApplication())}>
        <Modal trigger={approved()} background='#123220ff' color='#cdfbe1f0' opacity={0.8}>
          <Padding top={1} bottom={1} left={2} right={2}>
            <Column>
              <Row gap={4}>
                <FaSolidThumbsUp size={75} />
                <Box curved thickness={3} color='#cdfbe1f0' padding='1rem'>
                  <span class='approval'>Approved</span>
                </Box>
              </Row>
              <Row padding='2rem 0 0 0'>
                <h2>{approvedApplication()}</h2>
              </Row>

              <Row>
                <span class='close-text'>Click anywhere to proceed</span>
              </Row>
            </Column>
          </Padding>
        </Modal>
      </div>

      <Modal trigger={openConfig()} background='#16212c' color='#ffffffed' opacity={0.8} width='32rem' animation='appear-from-top'>
        <Padding top={1} bottom={1} left={0.1}>
          <section class='config'>
            <div class='config__row'>
              Name:
              <span class='config__row__name'>{employeeName()}</span>
            </div>

            <div class='config__edit'>
              <span class='config__edit__title'>Change Displayed Name</span>
              <Input value={configNewName()} onChange={setConfigNewName} placeholder='Enter new name' width='30.5rem' />
              <span class='config__edit__info'>Leave blank to remain unchanged.</span>
            </div>

            <div class='config__edit'>
              <span class='config__edit__title'>Change Password</span>
              <Input type='password' value={configPassword()} onChange={setConfigPassword} placeholder='Enter current password' width='30.5rem' />
              <Input type='password' value={configNewPassword()} onChange={setConfigNewPassword} placeholder='Enter new password' width='30.5rem' />

              <Show when={configNewPassword().length !== 0}>
                <span style='padding: 1.75rem 0 0 0'>Current Encrypted Password:</span>
                <span>{configEncPassword()}</span>

                <span style='padding: 0.75rem 0 0 0'>New Encrypted Password:</span>
                <span>{configNewEncPassword()}</span>
              </Show>
            </div>

            <div class='config__edit'>
              <span class='config__edit__title'>Change Signature</span>
              <File maxFiles={1} onFileAccept={(data) => setFile(data)} accept='.jpg, .jpeg, .png, .webp, .avif' onClick={() => setFile()} label='Drag and drop or click to upload file' buttonText='Delete' />
            </div>

            <Show when={configError() !== ''}>
              <span class='required-config'>{configError()}</span>
              <Button label='Cancel' corner='curved' design='bootstrap-danger' onClick={() => setOpenConfig(false)} width='100%' />
            </Show>

            <div class='config__button'>
              <Show when={configError() === ''}>
                <Button label='Confirm' corner='curved' design='bootstrap-primary' onClick={saveConfig} width='100%' />
                <Button label='Cancel' corner='curved' design='bootstrap-danger' onClick={() => setOpenConfig(false)} width='100%' />
              </Show>
            </div>
          </section>
        </Padding>
      </Modal>

      <div onClick={closeConfig}>
        <Modal trigger={configNotification() === true} background='#123220ff' color='#cdfbe1f0' opacity={0.8}>
          <Padding top={1} bottom={1} left={4} right={4}>
            <Column>
              <Row gap={4}>
                <Box curved thickness={3} color='#cdfbe1f0' padding='1rem'>
                  <span class='approval'>Account Updated</span>
                </Box>
              </Row>

              <Row>
                <span class='close-text'>Click anywhere to close</span>
              </Row>
            </Column>
          </Padding>
        </Modal>
      </div>

      <div onClick={() => setPostError(false)}>
        <Modal trigger={postError() === true} background='#562020ff' color='#ffebebe6' opacity={0.8} animation='appear-from-top'>
          <Padding top={1} bottom={1} left={4} right={4}>
            <Column>
              <Row>
                <Box curved thickness={3} color='#ffebebe6' padding='1rem'>
                  <h2>Approval and Signing Error</h2>
                </Box>
              </Row>

              <Row>
                <h3>{errorMessage()}</h3>
              </Row>

              <Row>
                <span class='close-text'>Click anywhere to close</span>
              </Row>
            </Column>
          </Padding>
        </Modal>
      </div>

      <div onClick={closeInfo}>
        <Modal trigger={showDetails() === true} background='#121e2acc' color='#ffffffec' width='360px' animation='appear-from-top'>
          <Show when={isIncomplete()}>
            <Padding top={0} left={2} right={2} bottom={0}>
              <span class='modal__application-number'>{selectedApplication()}</span>

              <Padding top={1} left={0} right={0} bottom={0}>
                <Column padding='0 0 1rem 0'>
                  <Box curved thickness={3} color='#c85656' padding='1rem'>
                    <h2 class='incomplete__error'>Signing Error</h2>
                  </Box>
                  <h3 class='incomplete__error'>Missing Data Detected</h3>
                </Column>

                <div class='incomplete'>
                  <Column>
                    <span class='incomplete__text'>Some required information is missing from the application details</span>
                    <span class='incomplete__text'>Please return to Assessment to complete the required fields</span>
                  </Column>
                </div>
              </Padding>
              <Column padding='1rem 0 0 0'>
                <Button width='100%' label='Return to Assessment' corner='curved' design='bootstrap-primary' onClick={() => console.log("returnAssessment('electrical item)")} />
                <span class='modal__cancel'>Click anywhere to cancel</span>
              </Column>
            </Padding>
          </Show>

          <Show when={!isIncomplete()}>
            <Row content='center' gap={1}>
              <Box curved thickness={1} color='rgba(244,244,244,0.1)' background='transparent' padding='1rem' width='100%'>
                <Show when={selectedApplication() !== ''}>
                  <span class='modal-card__application-number'>{selectedApplication()}</span>
                </Show>
                <Show when={selectedApplication() === ''}>
                  <span class='modal-card__application-number'>----------</span>
                </Show>

                <Padding top={1}>
                  <section class='modal-card__row'>
                    <span class='modal-card__row__label'>Name of Applicant:</span>
                    <Show when={selectedName() !== ''}>
                      <span class='modal-card__row__detail'>{selectedName()} </span>
                    </Show>
                    <Show when={selectedName() === ''}>
                      <span class='modal-card__row__detail'>-------------------</span>
                    </Show>
                  </section>

                  <section class='modal-card__row'>
                    <span class='modal-card__row__label'>Location:</span>
                    <Show when={selectedLocation() !== ''}>
                      <span class='modal-card__row__detail'>{selectedLocation()}</span>
                    </Show>
                    <Show when={selectedLocation() === ''}>
                      <span class='modal-card__row__detail'>-------------------</span>
                    </Show>
                  </section>

                  <section class='modal-card__row'>
                    <span class='modal-card__row__label'>Type:</span>
                    <Show when={selectedType() !== ''}>
                      <span class='modal-card__row__detail'>{selectedType().toUpperCase()}</span>
                    </Show>
                    <Show when={selectedType() === ''}>
                      <span class='modal-card__row__detail'>-------------------</span>
                    </Show>
                  </section>

                  <section class='modal-card__row'>
                    <span class='modal-card__row__label'>Assessed By:</span>
                    <Show when={selectedAssessor() !== ''}>
                      <span class='modal-card__row__detail'>{selectedAssessor()}</span>
                    </Show>
                    <Show when={selectedAssessor() === ''}>
                      <span class='modal-card__row__detail'>-------------------</span>
                    </Show>
                  </section>

                  <section class='modal-card__row'>
                    <span class='modal-card__row__label'>Date Assessed:</span>
                    <Show when={selectedDate() !== ''}>
                      <span class='modal-card__row__detail'>{selectedDate().toUpperCase()}</span>
                    </Show>
                    <Show when={selectedDate() === ''}>
                      <span class='modal-card__row__detail'>-------------------</span>
                    </Show>
                  </section>

                  <section class='modal-card__row'>
                    <span class='modal-card__row__label'>Total Fee:</span>

                    <Show when={selectedTotal() !== ''}>
                      <span class='modal-card__row__detail__price'>
                        {PESO} {selectedTotal()}
                      </span>
                    </Show>
                    <Show when={selectedTotal() === ''}>
                      <span class='modal-card__row__detail__price'>{PESO} --.--</span>
                    </Show>
                  </section>
                </Padding>

                <Column padding='2rem 0 0 0'>
                  <Show when={selectedApplication() !== ''}>
                    <Button width='100%' label='Approve' corner='curved' design='bootstrap-primary' onClick={() => approveHandler(division(), selectedApplication())} />
                    {/*<Button width='100%' label='Approve' corner='curved' design='bootstrap-primary' />*/}
                  </Show>
                  <Show when={selectedApplication() === ''}>
                    <span class='loading-data'>Loading data, please wait</span>
                  </Show>

                  <span class='modal-card__cancel'>Click anywhere to cancel</span>
                </Column>
              </Box>
            </Row>
          </Show>
        </Modal>
      </div>

      <div onClick={() => setPostError(false)}>
        <Modal trigger={postError() === true} background='#562020cc' color='#ffebebe6' opacity={0.8} animation='appear-from-top'>
          <Padding top={1} bottom={1} left={4} right={4}>
            <Column>
              <Row>
                <Box curved thickness={3} color='#ffebebe6' padding='1rem'>
                  <h2>Approval and Signing Error</h2>
                </Box>
              </Row>

              <Row>
                <h3>{errorMessage()}</h3>
              </Row>

              <Row>
                <span class='close-text'>Click anywhere to close</span>
              </Row>
            </Column>
          </Padding>
        </Modal>
      </div>
    </>
  )
}
