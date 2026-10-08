import { createSignal, onSettled, Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { IoChevronBack } from 'solid-icons/io'
import { Box, Button, Column, Link, Padding, Page, Row, Image, Modal, Clickable, Input, Combobox, Background } from '@dasig'
import { getApi } from '@dasig/api'
import { checkConnection, securePassword, checkPage } from '../../utils'
import { _headName, _headPassword } from 'stores/head'
import { _listElectricalApplications, _listElectricalNames } from 'stores/prefetch'
import { $head, $head_id } from 'cache/head'
import { $registered_list } from 'cache/list'
import { $logged_in, $login_role, $login_name, $login_id } from 'cache/login'
import './login.sass'
import { _page } from 'stores/page'

export default () => {
  const navigate = useNavigate()

  const [role, setRole] = createSignal('')
  const [name, setName] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [loggedin, setLoggedin] = createSignal(0)
  const [errorMessage, setErrorMessage] = createSignal('')
  const [connected, setConnected] = createSignal(true)
  const [head, setHead] = createSignal('')
  const [headId, setHeadId] = createSignal('')
  const [registeredList, setRegisteredList] = createSignal([])

  const login = async () => {
    let dbpassword
    let employeeid

    setConnected(await checkConnection())
    if (connected() === false) {
      setErrorMessage('No Connection on Server')
      return
    }

    if (role() === 'APPROVER') {
      const storepass = _headPassword.get()

      if (storepass.length > 0) {
        dbpassword = storepass
      } else {
        const [dbpass] = await getApi('49dd42b9454f27280be0', headId())
        dbpassword = dbpass.result
      }
    } else {
      const [dbemployeeid] = await getApi('bd85b3fd3f45316eda64', name())
      employeeid = dbemployeeid.result

      const [dbpass] = await getApi('49dd42b9454f27280be0', dbemployeeid.result)
      dbpassword = dbpass.result
    }
    const hashPassword = await securePassword(password())

    if (dbpassword === '0') {
      setErrorMessage('Not yet registered. Please proceed to Registration.')
    } else {
      setErrorMessage('Invalid Password, Try again.')
    }

    if (dbpassword === hashPassword) {
      if (role() === 'APPROVER') saveEmployee(headId(), head(), role())
      else saveEmployee(employeeid, name(), role())

      setLoggedin(2)

      $head.delete()
      $head_id.delete()

      navigateToRolePage()
    } else {
      setLoggedin(1)
    }
  }

  const saveEmployee = (id: string, name: string, role: string) => {
    $logged_in.set('true')
    $login_role.set(role)
    $login_name.set(name)
    $login_id.set(id)
  }

  const gotoApproval = () => {
    _page.set('/esign/approval')
    navigate('/esign/approval', { replace: true })
  }

  const gotoPrinting = () => {
    _page.set('/esign/printing')
    navigate('/esign/printing', { replace: true })
  }

  const navigateToRolePage = () => {
    if (role() === 'ASSESSOR') gotoPrinting()
    else gotoApproval()
  }

  const setApprover = async () => {
    setRole('APPROVER')

    const [dbpass] = await getApi('49dd42b9454f27280be0', headId())
    _headPassword.set(dbpass.result)

    // const [applicationsE, namesE] = await getListForApproval('electrical')
    // _listElectricalApplications.set(applicationsE)
    // _listElectricalNames.set(namesE)
  }

  const getHead = () => {
    setHead($head.get()!)
    setHeadId($head_id.get()!)
  }

  const getList = () => {
    const list = JSON.parse($registered_list.get()!)
    setRegisteredList(list)
  }

  onSettled(() => {
    checkPage()
    getHead()
    getList()
  })

  return (
    <>
      <Page title='e-Sign - Login' alignment='column' font='roboto'>
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
                  <span class='box-selection__selected'>Assessor</span>
                  <small class='box-selection__small__selected'>Mode</small>
                </Column>
              </Show>

              <span class='box-title'>Login</span>

              <Show when={role() !== 'APPROVER'}>
                <Clickable
                  onClick={() => {
                    setApprover()
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
                  <span class='box-selection__selected'>Approver</span>
                  <small class='box-selection__small__selected'>Mode</small>
                </Column>
              </Show>
            </Row>

            <Show when={role() === 'APPROVER'}>
              <Column width='100%' content='center'>
                <Padding top={4.5}>
                  <Padding bottom={1}>
                    <span class='approver-name'>{head()}</span>
                  </Padding>

                  <Input
                    center
                    value={password()}
                    onChange={setPassword}
                    type='password'
                    placeholder='Password'
                    width='63%'
                    size={1}
                    onKeyDown={(event: KeyboardEvent) => {
                      if (event.key === 'Enter') login()
                    }}
                  />

                  <Padding top={2}>
                    <Show when={password()}>
                      <Button corner='curved' design='bootstrap-primary' label='Login' width='68%' onClick={login} />
                    </Show>

                    <Show when={!password()}>
                      <Row>
                        <span class='required-login'>Required password</span>
                      </Row>
                    </Show>
                  </Padding>
                </Padding>
              </Column>
            </Show>

            <Show when={role() === 'ASSESSOR'}>
              <Column width='100%' content='center'>
                <Padding top={4.5}>
                  <Padding bottom={1}>
                    <Combobox options={registeredList()} placeholder="Assessor's Name" value={name()} onChange={setName} width='22.25rem' />
                  </Padding>

                  <Input
                    center
                    value={password()}
                    onChange={setPassword}
                    type='password'
                    placeholder='Password'
                    width='63%'
                    size={1}
                    onKeyDown={(event: KeyboardEvent) => {
                      if (event.key === 'Enter') login()
                    }}
                  />

                  <Padding top={2}>
                    <Show when={password() && name()}>
                      <Row>
                        <Button corner='curved' design='bootstrap-primary' label='Login' width='68%' onClick={login}></Button>
                      </Row>
                    </Show>

                    <Show when={!password() && name()}>
                      <Row>
                        <span class='required-login'>Required password</span>
                      </Row>
                    </Show>

                    <Show when={!password() && !name()}>
                      <Row>
                        <span class='required-login'>Required name and password</span>
                      </Row>
                    </Show>

                    <Show when={password() && !name()}>
                      <Row>
                        <span class='required-login'>Required name</span>
                      </Row>
                    </Show>
                  </Padding>
                </Padding>
              </Column>
            </Show>
          </Box>
        </Row>
      </Page>

      <div onClick={() => setLoggedin(0)}>
        <Modal trigger={loggedin() === 1} background='rgba(86, 32, 32, 0.8)' color='#ffebebe6' opacity={0.8} width='25rem' animation='bounce'>
          <Padding top={1} bottom={1}>
            <Column content='center'>
              <Row>
                <Box curved thickness={3} color='#ffebebe6' padding='1rem 2rem'>
                  <h2>Login Failed</h2>
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

      <div onClick={() => setConnected(true)}>
        <Modal trigger={connected() === false} background='rgba(86, 32, 32, 0.8)' color='#ffebebe6' opacity={0.8} width='25rem' animation='bounce'>
          <Padding top={1} bottom={1}>
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
    </>
  )
}
