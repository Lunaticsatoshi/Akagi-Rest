import { ISuccessResponse } from '../interfaces/types'

/**
 * Function to create a success response
 * @param statusCode - HTTP status code
 * @param message - Success message
 * @param response - Optional response data
 * @returns Formatted success response
 */
export function createApiResponse<T = void>(statusCode: number, message: string, response?: T): ISuccessResponse<T> {
  return {
    statusCode,
    message,
    response,
  } as unknown as ISuccessResponse<T>
}
