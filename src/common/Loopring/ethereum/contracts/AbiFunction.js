
import {rawEncode, methodID} from 'ethereumjs-abi';


export default class AbiFunction {

  constructor({inputs,name,outputs,constant}){
    this.name = name;
    this.inputTypes = inputs.map(({type}) => type);
    this.inputNames = inputs.map(({name}) => name);
    this.outputTypes = outputs.map(({type}) => type);
    this.outputNames =outputs.map(({name})=> name);
    this.constant = constant;
    this.methodAbiHash = methodID(name,this.inputTypes);
  }


  encodeInputs(inputs){
    const abiInputs = this


  }

  checkInputs(inputs){



  }

}



