export const __prod__ = process.env.NODE_ENV === 'production'

export const emailRegex = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
export const textRegex = /^[a-zA-Z]$/
export const textAreaRegex = /^[a-zA-Z0-9?$@#()'!,+\-=_:.&€£*%\s]+$/
export const singleLineRegex = /^[a-zA-Z. ]*$/
export const specialCharacterTextRegex = /^[^\r\n]+$/
export const numberRegex = /^(0|[1-9]\d*)(\.\d+)?$/
export const phoneNumberRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im

export const REDIS_NAMESPACE = 'akagi_base'
export const USER_LOGIN_OTP_STORE = `${REDIS_NAMESPACE}_login_otp_store`
export const USER_LOGIN_OTP_COUNT_STORE = `${REDIS_NAMESPACE}_login_otp_count_store`
export const USER_LOGIN_OTP_CHECK_COUNT_STORE = `${REDIS_NAMESPACE}_login_otp_check_count_store`

export const USER_TOKEN_STORE = `${REDIS_NAMESPACE}_user_token_store`
export const USER_TOKEN_ID_MAP = `${REDIS_NAMESPACE}_user_token_id_map`

export const IS_PUBLIC_KEY = 'isPublic'
