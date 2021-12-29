import Koa = require('koa')
import createRouter = require('koa-router')
import koaBody = require('koa-body')
import { container } from './container'
import {
  CONTROLLER_SYMBOL,
  METHOD_SYMBOL,
  PARAMS_SYMBOL
} from './constants'
import type { MethodMetaItem, ParamMetaItem } from './types'

const router = createRouter()
const app = new Koa()
app.use(koaBody())

// 初始化框架
export function init(controllerList: any[]) {
  for (const controller of controllerList) {
    const controllerPath = Reflect.getOwnMetadata(CONTROLLER_SYMBOL, controller)
    const methodMetaData: MethodMetaItem[] = Reflect.getOwnMetadata(METHOD_SYMBOL, controller.prototype)
    const paramMetaData: ParamMetaItem[] = Reflect.getOwnMetadata(PARAMS_SYMBOL, controller.prototype)
    const instance = container.get(controller)
    
    for (const methodMetaItem of methodMetaData) {
      const { key, path, method } = methodMetaItem
      router[method](`${controllerPath}${path}`, (ctx: Koa.Context) => {
        const argList = paramMetaData.filter((paramMetaItem) => paramMetaItem.methodName === key)
          .sort((a, b) => a.index - b.index)
          .map((paramMetaItem) => paramMetaItem.fn(ctx))
        instance[key](...argList, ctx)
      })
    }
  }
  app.use(router.routes())
  return {
    app,
    router
  }
}