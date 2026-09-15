import '../components-styles/Button.sass'
import type { Element } from 'solid-js'
import { Row } from '../index'
import { Show, Switch, Match } from 'solid-js'

// dasig-${props.design}

interface Props {
  label?: string
  to?: string
  onClick?: () => void
  edges?: 'curved' | 'rounded' | 'flat'
  design?: 'bulma-primary' | 'bulma-link' | 'bulma-info' | 'bulma-success' | 'bulma-warning' | 'bulma-danger' | 'bulma-dark' | 'bulma-light' | 'bulma-text' | 'bulma-ghost' | 'bootstrap-primary' | 'bootstrap-secondary' | 'bootstrap-success' | 'bootstrap-danger' | 'bootstrap-warning' | 'bootstrap-info' | 'bootstrap-light' | 'bootstrap-dark' | 'bootstrap-link' | 'bootstrap-outline-primary'
  submit?: boolean
  newtab?: boolean
  width?: number
  wide?: boolean
  icon?: (props: { size?: number }) => Element
  children?: Element
  background?: string
  color?: string
  prefetch?: boolean
  onMouseOver?: () => void
}

const getBorderRadius = (edge: Props['edges']) => {
  switch (edge) {
    case 'curved':
      return 'border-radius: 6px'
    case 'rounded':
      return 'border-radius: 32px'
    case 'flat':
      return 'border-radius: 0'
    default:
      return 'border-radius: 0'
  }
}

export default (props: Props) => {
  const borderRadius = getBorderRadius(props.edges)
  const Icon = props.icon
  return (
    <>
      <Show when={props.to}>
        <Switch>
          <Match when={props.design}>
            <a href={props.to!} aria-label={props.label} target={props.newtab ? '_blank' : ''}>
              <button class={`dasig-${props.design}`} style={`${borderRadius}; width: ${props.wide ? '100%' : props.width}`}>
                <Show when={props.icon}>
                  <span>{Icon && <Icon size={24} />}</span>
                </Show>
                {props.label || 'Click Me!'}
              </button>
            </a>
          </Match>
          <Match when={!props.design}>
            <a href={props.to!} aria-label={props.label} target={props.newtab ? '_blank' : ''}>
              <button class="dasig-button" style={`${borderRadius}; width: ${props.wide ? '100%' : props.width}`}>
                <Show when={props.icon}>
                  <span>{Icon && <Icon size={24} />}</span>
                </Show>
                {props.label || 'Click Me!'}
              </button>
            </a>
          </Match>
        </Switch>
      </Show>

      <Show when={!props.to}>
        <Switch>
          <Match when={props.design}>
            <Show when={props.submit}>
              <button class={`dasig-${props.design}`} type="submit" style={`${borderRadius}; width: ${props.wide ? '100%' : props.width}`}>
                <Show when={props.icon}>
                  <span>{Icon && <Icon size={24} />}</span>
                </Show>
                {props.label || 'Click Me!'}
              </button>
            </Show>

            <Show when={!props.submit}>
              <Show when={!props.prefetch}>
                <button class={`dasig-${props.design}`} onClick={props.onClick} style={`${borderRadius}; width: ${props.wide ? '100%' : props.width}`}>
                  <Row gap={0.5}>
                    <Show when={props.icon}>
                      <span>{Icon && <Icon size={24} />}</span>
                    </Show>
                    {props.label || 'Click Me!'}
                  </Row>
                </button>
              </Show>
              <Show when={props.prefetch}>
                <button class={`dasig-${props.design}`} onMouseEnter={props.onMouseOver} onClick={props.onClick} style={`${borderRadius}; width: ${props.wide ? '100%' : props.width}`}>
                  <Row gap={0.5}>
                    <Show when={props.icon}>
                      <span>{Icon && <Icon size={24} />}</span>
                    </Show>
                    {props.label || 'Click Me!'}
                  </Row>
                </button>
              </Show>
            </Show>
          </Match>
          <Match when={!props.design}>
            <Show when={props.submit}>
              <button class="dasig-button" type="submit" style={`${borderRadius}; width: ${props.wide ? '100%' : props.width}`}>
                <Show when={props.icon}>
                  <span>{Icon && <Icon size={24} />}</span>
                </Show>
                {props.label || 'Click Me!'}
              </button>
            </Show>

            <Show when={!props.submit}>
              <Show when={!props.prefetch}>
                <button class="dasig-button" onClick={props.onClick} style={`${borderRadius}; width: ${props.wide ? '100%' : props.width}`}>
                  <Show when={props.icon}>
                    <span>{Icon && <Icon size={24} />}</span>
                  </Show>
                  {props.label || 'Click Me!'}
                </button>
              </Show>
              <Show when={props.prefetch}>
                <button class="dasig-button" onMouseEnter={props.onMouseOver} onClick={props.onClick} style={`${borderRadius}; width: ${props.wide ? '100%' : props.width}`}>
                  <Show when={props.icon}>
                    <span>{Icon && <Icon size={24} />}</span>
                  </Show>
                  {props.label || 'Click Me!'}
                </button>
              </Show>
            </Show>
          </Match>
        </Switch>
      </Show>
    </>
  )
}
