import { Injectable } from '../../src/index'

@Injectable()
export class AService {
  getData() {
    return 'data from AService'
  }
}
