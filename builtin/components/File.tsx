import '../components-styles/File.sass'
import { FileField } from '@kobalte/core/file-field'

interface Props {
  maxFiles: number
  accept: string
  onFileAccept?: (files: File[]) => void
  label: string
  buttonText: string
  onClick: () => void
}

export default (props: Props) => {
  return (
    <>
      <FileField class='dasig-filefield' maxFiles={props.maxFiles} onFileAccept={props.onFileAccept} accept={props.accept}>
        <FileField.Dropzone class='dasig-filefield__dropzone'>{props.label}</FileField.Dropzone>
        <FileField.HiddenInput />
        <FileField.ItemList class='dasig-filefield__itemList'>
          {() => (
            <FileField.Item class='dasig-filefield__item'>
              <FileField.ItemPreviewImage class='dasig-filefield__itemPreviewImage' />
              <FileField.ItemName class='dasig-filefield__itemName' />
              <FileField.ItemSize class='dasig-filefield__itemSize' />
              <FileField.ItemDeleteTrigger class='dasig-filefield__itemDeleteTrigger' onClick={props.onClick}>
                {props.buttonText}
              </FileField.ItemDeleteTrigger>
            </FileField.Item>
          )}
        </FileField.ItemList>
      </FileField>
    </>
  )
}
