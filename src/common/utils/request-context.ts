import { requestContext } from '@fastify/request-context'

declare module '@fastify/request-context' {
  interface RequestContextData {
    [key: string]: any
  }
}

export default class RequestContext {
  static get<T>(key: string): T | null {
    return requestContext.get(key) || null
  }

  static set<T>(key: string, value: T): void {
    requestContext.set(key, value)
  }
}
