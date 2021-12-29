import { Injectable } from '../../src/index'

@Injectable()
export class CService {
  getData() {
    return 'data from CService'
  }
}
