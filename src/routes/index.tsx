import dayjs from 'dayjs'
import { createSignal, Switch, Match, onSettled } from 'solid-js'
import { Column, Display, Image, Padding, Page, Row, Background, Footer, Copyright } from '@dasig'
import { checkConnection, getDateTime } from '../utils'
import Card from 'components/Card'
import './index.sass'

const [connected, setConnected] = createSignal(true)
const [month, setMonth] = createSignal('')
const [day, setDay] = createSignal('')
const [holiday, setHoliday] = createSignal('')

const getDate = async () => {
  let today
  if (connected()) today = await getDateTime()
  else today = new Date()

  setMonth(dayjs(today).format('MMMM'))
  setDay(dayjs(today).format('DD'))
  setHoliday('NORMAL')
}

const checkSpecialHolidays = () => {
  if (month().toUpperCase() === 'DECEMBER') setHoliday('CHRISTMAS')
  else if (month().toUpperCase() === 'FEBRUARY' && day() === '14') setHoliday('VALENTINES')
  else setHoliday('NORMAL')
}

const init = async () => {
  setConnected(await checkConnection())

  if (connected()) {
    await getDate()
    checkSpecialHolidays()
  } else {
    setHoliday('NORMAL')
  }
}

onSettled(() => {
  init()
})

export default () => {
  return (
    <Page title='OCBO Apps' font='inter'>
      <Display desktop tablet>
        <Background image='background2026' />

        <Switch>
          <Match when={holiday() === 'CHRISTMAS'}>
            <Background image='background-christmas' />
          </Match>

          <Match when={holiday() === 'VALENTINES'}>
            <Background image='background-valentines' />
          </Match>
        </Switch>

        <Row gap={0.5} content='left'>
          <Image name='ocbo-portal' size={65} />
          <span class='logo-text'>OCBO Apps Portal</span>
        </Row>

        <Row content='center'>
          <Switch>
            <Match when={holiday() === 'CHRISTMAS'}>
              <span class='welcome'>Merry Christmas</span>
            </Match>
            <Match when={holiday() === 'VALENTINES'}>
              <span class='welcome'>Happy Valentines Day</span>
            </Match>
            <Match when={holiday() === 'NORMAL'}>
              <span class='welcome'>Welcome</span>
            </Match>
          </Switch>
        </Row>

        <Row content='center'>
          <h1 class='portal-title'>Office of the City Building Official Application Portal</h1>
        </Row>

        <Row gap={2.5}>
          <Card image='esign' name='OCBO e-Sign' description='A secure way of signing permits' site='/esign' />
        </Row>
      </Display>

      <Display mobile>
        <Background image='background2026-mobile' />
        <Column gap={0.5} content='center'>
          <Image name='ocbo-portal' size={120} />
          <span class='logo-text'>OCBO Apps Portal</span>
        </Column>

        <Padding top={4} bottom={2}>
          <Column gap={1.5}>
            <Card image='esign' name='OCBO e-Sign' description='A secure way of signing permits' site='/esign' />
          </Column>
        </Padding>
      </Display>

      <Footer margin={1}>
        <section class='footer'>
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
        </section>
      </Footer>
    </Page>
  )
}
