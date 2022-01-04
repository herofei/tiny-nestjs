import { Controller, Inject, Post, Get, Put, Query, Body, Headers } from '../../src/index'
import { AService } from '../service/Aservice'
import { BService } from '../service/Bservice'
import { CService } from '../service/Cservice'

@Controller('/a_controller')
export class AController {
  @Inject()
  aService: AService

  @Inject()
  bService: BService


  @Inject()
  cService: CService

  @Post('/a_service')
  getAData(@Body() body, ctx) {
    console.log(body)
    const res = this.aService.getData()
    ctx.response.body = res
  }

  @Get('/b_service')
  getBData(@Query() query, ctx) {
    console.log(query)
    const res = this.bService.getData()
    ctx.response.body = res
  }

  @Put('/c_service')
  getCData(@Headers() headers, ctx) {
    console.log(headers)
    const res = this.cService.bService.getData()
    ctx.response.body = res
  }
}
