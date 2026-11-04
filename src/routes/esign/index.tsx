import { onSettled, createSignal, Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { RiBusinessGlobalOffLine } from 'solid-icons/ri'
import { ImConnection } from 'solid-icons/im'
import { BiRegularQr } from 'solid-icons/bi'
import { Box, Button, Column, Copyright, Display, Footer, Image, Page, Row, Background, Clickable, Padding } from '@dasig'
import { getApi } from '@dasig/api'
import { checkConnection, setPage } from 'services'
import { _page } from 'stores/page'
import './index.sass'

import { $head, $head_id } from 'cache/head'
import { $assessor_list, $registered_list } from 'cache/list'

let assessorsNameList: string[]
let registeredNameList: string[]
let headName: string
let headId: string

const [connected, setConnected] = createSignal(true)
const [loading, setLoading] = createSignal(true)

export default () => {
  const navigate = useNavigate()

  const getAssessors = async () => {
    const [assessors, asserrorsError] = await getApi('e60dbde84b2a5307d399')
    if (asserrorsError !== null) return

    assessorsNameList = [...assessors.result]
    $assessor_list.set(JSON.stringify([...assessorsNameList]))
  }

  const getRegistered = async () => {
    const [registered, registeredError] = await getApi('289da0205ab91ea94824')
    if (registeredError !== null) return

    registeredNameList = [...registered.result]
    $registered_list.set(JSON.stringify([...registeredNameList]))
  }

  const getHead = async () => {
    const [response, responseError] = await getApi('5a211530266757b41510')
    if (responseError !== null) return

    headName = response.result
    $head.set(headName)
  }

  const getHeadId = async () => {
    const [response, responseError] = await getApi('81af1f8ce65c9194a0f0')
    if (responseError !== null) return

    headId = response.result
    $head_id.set(headId)
  }

  const gotoPage = async (page: string) => {
    await setPage(page)
    navigate(page)
  }

  const init = async () => {
    await setPage('/esign')

    const connection = await checkConnection()
    setConnected(connection)
    setLoading(false)

    if (connected()) {
      await getData()
    }
  }

  const gotoValidation = async () => {
    await setPage('/esign/validate')
    navigate('/esign/validate', { replace: true })
  }

  const getData = async () => {
    await Promise.all([getAssessors(), getRegistered(), getHead(), getHeadId()])
  }

  onSettled(() => {
    void init()
  })

  return (
    <>
      <Page title='OCBO e-Sign' font='roboto'>
        <Background image='background-esign' />

        <Display desktop>
          <Row content='split'>
            <Row content='left' gap={2}>
              <Image name='esign' size={200} />
              <h1>OCBO e-Sign</h1>
            </Row>

            <Row gap={0.5}>
              <Show when={loading()}>
                <Box curved thickness={0} padding='0.75rem 1.25rem' background='#090c1a57'>
                  <Column alignment='center'>
                    <Row content='left' gap={1}>
                      <ImConnection size={24} color='#fcfcfcba' />
                      <span class='checking-text'>CHECKING</span>
                      <Button label='Login' corner='curved' design='bootstrap-dark' />
                      <Button label='Register' corner='curved' design='bootstrap-dark' />
                    </Row>
                    <Row content='left'>
                      <a class='checking-message'>Please wait while we check for the server</a>
                    </Row>
                  </Column>
                </Box>
              </Show>

              <Show when={connected() && !loading()}>
                <Box curved thickness={0} padding='0.75rem 1.25rem' background='#0f131d56' margin='0 1rem'>
                  <Row content='left' gap={1}>
                    <Button label='Login' corner='curved' design='bootstrap-link' onClick={() => gotoPage('/esign/login')} />
                    <Button label='Register' corner='curved' design='bootstrap-primary' onClick={() => gotoPage('/esign/register')} />
                  </Row>
                </Box>
              </Show>

              <Show when={!connected() && !loading()}>
                <Box curved thickness={0} padding='0.75rem 1.25rem' background='#b21f2d56'>
                  <Column alignment='center'>
                    <Row content='left' gap={1}>
                      <RiBusinessGlobalOffLine size={24} color='#e5585dba' />
                      <span class={'offline-text'}>OFFLINE</span>
                      <Button label='Login' corner='curved' design='bootstrap-danger' />
                      <Button label='Register' corner='curved' design='bootstrap-danger' />
                    </Row>
                    <Row content='left'>
                      <a class='offline-message'>Please check your server connection and reload the page</a>
                    </Row>
                  </Column>
                </Box>
              </Show>

              <Clickable onClick={() => gotoPage('/')}>
                <Box curved thickness={0} padding='0 1rem 0 0'>
                  <Image name='ocbo-portal' size={32}></Image>
                </Box>
              </Clickable>
            </Row>
          </Row>

          <Row content='split'>
            <Box curved thickness={0} padding='2.75rem 2rem' background='#0f131d56'>
              <section class='title'>
                <h1 class='title__main'>Secure e-Signature</h1>
                <span class='title__sub'>for Office of the City Building Official</span>
                <p class='title__paragraph'>A paperless and effortless solution on signing permits</p>
              </section>
            </Box>

            <Display desktop>
              <Column padding='3rem 0 0 0'>
                <Image name='esignbody' size={410} />
              </Column>
            </Display>
          </Row>

          <Footer margin={1}>
            <Row content='split'>
              <Row gap={0.5}>
                <Image name='ocbologo' size={20} />
                <Row gap={0.25}>
                  <Copyright />
                  <span>Davao City, Philippines</span>
                </Row>
              </Row>

              <Row gap={1}>
                <Row gap={0.25}>
                  <span>Developed by:</span>
                  <Image name='pat-alcala' size={70} />
                  <span>Pat Alcala</span>
                </Row>

                <Row gap={0.25}>
                  <span>Made with:</span>
                  <Image name='logo' size={10} />
                  <span>Dasig</span>
                </Row>
              </Row>
            </Row>
          </Footer>
        </Display>

        <Display tablet>
          <Row content='split'>
            <Row content='left' gap={2}>
              <Image name='esign' size={150} />
              <h1>OCBO e-Sign</h1>
            </Row>

            <Row gap={0.5}>
              <Show when={loading()}>
                <Box curved thickness={0} padding='0.75rem 1.25rem' background='#090c1a57'>
                  <Column alignment='center'>
                    <Row content='left' gap={1}>
                      <ImConnection size={24} color='#fcfcfcba' />
                      <span class='checking-text'>CHECKING</span>
                      <Button label='Login' corner='curved' design='bootstrap-dark' />
                      <Button label='Register' corner='curved' design='bootstrap-dark' />
                    </Row>
                    <Row content='left'>
                      <a class='checking-message'>Please wait while we check for the server</a>
                    </Row>
                  </Column>
                </Box>
              </Show>

              <Show when={connected() && !loading()}>
                <Box curved thickness={0} padding='0.75rem 1.25rem' background='#0f131d56' margin='0 1rem'>
                  <Row content='left' gap={1}>
                    <Button label='Login' corner='curved' design='bootstrap-link' onClick={() => gotoPage('/esign/login')} />
                    <Button label='Register' corner='curved' design='bootstrap-primary' onClick={() => gotoPage('/esign/register')} />
                  </Row>
                </Box>
              </Show>

              <Show when={!connected() && !loading()}>
                <Box curved thickness={0} padding='0.75rem 1.25rem' background='#b21f2d56'>
                  <Column alignment='center'>
                    <Row content='left' gap={1}>
                      <RiBusinessGlobalOffLine size={24} color='#e5585dba' />
                      <span class={'offline-text'}>OFFLINE</span>
                      <Button label='Login' corner='curved' design='bootstrap-danger' />
                      <Button label='Register' corner='curved' design='bootstrap-danger' />
                    </Row>
                    <Row content='left'>
                      <a class='offline-message'>Please check your server connection and reload the page</a>
                    </Row>
                  </Column>
                </Box>
              </Show>

              <Clickable onClick={() => gotoPage('/')}>
                <Box curved thickness={0} padding='0 1rem 0 0'>
                  <Image name='ocbo-portal' size={32}></Image>
                </Box>
              </Clickable>
            </Row>
          </Row>

          <Row content='split'>
            <Box class='title' curved thickness={0} padding='2.75rem 2rem' background='#0f131d56' margin='4rem 0 0 0'>
              <h1 class='title__main'>Secure e-Signature</h1>
              <span class='title__sub'>for Office of the City Building Official</span>
              <p class='title__paragraph'>A paperless and effortless solution on signing permits</p>
            </Box>

            <Column padding='2rem 0 0 0'>
              <Image name='esignbody' size={140} />
            </Column>
          </Row>

          <Footer margin={0.5}>
            <Row content='split'>
              <Row gap={0.5}>
                <Image name='ocbologo' size={20} />
                <Row gap={0.25}>
                  <Copyright />
                  <span>Davao City, Philippines</span>
                </Row>
              </Row>

              <Row gap={1}>
                <Row gap={0.25}>
                  <span>Developed by:</span>
                  <Image name='pat-alcala' size={70} />
                  <span>Pat Alcala</span>
                </Row>

                <Row gap={0.25}>
                  <span>Made with:</span>
                  <Image name='logo' size={10} />
                  <span>Dasig</span>
                </Row>
              </Row>
            </Row>
          </Footer>
        </Display>

        <Display mobile>
          <Background image='esign-mobile-background' />

          <Column content='center'>
            <Padding top={2}>
              <Image name='esign-mobile' size={160} />
            </Padding>
            <h1>OCBO e-Sign</h1>
            <span class='mobile--subtitle'>Mobile</span>

            <Clickable onClick={gotoValidation}>
              <Box thickness={1} margin='10rem 0 0 0' padding='1rem 2rem' curved color='rgba(41, 60, 78, 0.914)' background='rgba(16, 22, 28, 0.58)'>
                <Column content='center' gap={0.5}>
                  <BiRegularQr size={50} />
                  <span>Validate</span>
                </Column>
              </Box>
            </Clickable>
          </Column>

          <Footer margin={0.5}>
            <Column content='split' gap={0.5}>
              <Row gap={0.5}>
                <Row gap={0.25}>
                  <Copyright />
                  <span>Davao City, Philippines</span>
                </Row>
              </Row>

              <Row gap={0.25}>
                <span>Developed by:</span>
                <Image name='pat-alcala' size={70} />
                <span>Pat Alcala</span>
              </Row>

              <Row gap={0.25}>
                <span>Made with:</span>
                <Image name='logo' size={10} />
                <span>Dasig</span>
              </Row>
            </Column>
          </Footer>
        </Display>
      </Page>
    </>
  )
}
