import { render, screen, fireEvent, cleanup } from '@solidjs/testing-library'
import { afterEach, describe, expect, it } from 'vitest'
import Counter from './Counter'

afterEach(() => {
  cleanup()
})

describe('Counter', () => {
  it('renders with an initial count of 0', () => {
    render(() => <Counter />)

    expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('increments the count', async () => {
    render(() => <Counter />)

    const incrementButton = screen.getByRole('button', { name: '+' })

    await fireEvent.click(incrementButton)

    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('decrements the count', async () => {
    render(() => <Counter />)

    const decrementButton = screen.getByRole('button', { name: '-' })

    await fireEvent.click(decrementButton)

    expect(screen.getByText('-1')).toBeInTheDocument()
  })

  it('increments and decrements correctly', async () => {
    render(() => <Counter />)

    const incrementButton = screen.getByRole('button', { name: '+' })
    const decrementButton = screen.getByRole('button', { name: '-' })

    await fireEvent.click(incrementButton)
    await fireEvent.click(incrementButton)
    await fireEvent.click(decrementButton)

    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
