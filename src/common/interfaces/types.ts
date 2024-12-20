export type ISuccessResponse<T = void> = {
  statusCode: number
  message: string
} & (T extends void ? object : { response: T })
