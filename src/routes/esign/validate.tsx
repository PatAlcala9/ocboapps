import { onCleanup, createSignal, onSettled } from 'solid-js'
import { Background, Page } from '@dasig'
import { BrowserQRCodeReader, type IScannerControls } from '@zxing/browser'

export default () => {
  let video!: HTMLVideoElement
  let controls: IScannerControls | undefined
  let starting = false

  const [result, setResult] = createSignal('')
  const [error, setError] = createSignal('')
  const [scanning, setScanning] = createSignal(false)

  async function startScanner() {
    if (starting || scanning()) return

    starting = true
    setError('')
    setResult('')

    try {
      const reader = new BrowserQRCodeReader()

      // Omit the device ID to let the browser choose a camera.
      controls = await reader.decodeFromVideoDevice(undefined, video, (decoded) => {
        if (!decoded) return

        setResult(decoded.getText())
        stopScanner()
      })

      setScanning(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start the camera.')
    } finally {
      starting = false
    }
  }

  function stopScanner() {
    controls?.stop()
    controls = undefined
    setScanning(false)
  }

  const init = async () => {
    await startScanner()
  }

  onSettled(() => {
    init()
  })

  onCleanup(stopScanner)

  return (
    <Page title='e-Sign - Register' alignment='column' font='roboto'>
      <Background image='esign-mobile-background' />

      <video ref={video} aria-label='QR code camera preview' autoplay muted playsinline style={{ width: '100%', 'max-width': '480px' }} />
    </Page>
  )
}
