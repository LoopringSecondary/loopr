import {generateAbiData} from './abi'
import validator from './validator'
import Transaction from './transaction'

export default class Loopring {

  constructor(address){
    validator.validate({value:address,type:"ADDRESS"})
    this.address = address;
  }


}
