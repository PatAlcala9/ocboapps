import '../components-styles/File.sass'

interface Props {
  maxFiles: number
  accept: string
  onFileAccept?: (files: File[]) => void
  label: string
  buttonText: string
  onClick: () => void
}

export default (props: Props) => {
  return <>{props.label}</>
}
