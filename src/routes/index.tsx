import { Column, Display, Image, Padding, Page, Row, Background, Footer, Copyright } from "@dasig";
import { checkConnection } from '../utils'
import Card from "components/Card";
import { onSettled, createSignal, Switch, Match } from 'solid-js'
import { getApi } from '@dasig/api'
import dayjs from "dayjs";
import "./index.sass";

const [connected, setConnected] = createSignal(true)
const [month, setMonth] = createSignal('')
const [day, setDay] = createSignal('')
const [holiday, setHoliday] = createSignal('')

const getDate = async () => {
  const [response, responseError] = await getApi('9b8252593c09cbd0533d')
  if (responseError !== null) return

  setMonth(dayjs(response.result).format('MMMM'))
  setDay(dayjs(response.result).format('DD'))
}

const checkSpecialHolidays = () => {
  if (month().toUpperCase() === 'DECEMBER') setHoliday('CHRISTMAS')
    else if (month().toUpperCase() === 'FEBRUARY' && day() === '14') setHoliday('VALENTINES')
      else setHoliday('NORMAL')
}

const init = async () => {
  setConnected(await checkConnection())
  await getDate()
  checkSpecialHolidays()
}

onSettled(() => {
  init()
})

export default () => {
  return (
      <Page title="OCBO Apps" font="inter">
        
      <Display desktop tablet>
        <Switch>
          <Match when={holiday() === 'CHRISTMAS'}>
             <Background image="background-christmas" />
          </Match>

          <Match when={holiday() === 'VALENTINES'}>
             <Background image="background-valentines" />
          </Match>

          <Match when={holiday() === 'NORMAL'}>
             <Background image="background2026" />
          </Match>
        </Switch>
      
        <Row gap={0.5} content="left">
          <Image name="ocbo-portal" size={65} />
          <span class="logo-text">OCBO Apps Portal</span>
        </Row>

        <Row content="center">
          <Switch>
            <Match when={holiday() === 'CHRISTMAS'}>
              <span class="welcome">Merry Christmas</span>
            </Match>
            <Match when={holiday() === 'VALENTINES'}>
              <span class="welcome">Happy Valentines Day</span>
            </Match>
            <Match when={holiday() === 'NORMAL'}>
             <span class="welcome">Welcome</span>
            </Match>
          </Switch>
        </Row>

        <Row content="center">
          <Column>
            <h1 class="portal-title">Office of the City Building Official Application Portal</h1>
          </Column>
        </Row>

        <Row gap={2.5}>
          <Card
            image="esign"
            name="OCBO e-Sign"
            description="A secure way of signing permits"
            site="/esign"
          />
        </Row>
      </Display>

      <Display mobile>
        <Background image="background2026-mobile" />
          <Column gap={0.5} content="center">
            <Image name="ocbo-portal" size={120} />
            <span class="logo-text">OCBO Apps Portal</span>
          </Column>

          <Padding top={4} bottom={2} left={0} right={0}>
            <Column gap={1.5}>
              <Card
                image="logo"
                name="OCBO e-Sign"
                description="A secure way of signing permits"
                site="/esign"
              />
            </Column>
          </Padding>
      </Display>

      <Footer margin={1}>
        <section class="footer">
        <Row content="split">
          <Row gap={0.5}>
            <Image name="ocbologo" size={20} />
            <Row gap={0.25}>
              <Copyright />
              <span>Davao City, Philippines</span>
            </Row>
          </Row>

          <Row gap={1}>
            <Row gap={0.25}>
              <span>Developed by:</span>
              <Image name="pat-alcala" size={70} />
              <span>Pat Alcala</span>
            </Row>

            <Row gap={0.25}>
              <span>Made with:</span>
              <Image name="logo" size={10} />
              <span>Dasig</span>
            </Row>
          </Row>
          </Row>
        </section>
      </Footer>
    </Page>
  );
};
