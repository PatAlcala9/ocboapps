import dayjs from 'dayjs'
import { onSettled, createSignal, Switch, Match } from 'solid-js'
import type { RouteDefinition } from '@solidjs/router'
import { httpStatus } from '@solidjs/web'
import { Column, Image, Padding, Page, Background, Button } from '@dasig'
import { getApi } from '@dasig/api'
import { checkConnection } from '../utils'
import './index.sass'

export const route = {
  preload: () => httpStatus(404),
} satisfies RouteDefinition

const [connected, setConnected] = createSignal(true)
const [month, setMonth] = createSignal('')
const [day, setDay] = createSignal('')
const [holiday, setHoliday] = createSignal('')

const getDate = async () => {
  if (connected()) {
    const [response, responseError] = await getApi('9b8252593c09cbd0533d')
    if (responseError !== null) return

    setMonth(dayjs(response.result).format('MMMM'))
    setDay(dayjs(response.result).format('DD'))
    return
  }
  const today = new Date()
  setMonth(dayjs(today).format('MMMM'))
  setDay(dayjs(today).format('DD'))
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

export default function NotFound() {
  return (
    <Page title='Not Found - OCBO Apps' font='inter'>
      <Switch>
        <Match when={holiday() === 'CHRISTMAS'}>
          <Background image='background-christmas' />
        </Match>

        <Match when={holiday() === 'VALENTINES'}>
          <Background image='background-valentines' />
        </Match>

        <Match when={holiday() === 'NORMAL'}>
          <Background image='background2026' />
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
