import dayjs from 'dayjs'
import { createEffect, createSignal, onSettled, Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { IoChevronBack } from 'solid-icons/io'
import { Box, Button, Column, Link, Padding, Page, Row, Image, Clickable, Combobox, Input, File, Background } from '@dasig'
import { getApi, postApi } from '@dasig/api'
import { md5, sha1, sha384 } from '@dasig/hash'
import { checkConnection, getDateTime } from '../../utils'
import { _headName } from 'stores/head'
import { $assessor_list } from 'cache/list'
import './register.sass'
import { $head } from 'cache/head'

export default () => {
  const navigate = useNavigate()
  // const APPROVERNAME = sessionStorage.getItem('head')!

  const [role, setRole] = createSignal('')
  const [name, setName] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [cpassword, setCPassword] = createSignal('')
  const [signature, setSignature] = createSignal('')
  const [saved, setSaved] = createSignal(false)
  const [file, setFile] = createSignal<File[]>()
  const [base64image, setBase64image] = createSignal('')
  const [allow, setAllow] = createSignal(0)
  const [connected, setConnected] = createSignal(true)
  const [errorMessage, setErrorMessage] = createSignal('')
  const [assessors, setAssessors] = createSignal([])
  const [approver, setApprover] = createSignal('')

  let globalId = 0
  let globalHashPassword = ''

  const getEmployeeId = async (val: string) => {
    setName(val)
    const [id] = await getApi('bd85b3fd3f45316eda64', val)

    globalId = parseInt(id)
    await checkRegistered(val)
  }

  const generateSignature = () => {
    if (role() === 'APPROVER') {
      globalId = 276
      setName(approver())
    }
    const hash = sha384(globalId.toString())
    const secondHash = md5(hash.toString().substring(9))
    setSignature(`Use OCBO e-Sign Validator - scanid=${secondHash.toString().substring(24)}`)

    try {
      register()
      setSaved(true)
      updateRegistered()
    } catch {
      setSaved(false)
    }
  }

  const register = async () => {
    setConnected(await checkConnection())
    if (connected() === false) {
      setErrorMessage('No Connection on Server')
      return
    }

    await securePassword()
    const blob = new Blob(file())
    const base64 = await convertBase64(blob)
    setBase64image(base64 as string)

    await postApi('4cd315b87a-31cb2f5dcb', { data: globalId, data2: globalHashPassword, data3: signature(), data4: base64 })
  }

  const getDate = async () => {
    const today = await getDateTime()
    const formattedDate = dayjs(today).format('YYYY-MM-DD HH:mm:ss Z')
    return formattedDate
  }

  const securePassword = async () => {
    const firstHashing = sha1(password())
    const secondHashing = sha384(firstHashing.toString())
    const thirdHashing = sha1(secondHashing.toString())
    globalHashPassword = thirdHashing.toString()
  }

  const convertBase64 = (blob: Blob) => {
    return new Promise((resolve, _) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  }

  const checkRegistered = async (name: string) => {
    try {
      const [registered, registeredError] = await getApi('b510fedf6baafb232a3a', name)
      if (registeredError !== null) return

      if (registered > 0) {
        setAllow(1)
      } else {
        setAllow(2)
      }
    } catch {
      setAllow(2)
    }
  }

  const getAssessors = async (): Promise<string[]> => {
    const assessorsList = $assessor_list.get()!
    const assessorListJSON = JSON.parse(assessorsList)
    setAssessors(assessorListJSON)

    return [...assessorListJSON]
  }

  const getApprover = async () => {
    const head = $head.get()!
    setApprover(head)
  }

  const updateRegistered = async () => {
    const registered = await getAssessors()
    sessionStorage.setItem('assessors', JSON.stringify([...registered]))
  }

  const gotoIndex = () => {
    navigate('/esign')
  }

  const init = async () => {
    getAssessors()
    getApprover()
  }

  // createEffect(() => {
  //   // if (role() === 'APPROVER') {
  //   //   try {
  //   //     const registered = await getApi('b510fedf6baafb232a3a', APPROVERNAME)
  //   //     if (registered > 0) {
  //   //       setAllow(1)
  //   //     } else {
  //   //       setAllow(2)
  //   //     }
  //   //   } catch {
  //   //     setAllow(2)
  //   //   }
  //   // }
  // })

  onSettled(() => {
    init()
  })

  return (
    <>
      <Page title='e-Sign - Register' alignment='column' font='roboto'>
        <Background image='background-esign' />

        <Row content='split'>
          <Link to='/esign'>
            <Row content='left' gap={2}>
              <Image name='esign' size={160} />
              <h1>OCBO e-Sign</h1>
            </Row>
          </Link>

          <Link to='/esign'>
            <Row content='right' margin='0 2rem'>
              <IoChevronBack size={45} />
              <span class='back-button-text'>Back</span>
            </Row>
          </Link>
        </Row>

        <Row>
          <Box curved thickness={2} padding='2.25rem' color='#253849be' background='#04040660'>
            <Row gap={4}>
              <Show when={role() !== 'ASSESSOR'}>
                <Clickable
                  onClick={() => {
                    setRole('ASSESSOR')
                  }}
                >
                  <Box curved thickness={2} padding='1.25rem 0' color='#253849be' background='#57575c39' pointer width='12rem'>
                    <Column gap={0.5}>
                      <span class='box-selection'>Assessor</span>
                      <small class='box-selection__small'>Click to Switch</small>
                    </Column>
                  </Box>
                </Clickable>
              </Show>

              <Show when={role() === 'ASSESSOR'}>
                <Column gap={0.5}>
                  <span class='box-selection'>Assessor</span>
                  <small class='box-selection__small'>Mode</small>
                </Column>
              </Show>

              <span class='box-title'>Registration</span>

              <Show when={role() !== 'APPROVER'}>
                <Clickable
                  onClick={() => {
                    setRole('APPROVER')
                  }}
                >
                  <Box curved thickness={2} padding='1.25rem 0' color='#253849be' background='#57575c39' pointer width='12rem'>
                    <Column gap={0.5}>
                      <span class='box-selection'>Approver</span>
                      <small class='box-selection__small'>Click to Switch</small>
                    </Column>
                  </Box>
                </Clickable>
              </Show>

              <Show when={role() === 'APPROVER'}>
                <Column gap={0.5}>
                  <span class='box-selection'>Approver</span>
                  <small class='box-selection__small'>Mode</small>
                </Column>
              </Show>
            </Row>

            <Show when={role() === 'ASSESSOR'}>
              <Row content='center' padding='3rem 0 0 0'>
                <h4>List of Assessors</h4>
              </Row>
              <Combobox options={assessors()} placeholder='Select your name' value={name()} onChange={(val) => getEmployeeId(val!)} width='22.25rem' />

              <Show when={allow() === 2}>
                <h4>Password</h4>
                <Input type='password' value={password()} onChange={setPassword} width='20.5rem' center />
                <h4>Confirm Password</h4>
                <Input type='password' value={cpassword()} onChange={setCPassword} width='20.5rem' center />
                <h4>Upload Signature</h4>
                <File maxFiles={1} onFileAccept={(data) => setFile(data)} accept='.jpg, .jpeg, .png, .webp, .avif' onClick={() => setFile()} label='Drag and drop or click to upload file' buttonText='Delete' />

                <Padding top={2}>
                  <Show when={file() && password() && cpassword()}>
                    <Show when={password().length < 4}>
                      <Row>
                        <span class='already-registered'>Password too short</span>
                      </Row>
                    </Show>

                    <Show when={password().length >= 4 && password() !== cpassword()}>
                      <Row>
                        <span class='already-registered'>Passwords do not match</span>
                      </Row>
                    </Show>

                    <Show when={password().length >= 4 && password() === cpassword()}>
                      <Row>
                        <Button corner='curved' design='bootstrap-primary' label='Register' onClick={generateSignature} width='100%' />
                      </Row>
                    </Show>
                  </Show>

                  <Show when={!password() || !cpassword() || !file()}>
                    <Row>
                      <span class='already-registered'>{!password() && !cpassword() && !file() ? 'Required password, confirmation password, and signature' : !password() ? 'Required password' : !cpassword() ? 'Required password confirmation' : !file() ? 'Required signature' : ''}</span>
                    </Row>
                  </Show>
                </Padding>
              </Show>

              <Show when={allow() === 1}>
                <Padding top={2}>
                  <Row>
                    <span class='already-registered'>Already Registered</span>
                  </Row>
                </Padding>
              </Show>
            </Show>

            <Show when={role() === 'APPROVER'}>
              <Padding top={3}>
                <h4>Name of Approver</h4>
                <span class='approver-name'>{approver()}</span>

                <h4>Password</h4>
                <Input type='password' value={password()} onChange={setPassword} width='20.5rem' center />
                <h4>Confirm Password</h4>
                <Input type='password' value={cpassword()} onChange={setCPassword} width='20.5rem' center />

                <Show when={allow() === 2}>
                  <h4>Upload Signature</h4>
                  <File maxFiles={1} onFileAccept={(data) => setFile(data)} accept='.jpg, .jpeg, .png, .webp, .avif' onClick={() => setFile()} label='Drag and drop or click to upload file' buttonText='Delete' />

                  <Padding top={2}>
                    <Show when={file() && password()}>
                      <Row>
                        <Button corner='curved' design='bootstrap-primary' label='Register' onClick={generateSignature} width='100%' />
                      </Row>
                    </Show>

                    <Show when={file() && !password()}>
                      <Row>
                        <span class='already-registered'>Required password</span>
                      </Row>
                    </Show>

                    <Show when={!file() && password()}>
                      <Row>
                        <span class='already-registered'>Required signature</span>
                      </Row>
                    </Show>

                    <Show when={!file() && !password()}>
                      <Row>
                        <span class='already-registered'>Required password and signature</span>
                      </Row>
                    </Show>
                  </Padding>
                </Show>

                <Show when={allow() === 1}>
                  <Padding top={2}>
                    <Row>
                      <span class='already-registered'>Already Registered</span>
                    </Row>
                  </Padding>
                </Show>
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
