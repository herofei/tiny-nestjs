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
