import { onSettled } from 'solid-js'
import { Page, Background } from '@dasig'
import { setPage } from '../../utils'
import { _page } from 'stores/page'
import './index.sass'

export default () => {
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
      </Page>
    </>
  )
}
