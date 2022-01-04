import { Injectable, Inject } from '../../src/index'
import { BService } from './Bservice'

@Injectable()
export class CService {

  @Inject()
  bService: BService

  getData() {
    return 'data from CService'
  }
}
