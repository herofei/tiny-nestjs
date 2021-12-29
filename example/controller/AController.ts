import { Controller, Inject, Post, Get, Query, Body } from '../../src/index'
import { AService } from '../service/Aservice'
import { BService } from '../service/Bservice'

@Controller('/a_controller')
export class AController {
  @Inject()
  aService: AService

  @Inject()
  bService: BService

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
}
