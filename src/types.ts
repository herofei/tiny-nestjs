import { METHOD_ENUM } from './constants'

export type MethodMetaItem = {
  key: string // 属性名
  method: METHOD_ENUM // 请求方法
  path: string // 请求路径
}

export type ParamMetaItem = {
  methodName: string // 方法名
  fn: Function // 获取参数的方法
  index: number // 参数索引
}

export type InjectModItem = {
  key: string // 属性名
  service: Function // 注入的依赖模块
  target: Function // 当前模块
}