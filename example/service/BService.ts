import { Injectable } from '../../src/index'

@Injectable()
export class BService {
  getData() {
    return 'data from BService'
  }
}
