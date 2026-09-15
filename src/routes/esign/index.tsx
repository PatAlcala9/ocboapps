import { onSettled, createSignal } from 'solid-js'
import { Show } from 'solid-js'
import { Box, Button, Column, Copyright, Display, Footer, Image, Page, Row, Background } from '@dasig'
import { checkConnection } from '../../utils'
import { RiBusinessGlobalOffLine } from 'solid-icons/ri'
import './index.sass'
import { getApi } from '@dasig/api'
import { _headName } from '../../stores/head'

let assessorsNameList: string[]
let registeredNameList: string[]
let headName: string
let headId: string

const [connected, setConnected] = createSignal(true)

export default () => {
  const getAssessors = async () => {
    const [assessors, asserrorsError] = await getApi('e60dbde84b2a5307d399')
    if (asserrorsError === null) return
    
    assessorsNameList = [...assessors]
    sessionStorage.setItem('assessors', JSON.stringify([...assessorsNameList]))
  }

  const getRegistered = async () => {
    const [registered, registeredError] = await getApi('289da0205ab91ea94824')
    if (registeredError === null) return
    
    registeredNameList = [...registered]
    sessionStorage.setItem('registered', JSON.stringify([...registeredNameList]))
  }

  const getHead = async () => {
    const [response, responseError] = await getApi('5a211530266757b41510')
    if (responseError === null) return
    
    headName = response
    _headName.set(headName)
    // sessionStorage.setItem('head', headName)
  }

  const getHeadId = async () => {
    const [response, responseError] = await getApi('81af1f8ce65c9194a0f0')
    if (responseError === null) return
    
    headId = response
    sessionStorage.setItem('headid', headId)
  }

  const clearCache = async () => {
    const cacheNames = await caches.keys()
    for (let i = 0; i < cacheNames.length; i++) {
      await caches.delete(cacheNames[i])
    }
  }

  const init = async () => {
    setConnected(await checkConnection())
    await clearCache()
    await getAssessors()
    await getRegistered()
    await getHead()
    await getHeadId()
  }

  onSettled(() => {
    init()
  })

  return (
    <>
      <Page title='e-Sign'>
        <Background image="background-esign" />
        
        <Display desktop>
          <Row content="split">
            <Row content="left" gap={2}>
              <Image name='esign' size={200} />
              <h1>OCBO e-Sign</h1>
            </Row>

            <Show when={connected()}>
              <Box curved thickness={0} padding="0.75rem 1.25rem" background="#0f131d56">
                <Row content="left" gap={1}>
                  <Button label="Login" edges="curved" design="bootstrap-link" to="/esign/login" />
                  <Button label="Register" edges="curved" design="bootstrap-primary" to="/esign/register" />
                </Row>
                </Box>
            </Show>
            <Show when={!connected()}>
              <Box curved thickness={0} padding="0.75rem 1.25rem" background="#b21f2d56">
                <Column alignment='center'>
                  <Row content="left" gap={1}>
                    <RiBusinessGlobalOffLine size={24} color="#e5585dba" />
                    <span class={"offline-text"}>OFFLINE</span>
                    <Button label="Login" edges="curved" design="bootstrap-dark" />
                    <Button label="Register" edges="curved" design="bootstrap-danger" />
                  </Row>
                  <Row content='left'><a class='offline-message'>Please check your server connection and reload the page</a></Row>
                </Column>
              </Box>
            </Show>
          </Row>

          <Row content="split">
            <Box curved thickness={0} padding="2.75rem 2rem" background="#0f131d56">
              <section class="title">
                <h1 class="title__main">Secure e-Signature</h1>
                <span class="title__sub">for Office of the City Building Official</span>
                <p class="title__paragraph">A paperless and effortless solution on signing permits</p>
              </section>
            </Box>

            <Display desktop>
              <Column padding="3rem 0 0 0">
                <Image name="esignbody" size={410} />
              </Column>
            </Display>
          </Row>

          <Footer margin={1}>
            <Row content="split">
              <Row gap={0.5}>
                <Image name='ocbologo' size={20} />
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
            </Row>
          </Footer>
        </Display>

        <Display tablet>
            <Row content="split">
              <Row content="left" gap={2}>
                <Image name="esign" size={150} />
                <h1>OCBO e-Sign</h1>
              </Row>

              <Show when={connected()}>
                <Box curved thickness={0} padding="0.75rem 1.25rem" background="#0f131d56">
                  <Row content="left" gap={1}>
                    <Button label="Login" edges="curved" design="bootstrap-link" to="/login" />
                    <Button label="Register" edges="curved" design="bootstrap-primary" to="/register" />
                  </Row>
                </Box>
              </Show>
              <Show when={!connected()}>
                <Box curved thickness={0} padding="0.75rem 1.25rem" background="#b21f2d56">
                  <Column alignment='center'>
                    <Row content="left" gap={1}>
                      <RiBusinessGlobalOffLine size={24} color="#e5585dba" />
                      <span class={"offline-text"}>OFFLINE</span>
                      <Button label="Login" edges="curved" design="bootstrap-dark" />
                      <Button label="Register" edges="curved" design="bootstrap-danger" />
                    </Row>
                    <Row content='left'><a class='offline-message'>Please check your server connection and reload the page</a></Row>
                  </Column>
                </Box>
              </Show>
            </Row>

            <Row content="split">
              <Box curved thickness={0} padding="2.75rem 2rem" background="#0f131d56">
                <section class="title">
                  <h1 class="title__main">Secure e-Signature</h1>
                  <span class="title__sub">for Office of the City Building Official</span>
                  <p class="title__paragraph">A paperless and effortless solution on signing permits</p>
                </section>
              </Box>

              <Column padding="3rem 0 0 0">
                <Image name='esignbody' size={140} />
              </Column>
            </Row>

          <Footer>
            <Row content="split">
              <Row gap={0.5}>
                <Image name="ocbologo" size={20} />
                <Row gap={0.25}>
                  <Copyright />
                  <span>Davao City, Philippines</span>
                </Row>
              </Row>

              <Row gap={0.25}>
                <span>Developed by:</span>
                <Image name='patalcala' size={70} />
                <span>Pat Alcala</span>
              </Row>
            </Row>
          </Footer>
        </Display>

        <Display mobile>
          <Column>
            <Image name="esign" size={120} />
            <h1>OCBO e-Sign</h1>
            <span>Please use OCBO e-Sign Mobile Version</span>
          </Column>
        </Display>
      </Page>
    </>
  )
}
