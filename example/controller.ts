import { Controller, Injectable, Inject } from '../src/index'

@Injectable()
export class AService {
  sayHi() {
    console.log()
  }
}

@Controller('/test/')
export class TestControl {

  @Inject()
  aService: string = 'dfdfdfdf'
}
