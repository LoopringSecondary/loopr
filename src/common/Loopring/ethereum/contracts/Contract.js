import AbiFunction from './AbiFunction';


export default class Contract {

  constructor(abi) {
    const funAbi = abi.filter(({type}) => type ==='function');
    this.abiFunctions = funAbi.map((item) => new AbiFunction(item))
  }





}
