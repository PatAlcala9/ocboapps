import "../components-styles/File.sass";
import { FileField } from "@kobalte/core/file-field";

interface Props {
  maxFiles: number;
  accept: string;
  onFileAccept?: (files: File[]) => void;
  label: string;
  buttonText: string;
  onClick: () => void;
}

export default (props: Props) => {
  return (
    <>
      <FileField
        class="filefield"
        maxFiles={props.maxFiles}
        onFileAccept={props.onFileAccept}
        accept={props.accept}
      >
        <FileField.Dropzone class="filefield__dropzone">
          {props.label}
        </FileField.Dropzone>
        <FileField.HiddenInput />
        <FileField.ItemList class="filefield__itemList">
          {() => (
            <FileField.Item class="filefield__item">
              <FileField.ItemPreviewImage class="filefield__itemPreviewImage" />
              <FileField.ItemName class="filefield__itemName" />
              <FileField.ItemSize class="filefield__itemSize" />
              <FileField.ItemDeleteTrigger
                class="filefield__itemDeleteTrigger"
                onClick={props.onClick}
              >
                {props.buttonText}
              </FileField.ItemDeleteTrigger>
            </FileField.Item>
          )}
        </FileField.ItemList>
      </FileField>
    </>
  );
};
