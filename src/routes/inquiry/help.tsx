import { createSignal, flush, onSettled } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { Page, Background } from '@dasig'
import { setPage } from 'services'
import { _page } from 'stores/page'
import './help.sass'

export default () => {
  const navigate = useNavigate()

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
      </Page>
    </>
  )
}
