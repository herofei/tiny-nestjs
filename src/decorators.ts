import {
  INJECTABEL_SYMBOL,
  CONTROLLER_SYMBOL,
  METHOD_SYMBOL,
  PARAMS_SYMBOL,
  METHOD_ENUM
} from './constants'
import { container } from './container'
import type { MethodMetaItem, ParamMetaItem } from './types'

// 暴露服务装饰器
export function Injectable() {
  return function (target: any) {
    Reflect.defineMetadata(INJECTABEL_SYMBOL, target, target)
  }
}

// 注入服务装饰器
export function Inject() {
  return (target: any, key: string) => {
    const Service = Reflect.getMetadata('design:type', target, key)
    container.addMod({
      key,
      target: target,
      service: Service
    })
  }
}

// 路由控制器装饰器
export function Controller(path) {
  return function(target: any) {
    Reflect.defineMetadata(CONTROLLER_SYMBOL, path, target)
  }
}

// http请求方法装饰器工厂函数
export function createMethodDecorator(method: METHOD_ENUM) {
  return (path: string) => (target: any, key: string) => {
    const methodMetaData: MethodMetaItem[] = Reflect.getOwnMetadata(METHOD_SYMBOL, target) || []
    methodMetaData.push({
      key,
      method,
      path
    })

    Reflect.defineMetadata(METHOD_SYMBOL, methodMetaData, target)
  }
}

// http请求方法装饰器
export const All = createMethodDecorator(METHOD_ENUM.ALL)
export const Get = createMethodDecorator(METHOD_ENUM.GET)
export const Post = createMethodDecorator(METHOD_ENUM.POST)
export const Put = createMethodDecorator(METHOD_ENUM.PUT)
export const Delete = createMethodDecorator(METHOD_ENUM.DELETE)
export const Patch = createMethodDecorator(METHOD_ENUM.PATCH)
export const Head = createMethodDecorator(METHOD_ENUM.HEAD)

// http参数装饰器工厂函数
export function createParamDecorator(fn: Function) {
  return (target: any, methodName: string, index: number) => {
    const paramMetaData: ParamMetaItem[] = Reflect.getOwnMetadata(PARAMS_SYMBOL, target) || []
    paramMetaData.push({
      methodName,
      fn,
      index
    })
    Reflect.defineMetadata(PARAMS_SYMBOL, paramMetaData, target)
  }
}

// http参数装饰器
export const Ctx = () => createParamDecorator((ctx) => ctx)
export const Req = () => createParamDecorator((ctx) => ctx.req)
export const Res = () => createParamDecorator((ctx) => ctx.res)
export const Body = (key?: string) => createParamDecorator((ctx) => key ? ctx.request.body[key] : ctx.request.body)
export const Query = (key?: string) => createParamDecorator((ctx) => key ? ctx.request.query[key] : ctx.request.query)
export const Headers = (key?: string) => createParamDecorator((ctx) => key ? ctx.request.headers[key] : ctx.request.headers)
export const Reaquest = Req
export const Response = Res