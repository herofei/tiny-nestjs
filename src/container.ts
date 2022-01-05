import { INJECTABEL_SYMBOL } from './constants'
import { InjectModItem } from './types'

export class Container {
  // 注入的服务数组
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
      if (injectModItem.target === Module.prototype) { // 判断该属性是否注入了服务
        if (!Reflect.getOwnMetadata(INJECTABEL_SYMBOL, injectModItem.service)) { // 判断注入的服务是否有暴露出来
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