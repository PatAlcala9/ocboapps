import { createSignal } from 'solid-js'
import './Counter.sass'

export default () => {
  let [count, setCount] = createSignal(0)

  const increment = () => {
    setCount(count() + 1)
  }

  const decrement = () => {
    setCount(count() - 1)
  }

  return (
    <>
      <section class="counter box">
        <div id="display" class="counter__display">{count()}</div>
        <div class="counter__buttons">
          <button id="decrement" class="counter__decrement" onClick={decrement}>
            -
          </button>
          <button id="increment" class="counter__increment" onClick={increment}>
            +
          </button>
        </div>
      </section>
    </>
  )
}
