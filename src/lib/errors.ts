import { AuthError, DataError } from './data'

/** The message to show for a failed request: expected errors speak for themselves, anything else is generic. */
export function errorMessage(error: unknown): string {
  if (error instanceof AuthError || error instanceof DataError) return error.message
  console.error(error)
  return 'Something went wrong. Please try again.'
}
