import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import HomePage from './page'
import { api } from '@/lib/axios'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
  }),
}))

jest.mock('@/lib/axios', () => ({
  api: {
    post: jest.fn(),
  },
}))

describe('HomePage', () => {
  it('should render the title', () => {
    render(<HomePage />)

    const title = screen.getByText('be The Hero')

    expect(title).toBeInTheDocument()
    expect(title).toHaveClass(
      'mb-4 text-center text-4xl font-bold text-white sm:text-5xl',
    )
  })

  it('should render the description quote', () => {
    render(<HomePage />)

    const description = screen.getByText(
      "Don't wait for someone else to light your path. Be the hero of your own story and create your own light.",
    )

    expect(description).toBeInTheDocument()
    expect(description).toHaveClass(
      'mb-8 text-center text-base text-purple-100 sm:text-lg',
    )
  })

  it('should not show email validation error on valid email input', async () => {
    render(<HomePage />)

    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', {
      name: /start conversation/i,
    })

    // valid email
    userEvent.type(emailInput, 'valid.email@example.com')
    userEvent.click(submitButton)
    await waitFor(() => {
      const errorMessage = screen.queryByText('Invalid email address.')
      expect(errorMessage).not.toBeInTheDocument()
    })
  })

  it('should show email validation error on invalid email input', async () => {
    render(<HomePage />)

    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', {
      name: /start conversation/i,
    })

    // invalid email
    userEvent.type(emailInput, 'invalid-email')
    userEvent.click(submitButton)
    await waitFor(() => {
      const errorMessage = screen.getByText('Invalid email address.')
      expect(errorMessage).toBeInTheDocument()
    })
  })

  it('should show validation error for username with invalid characters', async () => {
    render(<HomePage />)

    const usernameInput = screen.getByLabelText(/username/i)
    const submitButton = screen.getByRole('button', {
      name: /start conversation/i,
    })

    // invalid username
    userEvent.type(usernameInput, 'invalid_username!')
    userEvent.click(submitButton)
    await waitFor(() => {
      const errorMessage = screen.getByText(
        'The user can only have letters and hyphens.',
      )
      expect(errorMessage).toBeInTheDocument()
    })
  })

  it('should not show validation error for valid username', async () => {
    render(<HomePage />)

    const usernameInput = screen.getByLabelText(/username/i)
    const submitButton = screen.getByRole('button', {
      name: /start conversation/i,
    })

    // valid user
    userEvent.type(usernameInput, 'valid-username')
    userEvent.click(submitButton)

    // Wait for potential validation error message to disappear
    await waitFor(() => {
      const errorMessage = screen.queryByText(
        'User must have at least 3 letters.',
      )
      const errorMessageInvalidChars = screen.queryByText(
        'The user can only have letters and hyphens.',
      )
      expect(errorMessage).not.toBeInTheDocument()
      expect(errorMessageInvalidChars).not.toBeInTheDocument()
    })
  })

  it('should render the Start conversation button', () => {
    render(<HomePage />)

    const button = screen.getByRole('button', { name: /start conversation/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass(
      'w-full',
      'rounded-md',
      'bg-gray-600',
      'px-4',
      'py-2',
      'text-purple-100',
      'shadow',
      'transition-colors',
      'duration-300',
      'ease-in-out',
      'hover:bg-gray-500',
    )
  })

  it('should handle button click and submit the form with valid data', async () => {
    render(<HomePage />)

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'valid-username' },
    })

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'valid@example.com' },
    })

    // Click the submit button
    fireEvent.click(screen.getByRole('button', { name: /start conversation/i }))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/users', {
        username: 'valid-username',
        email: 'valid@example.com',
      })
    })
  })
})
