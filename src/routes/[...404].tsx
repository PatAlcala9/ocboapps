import dayjs from 'dayjs'
import { onSettled, createSignal, Switch, Match } from 'solid-js'
import type { RouteDefinition } from '@solidjs/router'
import { httpStatus } from '@solidjs/web'
import { Column, Image, Padding, Page, Background, Button } from '@dasig'
import { checkConnection, getDateTime } from 'services'
import './index.sass'

export const route = {
  preload: () => httpStatus(404),
} satisfies RouteDefinition

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
  // oxlint-disable-next-line typescript/no-floating-promises
  init()
})

export default function NotFound() {
  return (
    <Page title='Not Found - OCBO Apps' font='inter'>
      <Background image='background2026' />

      <Switch>
        <Match when={holiday() === 'CHRISTMAS'}>
          <Background image='background-christmas' />
        </Match>

        <Match when={holiday() === 'VALENTINES'}>
          <Background image='background-valentines' />
        </Match>
      </Switch>

      <Padding top={4}>
        <Column>
          <Image name='ocbo-portal' size={100} />
          <h1 class='not-found'>Invalid Page</h1>

          <Button label='Go to OCBO Apps' design='bootstrap-primary' corner='curved' to='/' width='15rem' />
        </Column>
      </Padding>
    </Page>
  )
}
