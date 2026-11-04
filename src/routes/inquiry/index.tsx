import { createSignal, flush, onSettled, Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { Page, Background, Footer, Image, Row, Copyright, Padding, Input, Clickable, Box, Modal, Column } from '@dasig'
import { setPage } from 'services'
import { _page } from 'stores/page'
import './index.sass'
import { getApi } from '@dasig/api'

export default () => {
  const navigate = useNavigate()
  const [inquire, setInquire] = createSignal('')
  const [inquireType, setInquireType] = createSignal('')
  const [result, setResult] = createSignal(false)
  const [error, setError] = createSignal(false)
  const [errorMessage, setErrorMessage] = createSignal('')
  const [application, setApplication] = createSignal('')
  const [division, setDivision] = createSignal('')

  const checkInquireType = () => {
    if (/^\d{2}-\d{6}$/.test(inquire())) {
      setInquireType('application-search')
      setDivision('building')
      flush()
    } else if (/^\d{2}-\d{5}$/.test(inquire())) {
      setInquireType('application-search')
      setDivision('occupancy')
      flush()
    } else if (/^\d{2}-\d{7}$/.test(inquire())) {
      setInquireType('application-search')
      setDivision('electrical')
      flush()
    }
  }

  const checkExist = async (application: string, division: string): Promise<boolean> => {
    let exist
    if (division === 'building') {
      ;[exist] = await getApi('64c865b30db7f100e693', application)
    } else if (division === 'electrical') {
      ;[exist] = await getApi('b5ed34d7d9b827dbd966', application)
    }

    return exist.result === '1'
  }

  const startInquire = async () => {
    checkInquireType()

    if (inquireType() === 'application-search') {
      setApplication(inquire())
      flush()

      const existing = await checkExist(inquire(), division())
      if (existing) {
        setResult(true)
        flush()
      } else {
        setErrorMessage('Application number does not exist')
        setError(true)
        setResult(true)
        flush()
      }
    } else console.log('yeah')
  }

  const gotoPage = async (page: string) => {
    await setPage(page)
    navigate(page)
  }

  const init = async () => {
    await setPage('/inquiry')
  }

  onSettled(() => {
    void init()
  })

  return (
    <>
      <Page title='OCBO Inquiry' font='roboto'>
        <Background image='background-inquiry' />

        <Row content='right'>
          <Clickable onClick={() => gotoPage('/')}>
            <Box curved thickness={0} padding='0 1rem 0 0'>
              <Image name='ocbo-portal' size={32}></Image>
            </Box>
          </Clickable>
        </Row>

        <Column>
          <Clickable onClick={() => setResult(true)}>
            <Image name='inquiry' size={140} />
          </Clickable>
          <h1 class='title'>OCBO Inquiry</h1>
          <Row padding='1rem 0 0 0'>
            <Input placeholder='Enter application to inquire' value={inquire()} onChange={setInquire} size={1.25} width='460px' corner='rounded' fontWeight={400} center onKeyDown={(event) => event.key === 'Enter' && startInquire()} />
          </Row>
        </Column>

        <Footer margin={1}>
          <Row content='split'>
            <Row content='left' gap={1}>
              <Image name='davao-life' size={200} />

              <Row content='left' gap={0.5}>
                <Image name='ocbologo' size={30} />
                <Copyright />
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
      </Page>

      <div onClick={() => setResult(false)}>
        <Modal trigger={result()} background='rgba(6, 7, 9, 0.49)' animation='slide-from-right' width='95vw'>
          <Row content='left' padding='1rem 0'>
            <span class='results__inquire'>{application()}</span>
          </Row>
          <Show when={!error()}>
            <Row content='center' padding='2rem 0'>
              <span class='results__error'>Yeah</span>
            </Row>
          </Show>
          <Show when={error()}>
            <Row content='center' padding='2rem 0'>
              <span class='results__error'>{errorMessage()}</span>
            </Row>
          </Show>
        </Modal>
      </div>
    </>
  )
}
