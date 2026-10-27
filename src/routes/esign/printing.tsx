import dayjs from 'dayjs'
import { Tabs } from '@kobalte/core/tabs'
import { FileField } from '@kobalte/core/file-field'
import { createEffect, createSignal, onCleanup, onSettled, Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { FaSolidThumbsUp, FaSolidUserGear } from 'solid-icons/fa'
import { FiLogOut } from 'solid-icons/fi'
import { VsRefresh } from 'solid-icons/vs'
import { Background, Box, Button, Clickable, Column, Combobox, Input, Image, Modal, Padding, Page, Row } from '@dasig'
import {
  _additional,
  _additionalAmountList,
  _additionalCodeList,
  _additionalFeeList,
  _additionalUnitList,
  _amountList,
  _applicationNo,
  _approvedDate,
  _assessedDate,
  _assessor,
  _assessorid,
  _codeList,
  _date,
  _feeList,
  _floorArea,
  _location,
  _name,
  _optn,
  _signatureApprover,
  _signatureAssessor,
  _totalUnits,
  _type,
  _units,
} from 'stores/pdfinfo'
import { checkConnection, createPdfElectrical, createPdfOccupancy, createPdfMechanical, getDateTime, saveNewName, saveNewPassword, saveNewSignature, securePassword, statusPopsApi, voidPopsApi, checkPage } from 'services'
import { AiOutlineLoading3Quarters } from 'solid-icons/ai'
import { RiDocumentFileCloseFill } from 'solid-icons/ri'
import EsignCard from 'components/EsignCard'

import { _headId } from 'stores/head'
import { $head, $head_id } from 'cache/head'
import { getApi, deleteApi, postApi } from '@dasig/api'
import './printing.sass'
import { $logged_in, $login_id, $login_name } from 'cache/login'

const PESO = import.meta.env.VITE_PESO
const BACKEND = import.meta.env.VITE_BACKEND

export default () => {
  const navigate = useNavigate()
  const [file, setFile] = createSignal<File[]>()

  // const [totalOp, setTotalOp] = createSignal(0)
  // const [assessor, setAssessor] = createSignal('')
  // const [dateOp, setDateOp] = createSignal('')
  // const [location, setLocation] = createSignal('')
  // const [type, setType] = createSignal('')
  const [applicationId, setApplicationId] = createSignal(0)

  const [applicationListElectrical, setApplicationListElectrical] = createSignal<string[]>([])
  const [nameListElectrical, setNameListElectrical] = createSignal<string[]>([])
  const [applicationListOccupancy, setApplicationListOccupancy] = createSignal<string[]>([])
  const [nameListOccupancy, setNameListOccupancy] = createSignal<string[]>([])
  const [applicationListBuilding, setApplicationListBuilding] = createSignal<string[]>([])
  const [nameListBuilding, setNameListBuilding] = createSignal<string[]>([])
  const [applicationListMechanical, setApplicationListMechanical] = createSignal<string[]>([])
  const [nameListMechanical, setNameListMechanical] = createSignal<string[]>([])

  const [errorMessage, setErrorMessage] = createSignal('')
  const [connected, setConnected] = createSignal(true)
  const [printed, setPrinted] = createSignal(false)
  const [printedApplication, setPrintedApplication] = createSignal('')

  const [openConfig, setOpenConfig] = createSignal(false)
  const [configEncPassword, setConfigEncPassword] = createSignal('')
  const [configNewName, setConfigNewName] = createSignal('')
  const [configPassword, setConfigPassword] = createSignal('')
  const [configNewPassword, setConfigNewPassword] = createSignal('')
  const [configNewEncPassword, setConfigNewEncPassword] = createSignal('')
  const [configError, setConfigError] = createSignal('')

  const [configNotification, setConfigNotification] = createSignal(false)

  const [isBuilding, setIsBuilding] = createSignal(false)
  const [isOccupancy, setIsOccupancy] = createSignal(false)
  const [isElectrical, setIsElectrical] = createSignal(false)
  const [isMechanical, setIsMechanical] = createSignal(false)

  const [employeeId, setEmployeeId] = createSignal(0)
  const [employeeName, setEmployeeName] = createSignal('')

  const [filter, setFilter] = createSignal('')

  const listType = ['Print', 'Reprint (No Change)', 'Void (Back to Approval)']
  const [selectedType, setSelectedType] = createSignal('Print')

  const [voidError, setVoidError] = createSignal(false)
  const [isLoading, setIsLoading] = createSignal(false)
  const [loadingText, setLoadingText] = createSignal('')

  const [voidNotification, setVoidNotification] = createSignal(false)

  const [selectedApplication, setSelectedApplication] = createSignal<string>('')
  const [selectedName, setSelectedName] = createSignal<string>('')
  const [selectedLocation, setSelectedLocation] = createSignal<string>('')
  const [selectedTypes, setSelectedTypes] = createSignal<string>('')
  const [selectedAssessor, setSelectedAssessor] = createSignal<string>('')
  const [selectedDate, setSelectedDate] = createSignal<string>('')
  const [selectedTotal, setSelectedTotal] = createSignal<string>('')
  const [showDetails, setShowDetails] = createSignal(false)

  const [division, setDivision] = createSignal('')

  let pageLoaded = false
  let bldgadditional = false

  const checkAccess = async (access: string) => {
    const [response] = await getApi('f54889f1a495bc025dbd', access, employeeId())
    const result = response.result
    if (result > 0) return true
    else return false
  }

  const getPrintDetails = async (division: string, id: number) => {
    let response

    if (selectedType() === 'Print') {
      if (division === 'electrical') {
        ;[response] = await getApi('d4b559313807a7e36ac2', id)
      } else if (division === 'mechanical') {
        ;[response] = await getApi('af6aabfae3c621c2ef9d', id)
      } else if (division === 'occupancy') {
        ;[response] = await getApi('598e37a2d3ef520624c4', id)
      }
    } else {
      if (division === 'electrical') {
        ;[response] = await getApi('2661e689e5e4bdd3bd15', id)
      } else if (division === 'mechanical') {
        ;[response] = await getApi('97ee2bff2f1c8acde640', id)
      }
    }

    const applicationno = response.result
    const date = response.result2
    const location = response.result3
    const name = response.result8
    const type = `${response.result4} - ${response.result5}`
    const assessor = response.result7
    const units = response.result6
    let totalUnits = 0
    let floorArea = 0

    if (division === 'occupancy') {
      totalUnits = response.result9
      floorArea = response.result10

      _totalUnits.set(totalUnits)
      _floorArea.set(floorArea)
    }

    _optn.set(`M${applicationno.split('-')[0]}${applicationno.split('-')[1]}`)
    _applicationNo.set(applicationno)
    _date.set(dayjs(date).format('MMMM DD, YYYY'))
    _name.set(name)
    _location.set(location)
    _type.set(type)
    _assessor.set(assessor)
    _assessorid.set(employeeId())
    _units.set(units)
  }

  const getPrintDetailsFees = async (division: string, id: number) => {
    let response

    if (selectedType() === 'Print') {
      if (division === 'electrical') {
        ;[response] = await getApi('24e54b36a6839124d656', id)
      } else if (division === 'mechanical') {
        ;[response] = await getApi('c059cbc6422a7fbf03d3', id)
      } else if (division === 'occupancy') {
        ;[response] = await getApi('ad40831ec5f67ced2c0f', id)
      }
    } else {
      if (division === 'electrical') {
        ;[response] = await getApi('3f62a629957a34823aab', id)
      } else if (division === 'mechanical') {
        ;[response] = await getApi('638308520f650991708f', id)
      } else if (division === 'occupancy') {
        ;[response] = await getApi('b3cbb6b1ce9cda16fa03', id)
      }
    }

    const feeList = response.result
    const accountCodeList = response.result2
    const amountList = response.result3

    _feeList.set(feeList)
    _codeList.set(accountCodeList)
    _amountList.set(amountList)

    _additional.set(false)

    if (division === 'occupancy' && bldgadditional) {
      const [response] = await getApi('efa81075e2a0c0c12415', id)
      const feeList = response.result
      const accountCodeList = response.result2
      const amountList = response.result3
      const unitList = response.result4

      _additional.set(true)
      _additionalFeeList.set(feeList)
      _additionalCodeList.set(accountCodeList)
      _additionalAmountList.set(amountList)
      _additionalUnitList.set(unitList)
    }
  }

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
    setPrinted(false)
    setVoidNotification(false)

    if (!selectedType().includes('Reprint')) {
      await checkDivision()

      if (isBuilding()) reloadExcept('building', application)
      if (isOccupancy()) reloadExcept('occupancy', application)
      if (isElectrical()) reloadExcept('electrical', application)
      if (isMechanical()) reloadExcept('mechanical', application)
    }
  }

  const reloadExcept = async (division: string, application: string) => {
    if (division === 'electrical') {
      const newApplicationListElectrical = applicationListElectrical().filter((item) => item !== application)
      const applicationIndexElectrical = applicationListElectrical().findIndex((x) => x === application)
      const newNameListElectrical = nameListElectrical()
        .map((item, index) => (index === applicationIndexElectrical ? null : item))
        .filter((item) => item !== null)

      setApplicationListElectrical(newApplicationListElectrical)
      setNameListElectrical(newNameListElectrical)
    } else if (division === 'mechanical') {
      const newApplicationListMechanical = applicationListMechanical().filter((item) => item !== application)
      const applicationIndexMechanical = applicationListMechanical().findIndex((x) => x === application)
      const newNameListMechanical = nameListMechanical()
        .map((item, index) => (index === applicationIndexMechanical ? null : item))
        .filter((item) => item !== null)

      setApplicationListMechanical(newApplicationListMechanical)
      setNameListMechanical(newNameListMechanical)
    } else {
      // const newApplicationListOccupancy = applicationListOccupancy().filter((item) => item !== application)
      // const applicationIndexOccupancy = applicationListOccupancy().findIndex((x) => x === application)
      // const newNameListOccupancy = nameListOccupancy()
      //   .map((item, index) => (index === applicationIndexOccupancy ? null : item))
      //   .filter((item) => item !== null)
      // setApplicationListOccupancy(newApplicationListOccupancy)
      // setNameListOccupancy(newNameListOccupancy)
    }
  }

  const checkDivision = async () => {
    const building = await checkAccess('BUILDING ORDER OF PAYMENT')
    setIsBuilding(building)

    const occupancy = await checkAccess('OCCUPANCY ORDER OF PAYMENT')
    setIsOccupancy(occupancy)

    const electrical = await checkAccess('ELECTRICAL ASSESSMENT')
    setIsElectrical(electrical)

    const mechanical = await checkAccess('MECHANICAL ASSESSMENT')
    setIsMechanical(mechanical)
  }

  // const getopdetails = async (division: string, applicationNo: string) => {
  //   // let op = []
  //   // if (division === 'building') op = await getApi('get-opdetails-building', applicationNo)
  //   // if (division === 'occupancy') op = await getApi('get-opdetails-occupancy', applicationNo)
  //   // if (division === 'electrical') op = await getApi('get-opdetails-electrical', applicationNo)

  //   if (division === 'occupancy') {
  //     let additionalResult
  //     if (selectedType() === 'Print') {
  //       additionalResult = await getApi('3037a5adace94528ccf4', applicationNo)
  //     } else additionalResult = await getApi('60067c5e12316eed92ab', applicationNo)

  //     bldgadditional = additionalResult > 0
  //   }

  //   // const op = await getApi(`get-opdetails-${division}`, applicationNo)
  //   let op
  //   if (division === 'electrical') {
  //     op = await getApi('533b63af79c27bb782f3', applicationNo)
  //   } else if (division === 'mechanical') {
  //     op = await getApi('ab0aec88a5615fd28f48', applicationNo)
  //   } else if (division === 'occupancy') {
  //     op = await getApi('185caa987eba4376ba0d', applicationNo)
  //   }

  //   setLocation(op.result[0])
  //   setType(op.result2[0])
  //   setAssessor(op.result3[0])
  //   setTotalOp(calculateTotal(op.result4))
  //   setDateOp(dayjs(op.result5[0]).format('MMMM DD, YYYY'))
  //   setApplicationId(op.result6[0])

  //   // setAssessorId(op.result12[0])
  //   // setDescriptionList(op.result8)
  //   // setAmountList(op.result9)
  //   // setDateOpList(op.result10)
  //   // calculateAmounts()

  //   getPrintDetails(division, op.result6[0])
  //   getPrintDetailsFees(division, op.result6[0])

  //   getSignatureImage(employeeId())

  //   const approversignId = await geteSignId(276)
  //   getApprovedDate(approversignId, applicationNo)
  //   // const assessorId = await getEmployeeId(op.result7[0])
  //   // const assessorsignId = await geteSignId(assessorId)
  //   getAssessedDate(division, op.result6[0])
  // }

  const getopdetailsCard = async (division: string, applicationNo: string) => {
    setDivision(division)

    if (division === 'occupancy') {
      let additionalResult
      if (selectedType() === 'Print') {
        ;[additionalResult] = await getApi('3037a5adace94528ccf4', applicationNo)
      } else [additionalResult] = await getApi('60067c5e12316eed92ab', applicationNo)

      bldgadditional = additionalResult.result > 0
    }

    let op: any
    if (division === 'electrical') {
      ;[op] = await getApi('94e46bde0e2a857ed33a', applicationNo)
    } else if (division === 'mechanical') {
      ;[op] = await getApi('a9e24c05a174d6fdc40f', applicationNo)
    } else if (division === 'occupancy') {
      ;[op] = await getApi('28f6c55c9123e46460ff', applicationNo)
    }

    setSelectedApplication(applicationNo)
    setSelectedName(op.result7[0])
    setSelectedLocation(op.result[0])
    setSelectedTypes(op.result2[0])
    setSelectedAssessor(op.result3[0])
    const total = calculateTotal(op.result4)
    const formattedTotal = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(total)
    setSelectedTotal(formattedTotal)
    setSelectedDate(dayjs(op.result5[0]).format('MMMM DD, YYYY'))
    setApplicationId(op.result6[0])

    getPrintDetails(division, op.result6[0])
    getPrintDetailsFees(division, op.result6[0])

    getSignatureImage(employeeId())

    const approversignId = await geteSignId(276)
    getApprovedDate(approversignId, applicationNo)
    getAssessedDate(division, op.result6[0])
  }

  const calculateTotal = (list: number[]) => {
    const total = list.map((item) => parseFloat(item.toString())).reduce((acc, curr) => acc + curr, 0)
    return total
  }

  const getListForPrinting = async (division: string) => {
    try {
      setIsLoading(true)
      setLoadingText('Getting List to Print')
      let response: any
      // if (selectedType() === 'Print') response = await getApi(`get-listopprinting-${division}`)
      // else response = await getApi(`get-listopreprinting-${division}`)

      if (selectedType() === 'Print') {
        if (division === 'building') {
          ;[response] = await getApi('fd07a63e41d623e9eeac')
        } else if (division === 'electrical') {
          ;[response] = await getApi('3a6b7c295ec69763503d')
        } else if (division === 'mechanical') {
          ;[response] = await getApi('d8b4f6ed40f0fc0808b7')
        } else if (division === 'occupancy') {
          ;[response] = await getApi('e1a16fbc5401bbd10a5f')
        }
      } else {
        if (division === 'electrical') {
          ;[response] = await getApi('d3a1370fc767ed2a63f9')
        } else if (division === 'mechanical') {
          ;[response] = await getApi('e47591599e22f3ca9864')
        } else if (division === 'occupancy') {
          ;[response] = await getApi('70a6646fc9559aebfe66')
        }
      }

      if (filter() !== '' && filter().trim().length !== 0) {
        const filteredApplications = response.result.filter((item: string) => item.includes(filter()))
        const filteredIndices = response.result.map((item: string, index: number) => (item.includes(filter()) ? index : -1)).filter((index: number) => index !== -1)
        const filteredNames = filteredIndices.map((index: number) => response.result2[index])

        if (division === 'electrical') {
          setApplicationListElectrical(filteredApplications)
          setNameListElectrical(filteredNames)
        } else if (division === 'occupancy') {
          setApplicationListOccupancy(filteredApplications)
          setNameListOccupancy(filteredNames)
        } else if (division === 'building') {
          setApplicationListBuilding(filteredApplications)
          setNameListBuilding(filteredNames)
        } else {
          setApplicationListMechanical(filteredApplications)
          setNameListMechanical(filteredNames)
        }
        setIsLoading(false)
        return
      }

      if (division === 'electrical') {
        setApplicationListElectrical(response.result)
        setNameListElectrical(response.result2)
      } else if (division === 'occupancy') {
        setApplicationListOccupancy(response.result)
        setNameListOccupancy(response.result2)
      } else if (division === 'building') {
        setApplicationListBuilding(response.result)
        setNameListBuilding(response.result2)
      } else {
        setApplicationListMechanical(response.result)
        setNameListMechanical(response.result2)
      }
      setIsLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  const removeEmployee = () => {
    $head.delete()
    $head_id.delete()
  }

  const checkLogged = async () => {
    const logged = $logged_in.get()
    const loginName = $login_name.get()
    const loginId = $login_id.get()

    setEmployeeId(parseInt(loginId!, 10))
    setEmployeeName(loginName!)

    if (employeeId() === 0 || employeeId().toString() === 'NaN') {
      removeEmployee()
      // navigate('/', { replace: true })
      return false
    }
    return true
  }

  const printHandler = async (division: string, application: string) => {
    let updateOrderofpayment

    setConnected(await checkConnection())
    if (connected() === false) {
      setErrorMessage('No Connection on Server')
      return
    }

    setIsLoading(true)
    setLoadingText(`Processing ${application}`)
    if (division === 'electrical') {
      await setNewStatus(division, 'ELECTRICAL ORDER OF PAYMENT PRINTED', '171', 'ELECOPPRINTED', 1)
      await setNewStatus(division, 'ELECTRICAL ORDER OF PAYMENT RELEASED', '97', 'ELECOPRELEASED', 1)
      await setNewStatus(division, 'FOR ELECTRICAL OFFICIAL RECEIPT VALIDATION', '98', 'ELECORVALIDATE', 0)
      await updateDocflow(division, application, 'FOR ELECTRICAL ORDER OF PAYMENT PRINTING')
    } else if (division === 'occupancy') {
      await setNewStatus(division, 'OCCUPANCY ORDER OF PAYMENT PRINTED', '173', 'OCCOPPRINTED', 1)
      await setNewStatus(division, 'OCCUPANCY ORDER OF PAYMENT RELEASED', '174', 'OCCOPRELEASED', 1)
      await setNewStatus(division, 'ORDER OF PAYMENT RELEASE FOR BUREAU OF FIRE', '24', 'OCOOPRELEASE', 0)
      await updateDocflow(division, application, 'APPROVED FOR PRINTING OF BUREAU OF FIRE AND ORDER OF PAYMENT')
    } else {
      await setNewStatus(division, 'MECHANICAL ORDER OF PAYMENT PRINTED', '182', 'MECHOPPRINTED', 1)
      await setNewStatus(division, 'MECHANICAL ORDER OF PAYMENT RELEASED', '183', 'MECHOPRELEASED', 1)
      await setNewStatus(division, 'FOR MECHANICAL OFFICIAL RECEIPT VALIDATION', '98', 'ELECORVALIDATE', 0)
      await updateDocflow(division, application, 'FOR MECHANICAL ORDER OF PAYMENT PRINTING')
    }

    updateOrderofpayment = await updateOp(division)

    if (updateOrderofpayment) {
      setLoadingText('Creating new transaction record')
      await postTransaction(application)
      setPrintedApplication(application)
      setPrinted(true)

      setLoadingText('Generating PDF')
      if (division === 'electrical') {
        createPdfElectrical()
      } else if (division === 'occupancy') {
        createPdfOccupancy()
      } else if (division === 'mechanical') {
        createPdfMechanical()
      } else console.log('building')
    }
    setIsLoading(false)
  }

  const rePrintHandler = async (division: string, application: string) => {
    let popsExist: boolean = false
    let popsPaid: boolean = false

    setConnected(await checkConnection())
    if (connected() === false) {
      setErrorMessage('No Connection on Server')
      return
    }

    setIsLoading(true)
    setLoadingText(`Reprinting ${application}`)

    if (selectedType().includes('Void')) {
      setLoadingText('Clearing POPS records')

      if (BACKEND.includes('localhost')) {
        const status = await checkStatusPopsLocal(application)
        if (status.result > 0) popsExist = true
        if (status.result2 > 0) popsPaid = true
      } else {
        const status = await await statusPopsOp(application)
        if (status.message === 'Success') popsExist = true
        if (status.pops_paid === true) popsPaid = true
      }

      if (!popsExist) {
        setIsLoading(false)
        setVoidError(true)
        setErrorMessage('No record found on Pops')
        return
      }

      if (popsPaid) {
        setIsLoading(false)
        setVoidError(true)
        setErrorMessage('Already Paid')
        return
      }

      setLoadingText('Processing for Re-approval Status')
      if (division === 'electrical') {
        await setNewStatus(division, 'ELECTRICAL ORDER OF PAYMENT VOIDED', '173', 'ELECOPVOIDED', 1)
        await setNewStatus(division, 'FOR ELECTRICAL ORDER OF PAYMENT APPROVAL', '94', 'ELECOPAPPROVE', 0)

        const checkOpPrinting = await checkDocflow(division, application, 'FOR ELECTRICAL ORDER OF PAYMENT PRINTING')
        if (checkOpPrinting) {
          await updateDocflow(division, application, 'FOR ELECTRICAL ORDER OF PAYMENT PRINTING')
        }
        const checkOrValidation = await checkDocflow(division, application, 'FOR ELECTRICAL OFFICIAL RECEIPT VALIDATION')
        if (checkOrValidation) {
          await updateDocflow(division, application, 'FOR ELECTRICAL OFFICIAL RECEIPT VALIDATION')
        }
        // await updateDocflow(division, application, 'FOR ELECTRICAL OFFICIAL RECEIPT VALIDATION')
        await updateOpForApproval(division, application)
        setLoadingText('Clearing transactions and locked data')
        await clearEsignTransactions(application)
        await clearEsignLock(application)
      } else if (division === 'occupancy') {
        await setNewStatus(division, 'OCCUPANCY ORDER OF PAYMENT VOIDED', '174', 'OCCOPVOIDED', 1)
        //UNFINISH
        await updateDocflow(division, application, 'APPROVED FOR PRINTING OF BUREAU OF FIRE AND ORDER OF PAYMENT')
      } else {
        await setNewStatus(division, 'MECHANICAL ORDER OF PAYMENT VOIDED', '184', 'MECHOPVOIDED', 1)
        await setNewStatus(division, 'FOR MECHANICAL ORDER OF PAYMENT APPROVAL', '111', 'MECHOPAPPROVE', 0)

        const checkOpPrinting = await checkDocflow(division, application, 'FOR MECHANICAL ORDER OF PAYMENT PRINTING')
        if (checkOpPrinting) {
          await updateDocflow(division, application, 'FOR MECHANICAL ORDER OF PAYMENT PRINTING')
        }
        const checkOrValidation = await checkDocflow(division, application, 'FOR MECHANICAL OFFICIAL RECEIPT VALIDATION')
        if (checkOrValidation) {
          await updateDocflow(division, application, 'FOR MECHANICAL OFFICIAL RECEIPT VALIDATION')
        }
        // await updateDocflow(division, application, 'FOR ELECTRICAL OFFICIAL RECEIPT VALIDATION')
        await updateOpForApproval(division, application)
        setLoadingText('Clearing transactions and locked data')
        await clearEsignTransactions(application)
        await clearEsignLock(application)
      }

      setLoadingText('Voiding POPS record')
      const successVoid = BACKEND.includes('localhost') ? await voidPopsOpLocal(application) : await voidPopsOp(application)
      if (successVoid) {
        await postTransaction(application)
        setPrintedApplication(application)
        setVoidNotification(true)
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    } else {
      setLoadingText('Generating PDF')
      setPrintedApplication(application)
      setPrinted(true)

      if (division === 'electrical') {
        createPdfElectrical()
      } else if (division === 'occupancy') {
        createPdfOccupancy()
      } else if (division === 'mechanical') {
        createPdfMechanical()
      } else console.log('building')
    }
    setIsLoading(false)
  }

  const updateOp = async (division: string) => {
    if (division === 'electrical') {
      return await postApi('48e0a71f62-7e98f574d2', {
        data: parseInt(applicationId().toString(), 10),
      })
    } else if (division === 'mechanical') {
      return await postApi('48e0a71f62-6f0d9f6b57', {
        data: parseInt(applicationId().toString(), 10),
      })
    } else if (division === 'occupancy') {
      return await postApi('48e0a71f62-ca2a04993b', {
        data: parseInt(applicationId().toString(), 10),
      })
    }
  }

  const setNewStatus = async (division: string, status: string, tag: string, tagword: string, approved: number) => {
    const today = await getDateTime()
    const formattedDate = dayjs(today).format('YYYY-MM-DD HH:mm:ss')
    const statusid = parseInt(applicationId().toString(), 10)

    let post
    if (division === 'electrical') {
      post = await postApi('4cd315b87a-901cde1e64', {
        data: statusid,
        data2: formattedDate,
        data3: status,
        data4: tag,
        data5: tagword,
        data6: parseInt(approved.toString(), 10),
        data7: parseInt(employeeId().toString(), 10),
      })
    } else if (division === 'mechanical') {
      post = await postApi('4cd315b87a-34b8064d45', {
        data: statusid,
        data2: formattedDate,
        data3: status,
        data4: tag,
        data5: tagword,
        data6: parseInt(approved.toString(), 10),
        data7: parseInt(employeeId().toString(), 10),
      })
    } else if (division === 'occupancy') {
      post = await postApi('4cd315b87a-8f2df1a3b4', {
        data: statusid,
        data2: formattedDate,
        data3: status,
        data4: tag,
        data5: tagword,
        data6: parseInt(approved.toString(), 10),
        data7: parseInt(employeeId().toString(), 10),
      })
    }
    return post
  }

  const updateDocflow = async (division: string, application: string, status: string) => {
    if (division === 'electrical') {
      await postApi('48e0a71f62-0604d816c0', {
        data: status,
        data2: application,
      })
    } else if (division === 'mechanical') {
      await postApi('48e0a71f62-d465ed3536', {
        data: status,
        data2: application,
      })
    } else if (division === 'occupancy') {
      await postApi('48e0a71f62-12e025162c', {
        data: status,
        data2: application,
      })
    }
  }

  const checkDocflow = async (division: string, application: string, status: string) => {
    let response
    if (division === 'electrical') {
      ;[response] = await getApi('d12ee69c9b3488317dea', application, status)
    } else if (division === 'mechanical') {
      ;[response] = await getApi('c4023dbc59923126c646', application, status)
    } else if (division === 'occupancy') {
      ;[response] = await getApi('6b923b6527147ac1ef9c', application, status)
    }
    return parseInt(response.result) === 0
  }

  const getSignatureImage = async (id: number) => {
    try {
      const [response] = await getApi('8a69ed635862b0554748', id)
      const image = response.result
      _signatureAssessor.set(image)

      const [response2] = await getApi('8a69ed635862b0554748', 276)
      const image2 = response2.result
      _signatureApprover.set(image2)
      return true
    } catch {
      return false
    }
  }

  const geteSignId = async (id: number) => {
    try {
      const [response] = await getApi('773ed4450f9a5809fad7', id)
      const result = response.result
      return result
    } catch {
      return 0
    }
  }

  const postTransaction = async (application: string) => {
    const id = await geteSignId(employeeId())
    const today = await getDateTime()
    const formattedDate = dayjs(today).format('YYYY-MM-DD HH:mm:ss')

    await postApi('4cd315b87a-781a6781ad', {
      data: parseInt(id, 10),
      data2: application,
      data3: formattedDate,
    })
  }

  const getApprovedDate = async (id: number, application: string) => {
    const [response] = await getApi('d31b9704d7c5d43704b6', id, application)
    _approvedDate.set(response.result)
  }

  const getAssessedDate = async (division: string, id: number) => {
    let response
    if (division === 'electrical') {
      ;[response] = await getApi('59eb416ec6d3ac517333', id)
    } else if (division === 'mechanical') {
      ;[response] = await getApi('d1abe72bab9358720de3', id)
    } else if (division === 'occupancy') {
      ;[response] = await getApi('bfa5c727a91d85cd2d62', id)
    }
    _assessedDate.set(response.result)
  }

  // const getEmployeeId = async (name: string) => {
  //   try {
  //     const response = await ofetch(API + 'get-employeeid/' + name, { parseResponse: JSON.parse })
  //     const result = response.result
  //     return parseInt(result)
  //   } catch (error) {
  //     return 0
  //   }
  // }

  const refresh = async () => {
    if (isBuilding()) await getListForPrinting('building')
    if (isOccupancy()) await getListForPrinting('occupancy')
    if (isElectrical()) await getListForPrinting('electrical')
    if (isMechanical()) await getListForPrinting('mechanical')
  }

  const logout = () => {
    removeEmployee()
    navigate('/')
  }

  const voidPopsOp = async (application: string) => {
    const response = await voidPopsApi(application)
    if (response.includes('Error')) return false
    return true
  }

  const voidPopsOpLocal = async (application: string) => {
    const response = await deleteApi('fe377458d5-527793ef64', { data: application })
    return response
  }

  const checkStatusPopsLocal = async (application: string) => {
    const [response] = await getApi('1431ee20d8f6a0a03c74', application)
    return response.result
  }

  const statusPopsOp = async (application: string) => {
    const response = await statusPopsApi(application)
    return response
  }

  const updateOpForApproval = async (division: string, application: string) => {
    let response
    if (division === 'electrical') {
      response = await postApi('48e0a71f62-fec3115def', { data: application })
    } else if (division === 'mechanical') {
      response = await postApi('48e0a71f62-2a0be34424', { data: application })
    } else if (division === 'occupancy') {
      response = await postApi('48e0a71f62-55f1420782', { data: application })
    }
    return response
  }

  const clearEsignTransactions = async (application: string) => {
    let deleteTran
    const [check] = await getApi('64c815f47a10cebb3513', application)

    if (parseInt(check.result) > 0) {
      deleteTran = await deleteApi('f78dea0eb4-0636b91776', { data: application })
      return deleteTran
    } else {
      return 0
    }
  }

  const clearEsignLock = async (application: string) => {
    let deleteLock
    const [check] = await getApi('18864f0e595c1ac9227ff', application)

    if (parseInt(check.result) > 0) {
      deleteLock = await deleteApi('f78dea0eb4-59a376080e', { data: application })
      return deleteLock
    } else {
      return 0
    }
  }

  const convertBase64 = (blob: Blob) => {
    return new Promise((resolve, _) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  }

  const saveConfig = async () => {
    let base64image = ''
    if (configNewName() !== '') await saveNewName(parseInt(employeeId().toString()), configNewName())
    if (configNewPassword() !== '') await saveNewPassword(parseInt(employeeId().toString()), configNewEncPassword())

    if (file() !== undefined) {
      const blob = new Blob(file())
      const base64 = await convertBase64(blob)
      base64image = base64 as string

      await saveNewSignature(parseInt(employeeId().toString()), base64image)
    }

    setConfigNotification(true)
  }

  const checkCurrentPassword = async () => {
    const encCurrentPassword = await securePassword(configPassword())

    if (encCurrentPassword === configEncPassword()) {
      if (configNewPassword() === '') {
        setConfigError('New Password not provided')
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

  const getPassword = async () => {
    const [response] = await getApi('49dd42b9454f27280be0', employeeId())
    setConfigEncPassword(response.result)
  }

  const updateDisplayName = async () => {
    const [response] = await getApi('13aa78de07dbcc7acc12', employeeId())
    sessionStorage.setItem('name', response.result)
    setEmployeeName(response.result)
  }

  const closeConfig = async () => {
    await updateDisplayName()
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
    setSelectedTypes('')
    setSelectedAssessor('')
    setSelectedTotal('')
    setSelectedDate('')

    setShowDetails(false)
  }

  const init = async () => {
    checkPage()
    const logged = await checkLogged()
    await getPassword()

    if (logged) {
      setSelectedType('Print')

      await checkDivision()
      if (isBuilding()) await getListForPrinting('building')
      if (isOccupancy()) await getListForPrinting('occupancy')
      if (isElectrical()) await getListForPrinting('electrical')
      if (isMechanical()) await getListForPrinting('mechanical')
    }

    // pageLoaded = true
  }

  onSettled(() => {
    init()
  })

  // onCleanup(() => {
  //   pageLoaded = false
  // })

  // createEffect(async () => {
  //   if (filter() !== '') {
  //     if (isBuilding()) await getListForPrinting('building')
  //     if (isOccupancy()) await getListForPrinting('occupancy')
  //     if (isElectrical()) await getListForPrinting('electrical')
  //     if (isMechanical()) await getListForPrinting('mechanical')
  //   } else if (filter() === '' && pageLoaded === true) {
  //     if (isBuilding()) await getListForPrinting('building')
  //     if (isOccupancy()) await getListForPrinting('occupancy')
  //     if (isElectrical()) await getListForPrinting('electrical')
  //     if (isMechanical()) await getListForPrinting('mechanical')
  //   }
  // })

  // createEffect(() => {
  //   if (configPassword() !== '') {
  //     checkCurrentPassword()
  //   } else checkCurrentPassword()

  //   if (configNewPassword() !== '') {
  //     encryptNewPassword()
  //   } else encryptNewPassword()
  // })

  return (
    <>
      <Page title='e-Sign - Printing' alignment='column' font='roboto'>
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

        <Row content='center'>
          <Tabs aria-label='Main navigation' class='tabs'>
            <Row>
              <Tabs.List class='tabs__list'>
                <Show when={isBuilding()}>
                  <Tabs.Trigger class='tabs__trigger' value='building'>
                    Building
                  </Tabs.Trigger>
                </Show>
                <Show when={isOccupancy()}>
                  <Tabs.Trigger class='tabs__trigger' value='occupancy'>
                    Occupancy
                  </Tabs.Trigger>
                </Show>
                <Show when={isElectrical()}>
                  <Tabs.Trigger class='tabs__trigger' value='electrical'>
                    Electrical
                  </Tabs.Trigger>
                </Show>
                <Show when={isMechanical()}>
                  <Tabs.Trigger class='tabs__trigger' value='mechanical'>
                    Mechanical
                  </Tabs.Trigger>
                </Show>
                <Tabs.Indicator class='tabs__indicator' />
              </Tabs.List>
            </Row>

            <Tabs.Content class='tabs__content' value='building'>
              {/*<Row>
                  <h2>List of Ready to Approve and Sign Building Order of Payments</h2>
                </Row>*/}

              <Padding top={0} bottom={0} right={10} left={10}>
                <Row content='split'>
                  <Input value={filter()} onChange={setFilter} placeholder='Filter Application Number' />
                  <Row>
                    {/* <Combobox options={listType} value={selectedType()} onChange={setSelectedType} placeholder="Select Type" width='200px' /> */}
                    <Button label='Refresh Data' corner='curved' design='bootstrap-primary' icon={VsRefresh} onClick={refresh}></Button>
                  </Row>
                </Row>
              </Padding>

              {/*<Row>
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Application Number</th>
                        <th>Name</th>
                        <th style="text-align: center">Show Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicationListBuilding().map((item: string, index: number) => (
                        <tr>
                          <td>{item}</td>
                          <td>{nameListBuilding()[index]}</td>

                          <td>
                            <ModalButton
                              class="modal"
                              label="Show Details"
                              design="bo-link"
                              background="#121e2acc"
                              color="#ffffffec"
                              function={async () => {
                                await getopdetailsCard('building', item)
                              }}
                            >
                              <Padding top={0} left={2} right={2} bottom={0}>
                                <span class="modal__application-number">{item}</span>

                                <Padding top={1} left={0} right={0} bottom={0}>
                                  <section class="modal__row">
                                    <span class="modal__row__label">Name of Applicant:</span>
                                    <span class="modal__row__detail">{nameListBuilding()[index]}</span>
                                  </section>

                                  <section class="modal__row">
                                    <span class="modal__row__label">Location:</span>
                                    <span class="modal__row__detail">{location()}</span>
                                  </section>

                                  <section class="modal__row">
                                    <span class="modal__row__label">Type:</span>
                                    <span class="modal__row__detail">{type().toUpperCase()}</span>
                                  </section>

                                  <section class="modal__row">
                                    <span class="modal__row__label">Assessed By:</span>
                                    <span class="modal__row__detail">{assessor()}</span>
                                  </section>

                                  <section class="modal__row">
                                    <span class="modal__row__label">Date Assessed:</span>
                                    <span class="modal__row__detail">{dateOp().toUpperCase()}</span>
                                  </section>

                                  <section class="modal__row">
                                    <span class="modal__row__label">Total Fee:</span>
                                    <span class="modal__row__detail__price">
                                      {PESO}{' '}
                                      {totalOp().toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </span>
                                  </section>
                                </Padding>

                                <Row padding="2rem 0 0 0">
                                  <Button width='100%' label="Print" edges="curved" design="bo-primary" onClick={() => printHandler('building', item)}></Button>
                                  <span class="modal__cancel">Click anywhere to cancel</span>
                                </Row>
                              </Padding>
                            </ModalButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Row>*/}
            </Tabs.Content>
            <Tabs.Content class='tabs__content' value='occupancy'>
              {/*<Row>
                  <h2>List of Ready to Print in Occupancy Order of Payments</h2>
                </Row>*/}

              <Padding top={0} bottom={0} right={10} left={10}>
                <Row content='split'>
                  <Input value={filter()} onChange={setFilter} placeholder='Filter Application Number' />
                  <Row>
                    {/* <Combobox options={listType} value={selectedType()} onChange={setSelectedType} placeholder="Select Type" width='200px' /> */}
                    <Button label='Refresh Data' corner='curved' design='bootstrap-primary' icon={VsRefresh} onClick={refresh}></Button>
                  </Row>
                </Row>
              </Padding>

              <Row>
                <Show when={isLoading()}>
                  <Padding top={4} bottom={0} right={10} left={10}>
                    <Column gap={1}>
                      <AiOutlineLoading3Quarters size={42} />
                      <span>{loadingText()}</span>
                    </Column>
                  </Padding>
                </Show>

                <Show when={!isLoading()}>
                  <Padding top={2} bottom={1} left={0} right={0}>
                    <Row gap={1}>
                      {applicationListOccupancy().map((item: string, index: number) => (
                        <EsignCard
                          division='Occupancy'
                          applicationNo={item}
                          name={nameListOccupancy()[index]}
                          onClick={async () => {
                            setShowDetails(true)
                            await getopdetailsCard('occupancy', item)
                          }}
                        ></EsignCard>
                      ))}
                    </Row>
                  </Padding>
                </Show>

                {/*<table class="table">
                    <thead>
                      <tr>
                        <th>Application Number</th>
                        <th>Name</th>
                        <th style="text-align: center">Show Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicationListOccupancy().map((item: string, index: number) => (
                        <tr>
                          <td>{item}</td>
                          <td>{nameListOccupancy()[index]}</td>

                          <td>
                            <ModalButton
                              class="modal"
                              label="Show Details"
                              design="bo-link"
                              background="#121e2acc"
                              color="#ffffffec"
                              function={async () => {
                                await getopdetails('occupancy', item)
                              }}
                            >
                              <Padding top={0} left={2} right={2} bottom={0}>
                                <span class="modal__application-number">{item}</span>

                                <Padding top={1} left={0} right={0} bottom={0}>
                                  <section class="modal__row">
                                    <span class="modal__row__label">Name of Applicant:</span>
                                    <span class="modal__row__detail">{nameListOccupancy()[index]}</span>
                                  </section>

                                  <section class="modal__row">
                                    <span class="modal__row__label">Location:</span>
                                    <span class="modal__row__detail">{location()}</span>
                                  </section>

                                  <section class="modal__row">
                                    <span class="modal__row__label">Type:</span>
                                    <span class="modal__row__detail">{type().toUpperCase()}</span>
                                  </section>

                                  <section class="modal__row">
                                    <span class="modal__row__label">Assessed By:</span>
                                    <span class="modal__row__detail">{assessor()}</span>
                                  </section>

                                  <section class="modal__row">
                                    <span class="modal__row__label">Date Assessed:</span>
                                    <span class="modal__row__detail">{dateOp().toUpperCase()}</span>
                                  </section>

                                  <section class="modal__row">
                                    <span class="modal__row__label">Total Fee:</span>
                                    <span class="modal__row__detail__price">
                                      {PESO}{' '}
                                      {totalOp().toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </span>
                                  </section>
                                </Padding>

                                <Row padding="2rem 0 0 0">
                                  <Show when={selectedType() === 'Print'}>
                                    <Button width='100%' label="Print" edges="curved" design="bo-primary" onClick={() => printHandler('occupancy', item)}></Button>
                                  </Show>
                                  <Show when={selectedType().includes('Reprint')}>
                                    <Button width='100%' label="Reprint" edges="curved" design="bo-primary" onClick={() => rePrintHandler('occupancy', item)}></Button>
                                  </Show>
                                  <Show when={selectedType().includes('Void')}>
                                    <Button width='100%' label="Void" edges="curved" design="bo-primary" onClick={() => rePrintHandler('occupancy', item)}></Button>
                                  </Show>
                                  <span class="modal__cancel">Click anywhere to cancel</span>
                                </Row>
                              </Padding>
                            </ModalButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>*/}
              </Row>
            </Tabs.Content>
            <Tabs.Content class='tabs__content' value='electrical'>
              <Padding right={9} left={9}>
                <Row content='right'>
                  <Row gap={0.5}>
                    <Input value={filter()} onChange={setFilter} placeholder='Filter Application Number' width='16rem' />
                    <Combobox options={listType} value={selectedType()} onChange={setSelectedType} placeholder='Select Type' width='250px' />
                    <Button label='Refresh Data' corner='curved' design='bootstrap-primary' icon={VsRefresh} onClick={refresh}></Button>
                  </Row>
                </Row>
              </Padding>

              <Row>
                <Show when={isLoading()}>
                  <Padding top={4} bottom={0} right={10} left={10}>
                    <Column gap={1}>
                      <AiOutlineLoading3Quarters size={42} />
                      <span>{loadingText()}</span>
                    </Column>
                  </Padding>
                </Show>

                <Show when={!isLoading()}>
                  <Show when={applicationListElectrical().length > 0}>
                    <Padding top={2} bottom={1} left={0} right={0}>
                      <Row gap={1}>
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
                    </Padding>
                    {/*<table class="table">
                        <thead>
                          <tr>
                            <th>Application Number</th>
                            <th>Name</th>
                            <th style="text-align: center">Show Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applicationListElectrical().map((item: string, index: number) => (
                            <tr>
                              <td>{item}</td>
                              <td>{nameListElectrical()[index]}</td>

                              <td>
                                <ModalButton
                                  class="modal"
                                  label="Show Details"
                                  design="bo-link"
                                  background="#121e2acc"
                                  color="#ffffffec"
                                  function={async () => {
                                    await getopdetails('electrical', item)
                                  }}
                                >
                                  <Padding top={0} left={2} right={2} bottom={0}>
                                    <span class="modal__application-number">{item}</span>

                                    <Padding top={1} left={0} right={0} bottom={0}>
                                      <section class="modal__row">
                                        <span class="modal__row__label">Name of Applicant:</span>
                                        <span class="modal__row__detail">{nameListElectrical()[index]}</span>
                                      </section>

                                      <section class="modal__row">
                                        <span class="modal__row__label">Location:</span>
                                        <span class="modal__row__detail">{location()}</span>
                                      </section>

                                      <section class="modal__row">
                                        <span class="modal__row__label">Type:</span>
                                        <span class="modal__row__detail">{type().toUpperCase()}</span>
                                      </section>

                                      <section class="modal__row">
                                        <span class="modal__row__label">Assessed By:</span>
                                        <span class="modal__row__detail">{assessor()}</span>
                                      </section>

                                      <section class="modal__row">
                                        <span class="modal__row__label">Date Assessed:</span>
                                        <span class="modal__row__detail">{dateOp().toUpperCase()}</span>
                                      </section>

                                      <section class="modal__row">
                                        <span class="modal__row__label">Total Fee:</span>
                                        <span class="modal__row__detail__price">
                                          {PESO}{' '}
                                          {totalOp().toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                          })}
                                        </span>
                                      </section>
                                    </Padding>

                                    <Row padding="2rem 0 0 0">
                                      <Show when={selectedType() === 'Print'}>
                                        <Button width='100%' label="Print" edges="curved" design="bo-primary" onClick={() => printHandler('electrical', item)}></Button>
                                      </Show>
                                      <Show when={selectedType().includes('Reprint')}>
                                        <Button width='100%' label="Reprint" edges="curved" design="bo-primary" onClick={() => rePrintHandler('electrical', item)}></Button>
                                      </Show>
                                      <Show when={selectedType().includes('Void')}>
                                        <Button width='100%' label="Void" edges="curved" design="bo-primary" onClick={() => rePrintHandler('electrical', item)}></Button>
                                      </Show>
                                      <span class="modal__cancel">Click anywhere to cancel</span>
                                    </Row>
                                  </Padding>
                                </ModalButton>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>*/}
                  </Show>

                  <Show when={applicationListElectrical().length === 0}>
                    <Padding top={2} bottom={0} left={0} right={0}>
                      <Box thickness={1} padding='4rem 2rem' curved color='rgba(250, 250, 250, 0.3)'>
                        <Column gap={1}>
                          <RiDocumentFileCloseFill size={50} />
                          <span>No electrical applications available for printing</span>
                        </Column>
                      </Box>
                    </Padding>
                  </Show>
                </Show>
              </Row>
            </Tabs.Content>
            <Tabs.Content class='tabs__content' value='mechanical'>
              {/*<Row>
                  <Padding top={2} bottom={2} right={0} left={0}>
                    <h3>Ready for Signing and Printing Mechanical Order of Payments</h3>
                  </Padding>
                </Row>*/}

              <Padding top={0} bottom={0} right={9} left={9}>
                <Row content='split'>
                  <Input value={filter()} onChange={setFilter} placeholder='Filter Application Number' />
                  <Row gap={0.5}>
                    <Combobox options={listType} value={selectedType()} onChange={setSelectedType} placeholder='Select Type' width='250px' />
                    <Button label='Refresh Data' corner='curved' design='bootstrap-primary' icon={VsRefresh} onClick={refresh}></Button>
                  </Row>
                </Row>
              </Padding>

              <Row>
                <Show when={isLoading()}>
                  <Padding top={4} bottom={0} right={10} left={10}>
                    <Column gap={1}>
                      <AiOutlineLoading3Quarters size={42} />
                      <span>{loadingText()}</span>
                    </Column>
                  </Padding>
                </Show>

                <Show when={!isLoading()}>
                  {/*<Show when={applicationListMechanical().length > 0}>
                     <table class="table">
                        <thead>
                          <tr>
                            <th>Application Number</th>
                            <th>Name</th>
                            <th style="text-align: center">Show Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applicationListMechanical().map((item: string, index: number) => (
                            <tr>
                              <td>{item}</td>
                              <td>{nameListMechanical()[index]}</td>

                              <td>
                                <ModalButton
                                  class="modal"
                                  label="Show Details"
                                  design="bo-link"
                                  background="#121e2acc"
                                  color="#ffffffec"
                                  function={async () => {
                                    await getopdetailsCard('mechanical', item)
                                  }}
                                >
                                  <Padding top={0} left={2} right={2} bottom={0}>
                                    <span class="modal__application-number">{item}</span>

                                    <Padding top={1} left={0} right={0} bottom={0}>
                                      <section class="modal__row">
                                        <span class="modal__row__label">Name of Applicant:</span>
                                        <span class="modal__row__detail">{nameListMechanical()[index]}</span>
                                      </section>

                                      <section class="modal__row">
                                        <span class="modal__row__label">Location:</span>
                                        <span class="modal__row__detail">{location()}</span>
                                      </section>

                                      <section class="modal__row">
                                        <span class="modal__row__label">Type:</span>
                                        <span class="modal__row__detail">{type().toUpperCase()}</span>
                                      </section>

                                      <section class="modal__row">
                                        <span class="modal__row__label">Assessed By:</span>
                                        <span class="modal__row__detail">{assessor()}</span>
                                      </section>

                                      <section class="modal__row">
                                        <span class="modal__row__label">Date Assessed:</span>
                                        <span class="modal__row__detail">{dateOp().toUpperCase()}</span>
                                      </section>

                                      <section class="modal__row">
                                        <span class="modal__row__label">Total Fee:</span>
                                        <span class="modal__row__detail__price">
                                          {PESO}{' '}
                                          {totalOp().toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                          })}
                                        </span>
                                      </section>
                                    </Padding>

                                    <Row padding="2rem 0 0 0">
                                      <Show when={selectedType() === 'Print'}>
                                        <Button width='100%' label="Print" edges="curved" design="bo-primary" onClick={() => printHandler('mechanical', item)}></Button>
                                      </Show>
                                      <Show when={selectedType().includes('Reprint')}>
                                        <Button width='100%' label="Reprint" edges="curved" design="bo-primary" onClick={() => rePrintHandler('mechanical', item)}></Button>
                                      </Show>
                                      <Show when={selectedType().includes('Void')}>
                                        <Button width='100%' label="Void" edges="curved" design="bo-primary" onClick={() => rePrintHandler('mechanical', item)}></Button>
                                      </Show>
                                      <span class="modal__cancel">Click anywhere to cancel</span>
                                    </Row>
                                  </Padding>
                                </ModalButton>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Show>*/}

                  <Show when={applicationListMechanical().length === 0}>
                    <Padding top={2} bottom={0} left={0} right={0}>
                      <Box thickness={1} padding='4rem 2rem' curved color='rgba(250, 250, 250, 0.3)'>
                        <Column gap={1}>
                          <RiDocumentFileCloseFill size={50} />
                          <span>No mechanical applications available for printing</span>
                        </Column>
                      </Box>
                    </Padding>
                  </Show>
                </Show>
              </Row>
            </Tabs.Content>
          </Tabs>
        </Row>
      </Page>

      <div onClick={() => closeNotification(printedApplication())}>
        <Modal trigger={printed()} background='#123220ff' color='#cdfbe1f0' opacity={0.8}>
          <Padding top={1} bottom={1} left={2} right={2}>
            <Column>
              <Row gap={4}>
                <FaSolidThumbsUp size={75} />
                <Box curved thickness={3} color='#cdfbe1f0' padding='1rem'>
                  <span class='approval'>Printed</span>
                </Box>
              </Row>
              <Row padding='2rem 0 0 0'>
                <h2>{printedApplication()}</h2>
              </Row>

              <Row>
                <span class='close-text'>Click anywhere to proceed</span>
              </Row>
            </Column>
          </Padding>
        </Modal>
      </div>

      <div onClick={() => setConnected(true)}>
        <Modal trigger={connected() === false} background='#562020ff' color='#ffebebe6' opacity={0.8}>
          <Padding top={1} bottom={1} left={4} right={4}>
            <Column>
              <Row>
                <Box curved thickness={3} color='#ffebebe6' padding='1rem'>
                  <h2>Connection Error</h2>
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

      <div onClick={() => setVoidError(false)}>
        <Modal trigger={voidError()} background='#562020ff' color='#ffebebe6' opacity={0.8}>
          <Padding top={1} bottom={1} left={4} right={4}>
            <Column>
              <Row>
                <Box curved thickness={3} color='#ffebebe6' padding='1rem'>
                  <h2>Invalid Application Void</h2>
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

      <Modal trigger={openConfig()} background='#16212c' color='#ffffffed' opacity={0.8} width='40rem'>
        <Padding top={1} bottom={1} left={4} right={4}>
          <section class='config'>
            <div class='config__row'>
              Name:
              <span>{employeeName()}</span>
            </div>

            <div class='config__edit'>
              <span class='config__edit__title'>Change Displayed Name</span>
              <Input value={configNewName()} onChange={setConfigNewName} placeholder='Enter new name' />
              <span class='config__edit__info'>Leave blank to remain unchanged.</span>
            </div>

            <div class='config__edit'>
              <span class='config__edit__title'>Change Password</span>
              <Input type='password' value={configPassword()} onChange={setConfigPassword} placeholder='Enter current password' />
              <Input type='password' value={configNewPassword()} onChange={setConfigNewPassword} placeholder='Enter new password' />

              <Show when={configNewPassword().length !== 0}>
                <span style='padding: 1.75rem 0 0 0'>Current Encrypted Password:</span>
                <span>{configEncPassword()}</span>

                <span style='padding: 0.75rem 0 0 0'>New Encrypted Password:</span>
                <span>{configNewEncPassword()}</span>
              </Show>
            </div>

            <div class='config__edit'>
              <span class='config__edit__title'>Change Signature</span>
              <FileField class='filefield' maxFiles={1} onFileAccept={(data) => setFile(data)} accept='.jpg, .jpeg, .png, .webp, .avif'>
                <FileField.Dropzone class='filefield__dropzone'>Drag and drop or click to upload file</FileField.Dropzone>
                <FileField.HiddenInput />
                <FileField.ItemList class='filefield__itemList'>
                  {() => (
                    <FileField.Item class='filefield__item'>
                      <FileField.ItemPreviewImage class='filefield__itemPreviewImage' />
                      <FileField.ItemName class='filefield__itemName' />
                      <FileField.ItemSize class='filefield__itemSize' />
                      <FileField.ItemDeleteTrigger class='filefield__itemDeleteTrigger' onClick={() => setFile()}>
                        Delete
                      </FileField.ItemDeleteTrigger>
                    </FileField.Item>
                  )}
                </FileField.ItemList>
              </FileField>
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

      <div onClick={() => closeNotification(printedApplication())}>
        <Modal trigger={voidNotification() === true} background='#123220ff' color='#cdfbe1f0' opacity={0.8}>
          <Padding top={1} bottom={1} left={2} right={2}>
            <Column>
              <Row gap={4}>
                <FaSolidThumbsUp size={75} />
                <Box curved thickness={3} color='#cdfbe1f0' padding='1rem'>
                  <span class='approval'>Account Voided and Returned to Approval</span>
                </Box>
              </Row>
              <Row padding='2rem 0 0 0'>
                <h2>{printedApplication()}</h2>
              </Row>

              <Row>
                <span class='close-text'>Click anywhere to proceed</span>
              </Row>
            </Column>
          </Padding>
        </Modal>
      </div>

      <div onClick={closeInfo}>
        <Modal trigger={showDetails() === true} background='#121e2acc' color='#ffffffec' width='350px'>
          <Row content='center' gap={1}>
            <Box curved thickness={1} color='rgba(244,244,244,0.1)' background='transparent' padding='1rem' width='100%'>
              <Padding top={0} left={2} right={2} bottom={0}>
                <Show when={selectedApplication() !== ''}>
                  <span class='modal-card__application-number'>{selectedApplication()}</span>
                </Show>
                <Show when={selectedApplication() === ''}>
                  <span class='modal-card__application-number'>----------</span>
                </Show>

                <Padding top={1} left={0} right={0} bottom={0}>
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
                    <Show when={selectedTypes() !== ''}>
                      <span class='modal-card__row__detail'>{selectedTypes().toUpperCase()}</span>
                    </Show>
                    <Show when={selectedTypes() === ''}>
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
                    <Show when={selectedType() === 'Print'}>
                      <Button width='100%' label='Print' corner='curved' design='bootstrap-primary' onClick={() => printHandler('electrical', selectedApplication())}></Button>
                    </Show>
                    <Show when={selectedType().includes('Reprint')}>
                      <Button width='100%' label='Reprint' corner='curved' design='bootstrap-primary' onClick={() => rePrintHandler('electrical', selectedApplication())}></Button>
                    </Show>
                    <Show when={selectedType().includes('Void')}>
                      <Button width='100%' label='Void' corner='curved' design='bootstrap-primary' onClick={() => rePrintHandler('electrical', selectedApplication())}></Button>
                    </Show>
                  </Show>
                  <Show when={selectedApplication() === ''}>
                    <span class='loading-data'>Loading data, please wait</span>
                  </Show>
                  <span class='modal-card__cancel'>Click anywhere to cancel</span>
                </Column>
              </Padding>
            </Box>
          </Row>
        </Modal>
      </div>
    </>
  )
}
