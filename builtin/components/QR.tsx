// @ts-ignore
import { useQRCode } from '@solidjs-use/integrations/useQRCode'

interface Props {
  value: string
  width?: number
}

export default (props: Props) => {
  const qrcode = useQRCode(props.value)

  return (
    <>
      <section>
        <img src={qrcode()} alt="QR Code" style={`width: ${props.width || 'auto'}rem`} />
      </section>
    </>
  )
}
