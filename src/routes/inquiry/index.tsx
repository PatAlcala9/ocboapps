import { createSignal, onSettled } from 'solid-js'
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
    } else if (/^\d{2}-\d{5}$/.test(inquire())) {
      setInquireType('application-search')
      setDivision('occupancy')
    } else if (/^\d{2}-\d{7}$/.test(inquire())) {
      setInquireType('application-search')
      setDivision('electrical')
    }
  }

  const checkExist = async (application: string, division: string) => {
    let exist
    if (division === 'building') {
      ;[exist] = await getApi('64c865b30db7f100e693', application)
    } else if (division === 'electrical') {
      ;[exist] = await getApi('b5ed34d7d9b827dbd966', application)
    }

    if (exist.result === '1') setResult(true)
    else {
      setError(true)
      setErrorMessage('No Application found')
    }
  }

  const startInquire = () => {
    checkInquireType()
    if (inquireType() === 'application-search') checkExist(inquire(), division())
    else console.log('yeah')
  }

  const gotoPage = async (page: string) => {
    setPage(page)
    navigate(page)
  }

  const init = async () => {
    setPage('/inquiry')
  }

  onSettled(() => {
    init()
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
          <Input placeholder='Enter application to inquire' value={inquire()} onChange={setInquire} size={1.25} width='460px' corner='rounded' fontWeight={400} center onKeyDown={(event) => event.key === 'Enter' && startInquire()} />
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
        <Modal trigger={result()} background='black' animation='slide-from-right'>
          <h1>Hello</h1>
        </Modal>
      </div>
    </>
  )
}
