import { useNavigate } from '@solidjs/router'
import { MD5, SHA1, SHA384 } from 'crypto-js'
import dayjs from 'dayjs'
import { IoChevronBack } from 'solid-icons/io'
import { createEffect, createSignal, onSettled } from 'solid-js'
import { Show } from 'solid-js'
import { Box, Button, Column, Display, Link, Logo, Padding, Page, Row, Image, Dropdown, Clickable } from '@dasig'
import { checkConnection, securePassword } from '../../utils'
import { getApi } from '@dasig/api'
import { _headName } from 'src/stores/head'
import './login.sass'

export default () => {
  const APPROVERNAME = sessionStorage.getItem('head')!
  const navigate = useNavigate()
  const assessors = JSON.parse(sessionStorage.getItem('registered')!)
  const roles = ['Assessor', 'Approver']

  const [role, setRole] = createSignal('Assessor')
  const [name, setName] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [loggedin, setLoggedin] = createSignal(0)
  const [errorMessage, setErrorMessage] = createSignal('')
  const [connected, setConnected] = createSignal(true)
  // const [encryptionVersion, setEncryptionVersion] = createSignal('v2')
  // const [openTooltip, setOpenTooltip] = createSignal(false)
  const [openChanges, setOpenChanges] = createSignal(false)

  // let globalId = 0
  // let globalHashPassword = ''

  // const getEmployeeId = async (val: string) => {
  //   setName(val)
  //   const [id, idError] = await getApi('bd85b3fd3f45316eda64', val)
  //   if (idError !== null) return
    
  //   globalId = parseInt(id)
  //   await checkRegistered(val)
  // }

  const login = async () => {
    setConnected(await checkConnection())
    if (connected() === false) {
      setErrorMessage('No Connection on Server')
      return
    }

    const [employeeid] = await getApi('bd85b3fd3f45316eda64', name())
    const [dbpassword] = await getApi('49dd42b9454f27280be0', employeeid)
    const hashPassword = await securePassword(password())

    if (dbpassword === '0') {
      setErrorMessage('Not yet registered. Please proceed to Registration.')
    } else {
      setErrorMessage('Invalid Password, Try again.')
    }

    if (dbpassword === hashPassword) {
      // _employeeId.set(employeeid)
      // _employeeName.set(name())
      // saveEmployee()
      setLoggedin(2)
    } else {
      setLoggedin(1)
    }
  }

  // const generateSignature = () => {
  //   if (role() === 'APPROVER') {
  //     globalId = 276
  //     setName(APPROVERNAME)
  //   }
  //   const hash = SHA384(globalId.toString())
  //   const secondHash = MD5(hash.toString().substring(9))
  //   setSignature(`Use OCBO e-Sign Validator - scanid=${secondHash.toString().substring(24)}`)

  //   try {
  //     register()
  //     setSaved(true)
  //     updateRegistered()
  //   } catch {
  //     setSaved(false)
  //   }
  // }

  // const register = async () => {
  //   setConnected(await checkConnection())
  //   if (connected() === false) {
  //     setErrorMessage('No Connection on Server')
  //     return
  //   }

  //   await securePassword()
  //   const blob = new Blob(file())
  //   const base64 = await convertBase64(blob)
  //   setBase64image(base64 as string)

  //   await postApi('4cd315b87a-31cb2f5dcb', { data: globalId, data2: globalHashPassword, data3: signature(), data4: base64 })
  // }

  const getDate = () => {
    const today = new Date()
    const formattedDate = dayjs(today).format('YYYY-MM-DD HH:mm:ss Z')
    return formattedDate
  }

  // const securePassword = async () => {
  //   const firstHashing = SHA1(password())
  //   const secondHashing = SHA384(firstHashing.toString())
  //   const thirdHashing = SHA1(secondHashing.toString())
  //   globalHashPassword = thirdHashing.toString()
  // }

  const convertBase64 = (blob: Blob) => {
    return new Promise((resolve, _) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  }

  // const checkRegistered = async (name: string) => {
  //   try {
  //     const [registered, registeredError] = await getApi('b510fedf6baafb232a3a', name)
  //     if (registeredError !== null) return
      
  //     if (registered > 0) {
  //       setAllow(1)
  //     } else {
  //       setAllow(2)
  //     }
  //   } catch {
  //     setAllow(2)
  //   }
  // }

  const getAssessors = async (): Promise<string[]> => {
    let assessorsNameList: string[] = []

    const [assessors, assessorsError] = await getApi('e60dbde84b2a5307d399')
    if (assessorsError !== null) return []
    
    assessorsNameList = [...assessors]
    return [...assessorsNameList]
  }

  const updateRegistered = async () => {
    const registered = await getAssessors()
    sessionStorage.setItem('assessors', JSON.stringify([...registered]))
  }

  const gotoIndex = () => {
    navigate('/')
  }

  onSettled(() => {
    const hh = _headName.get()
    console.log(hh)
  })

  // createEffect(() => {
  //   if (role() === 'Approver') setName(APPROVERNAME)
  //   else if (role() !== 'Approver' && name() === APPROVERNAME) setName('')
  // })

  // onSettled(() => {
  //   const auto = sessionStorage.getItem('auto_open_changes')
  //   if (!auto) setOpenChanges(true)
  //   // preFetch()
  // })

  return (
    <>
      <Page title='e-Sign - Login' alignment="column" font='roboto'>
        <Row content="split">
          <Link to="/esign">
            <Row content="left" gap={2}>
              <Image name="esign" size={160} />
              <h1>OCBO e-Sign</h1>
            </Row>
          </Link>

          <Link to="/esign">
            <Row content="right">
              <IoChevronBack size={45} />
              <span class="back-button-text">Back</span>
            </Row>
          </Link>
        </Row>

        <Row>
          <Box curved thickness={2} padding="2.25rem" color="#253849be" background="#04040660">
            <Row gap={4}>
              <Show when={role() !== 'ASSESSOR'}>
                <Clickable onClick={() => { setRole('ASSESSOR') }}>
                  <Box curved thickness={2} padding="1.25rem 0" color="#253849be" background="#57575c39" pointer width='12rem'>
                    <Column gap={0.5}>
                      <span class="box-selection">Assessor</span>
                      <small class="box-selection__small">Click to Switch</small>
                    </Column>
                  </Box>
                </Clickable>
              </Show>

              <Show when={role() === 'ASSESSOR'}>
                <Column gap={0.5}>
                  <span class="box-selection">Assessor</span>
                  <small class="box-selection__small">Mode</small>
                </Column>
              </Show>
              
              <span class="box-title">Login</span>

              <Show when={role() !== 'APPROVER'}>
                <Clickable onClick={() => { setRole('APPROVER') }}>
                  <Box curved thickness={2} padding="1.25rem 0" color="#253849be" background="#57575c39" pointer width='12rem'>
                    <Column gap={0.5}>
                      <span class="box-selection">Approver</span>
                      <small class="box-selection__small">Click to Switch</small>
                    </Column>
                  </Box>
                </Clickable>
              </Show>

              <Show when={role() === 'APPROVER'}>
                <Column gap={0.5}>
                  <span class="box-selection">Approver</span>
                  <small class="box-selection__small">Mode</small>
                </Column>
              </Show>
            </Row>

            <Show when={role() === 'ASSESSOR'}>
              <Padding top={2} bottom={0} left={0} right={0}>
                <Row content='center'>
                  <h4>List of Assessors</h4>
                </Row>
                <Dropdown options={assessors} />
                
                <h4>Password</h4>
                {/*<Input isPassword value={password()} onChange={setPassword}></Input>*/}
              </Padding>
            </Show>

            <Show when={role() === 'APPROVER'}>
               <Padding top={2} bottom={0} left={0} right={0}>
              <h4>Name of Approver</h4>
              <span class="approver-name">{APPROVERNAME}</span>

              <h4>Password</h4>
              {/*<Input isPassword value={password()} onChange={setPassword}></Input>*/}

              <Padding top={2} left={0} right={0} bottom={0}>
                <Show when={password() && name()}>
                  <Row>
                    <Button corner="curved" design="bootstrap-primary" label="Login" wide onClick={login}></Button>
                  </Row>
                </Show>

                <Show when={!password() && name()}>
                  <Row>
                    <span class="required-login">Required password</span>
                  </Row>
                </Show>

                <Show when={!password() && !name()}>
                  <Row>
                    <span class="required-login">Required name and password</span>
                  </Row>
                </Show>

                <Show when={password() && !name()}>
                  <Row>
                    <span class="required-login">Required name</span>
                  </Row>
                </Show>
                </Padding>
               </Padding>
            </Show>
          </Box>
        </Row>
      </Page>

      {/*<div onClick={gotoIndex}>
        <Modal trigger={saved()} background="#ffffffff" color="#000000e4" opacity={0.6}>
          <Padding top={1} bottom={1} left={4} right={4}>
            <Column>
              <Row>
                <Box curved thickness={3} color="black" padding="1rem">
                  <h2>e-Sign Registration Completed</h2>
                </Box>
              </Row>
              <Row>
                <h3>Representation of your digital signature</h3>
              </Row>

              <Row gap={1}>
                <QR value={signature()} width={10} />
                <section class="digital-sign-details">
                  <div>
                    <img class="digital-sign-details__image" src={base64image()} alt="Image of signature" />
                  </div>
                  <span>Digitally signed by:</span>
                  <span>{name()}</span>
                  <span>Date: {getDate()}</span>
                </section>
              </Row>

              <Row>
                <span class="sub-message">Click anywhere to close</span>
              </Row>
            </Column>
          </Padding>
        </Modal>
      </div>

      <div onClick={() => setConnected(true)}>
        <Modal trigger={connected() === false} background="#562020ff" color="#ffebebe6" opacity={0.8}>
          <Padding top={1} bottom={1} left={4} right={4}>
            <Column>
              <Row>
                <Box curved thickness={3} color="#ffebebe6" padding="1rem">
                  <h2>Connection Error</h2>
                </Box>
              </Row>

              <Row>
                <h3>{errorMessage()}</h3>
              </Row>

              <Row>
                <span class="close-text">Click anywhere to close</span>
              </Row>
            </Column>
          </Padding>
        </Modal>
      </div>*/}
    </>
  )
}
