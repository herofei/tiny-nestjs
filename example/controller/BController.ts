import { Controller, Inject, Put, Delete, Query, Headers } from '../../src/index'
import { CService } from '../service/Cservice'
import { BService } from '../service/Bservice'

@Controller('/b_controller')
export class BController {
  @Inject()
  bService: BService

  @Inject()
  cService: CService

  @Put('/b_service')
  getBData(@Query() query, ctx) {
    console.log(query)
    const res = this.bService.getData()
    ctx.response.body = res
  }

  @Delete('/c_service')
  getCData(@Headers() body, ctx) {
    console.log(body)
    const res = this.cService.getData()
    ctx.response.body = res
  }
}
