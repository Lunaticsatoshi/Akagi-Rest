/**
 * Building a setContext middleware in NestJS
 * Why build setContext as middleware and not as interceptor can be answered by looking at request lifecycle of NestJS and
 * the difference between Interceptor and Middleware in NestJs
 *
 * References:
 * https://docs.nestjs.com/middleware (Check functional middleware)
 * https://docs.nestjs.com/faq/request-lifecycle
 * https://stackoverflow.com/questions/54863655/whats-the-difference-between-interceptor-vs-middleware-vs-filter-in-nest-js
 *
 * Building setContext as a Global Middleware (https://docs.nestjs.com/middleware#global-middleware)
 * since we need it as soon as request hits the server
 */
import { FastifyReply, FastifyRequest } from 'fastify'
import _ = require('lodash')
import shortid = require('shortid')
import RequestContext from '../utils/request-context'

export function setContext(appName: string) {
  return (req: FastifyRequest, res: FastifyReply, next: () => void) => {
    RequestContext.bind(req, res)

    _.each(req.headers, (value, key) => {
      RequestContext.set(key, value)
    })

    let correlationId = req.cookies?.['x-correlation-id'] || req.headers['x-correlation-id']

    if (!correlationId) {
      correlationId = `${appName}-${shortid.generate()}`
    }

    RequestContext.set('appName', appName)
    RequestContext.set('correlationId', correlationId)

    next()
  }
}
