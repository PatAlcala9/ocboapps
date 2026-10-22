import { render, screen, cleanup } from '@solidjs/testing-library'
import { afterEach, describe, expect, it } from 'vite-plus/test'
import Card from './Card'

afterEach(() => {
  cleanup()
})

describe('Card', () => {
  it('renders card successfully', () => {
    render(() => <Card image='logo' name='OCBO e-Sign' description='A secure way of signing permits' site='/esign' />)
    const name = screen.getAllByDisplayValue('image')
    expect(name).toBe('logo')
  })
})
//

//   it('displays name properly', async () => {
//     render(() => <Card />)

//     const name = screen.getByRole('span', { name: 'sample' })
//   })

//   // it('decrements the count', async () => {
//   //   render(() => <Card />)

//   //   const decrementButton = screen.getByRole('button', { name: '-' })
//   //   fireEvent.click(decrementButton)
//   //   expect(screen.getByText('-1')).toBeInTheDocument()
//   // })

//   // it('increments and decrements correctly', async () => {
//   //   render(() => <Card />)

//   //   const incrementButton = screen.getByRole('button', { name: '+' })
//   //   const decrementButton = screen.getByRole('button', { name: '-' })
//   //   fireEvent.click(incrementButton)
//   //   fireEvent.click(incrementButton)
//   //   fireEvent.click(decrementButton)
//   //   expect(screen.getByText('1')).toBeInTheDocument()
//   // })
// })
