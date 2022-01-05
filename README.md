# tiny-nestjs

一个类nestjs的装饰器风格框架，满足以下基础功能：

1. 能通过Injectable装饰器暴露依赖，如果依赖没暴露的情况下使用，应该抛出相应错误。
2. 能通过Inject装饰器注入依赖。
3. 能通过Controller装饰器实现基础的路由转发。
4. 通过Get、Post等方法装饰器, 捕获相应路径的请求, 并处理该请求。
5. 通过Query、Body等参数装饰器，获取请求参数。

## 运行

```sh
npm run dev
```

## 调试

已配置launch.js，vscode下点击调试即可。

## 代码分析

### 定义用到的常量

```ts
export enum METHOD_ENUM {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = 'patch',
  HEAD = 'head',
  ALL = "all"
}

export enum PARAM_ENUM {
  QUERY = 'query',
  BODY = 'body',
  HEADERS = 'headers'
}

export const META_TYPE = 'design:type'

export const INJECTABEL_SYMBOL = Symbol('INJECTABLE')
export const CONTROLLER_SYMBOL = Symbol('CONTROLLER')
export const METHOD_SYMBOL = Symbol('METHOD')
export const PARAMS_SYMBOL = Symbol('PARAMS')
```

### 实现 IoC容器

```ts
type InjectModItem = {
  key: string // 属性名
  service: Function // 注入的依赖模块
  target: Function // 当前模块
}

export class Container {
  // 注入的依赖数组
  private injectModList: InjectModItem[] = []

  // controller或者service实例缓存
  private modCache: Record<string, Function> = {}

  // 获取controller或者service实例, 并且根据注入的元数据信息递归注入其子依赖
  get(Module) {
    if (this.modCache[Module.name]) {
      return this.modCache[Module.name]
    }
    const module = new Module()
    for (const injectModItem of this.injectModList) {
      if (injectModItem.target === Module.prototype) { // 判断该属性是否注入了依赖
        if (Reflect.getOwnMetadata(INJECTABEL_SYMBOL, injectModItem.service.prototype)) { // 判断注入的依赖是否有暴露出来
          throw new Error(`模块${Module.name}依赖的子服务${injectModItem.key}没有通过Injectable装饰器注册！`)
        } else {
          module[injectModItem.key] = this.get(injectModItem.service)
        }
      }
    }
    return module
  }

  addMod(item: InjectModItem) {
    this.injectModList.push(item)
  }
}

export const container = new Container()
```

### 实现Injectable装饰器

Injectable装饰器主要用于暴露依赖

```ts
import { INJECTABEL_SYMBOL } from './constants'

export function Injectable() {
  return function (target: any) {
    Reflect.defineMetadata(INJECTABEL_SYMBOL, target, target)
  }
}
```

### 实现Inject装饰器

Injectable装饰器主要用于注入依赖

```ts
import { container } from './container'

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
```

### 实现Controller装饰器

Controller装饰器主要用于基础路由控制

```ts
import { CONTROLLER_SYMBOL } from './constants'

export function Controller(path) {
  return function(target: any) {
    Reflect.defineMetadata(CONTROLLER_SYMBOL, path, target)
  }
}
```

### 实现请求方法装饰器

```ts
import { METHOD_SYMBOL, METHOD_ENUM } from './constants'

type MethodMetaItem = {
  key: string // 属性名
  method: METHOD_ENUM // 请求方法
  path: string // 请求路径
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
```

### 实现请求参数装饰器

```ts
import { PARAMS_SYMBOL } from './constants'

type ParamMetaItem = {
  methodName: string // 方法名
  fn: Function // 获取参数的方法
  index: number // 参数索引
}

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
```

### 初始化框架

```ts
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
```
