import { For } from 'solid-js';
import "../components-styles/Dropdown.sass"

interface Props {
  options: Array<string>
}

export default (props: Props) => {
  return (
    <>
    <select class="dasig-dropdown" aria-haspopup="true">
      <For each={props.options}>
        {(item, index) => 
          <option class="dasig-dropdown__option" value={item}>{item}</option>
        }
      </For>
    </select>
    </>
  )
}
