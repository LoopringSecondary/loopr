import AbiFunction from './AbiFunction';


export default class Contract {

  constructor(abi) {
    const funAbi = abi.filter(({type}) => type === 'function');
    this.abiFunctions = funAbi.reduce((acc, item) => {
      return ({
        ...acc,
        [item.name]: new AbiFunction(item)
      })
    })
  }


  encodeInputs(method,inputs){
    const abiFunction = this.abiFunctions[method];
    if (abiFunction) {
      return abiFunction.encodeInputs(inputs)
    } else {
      throw  new Error(`No  ${method} method according to abi `)
    }
  }


  decodeOutputs(method,outputs){
    const abiFunction = this.abiFunctions[method];
    if (abiFunction) {
      return abiFunction.decodeOutputs(outputs)
    } else {
      throw new Error(`No  ${method} method according to abi `)
    }
  }
}
