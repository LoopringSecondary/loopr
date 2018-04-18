import {rawEncode, methodID} from 'ethereumjs-abi';
import {toHex} from "../../common/formatter";
import every from 'lodash/every'

export default class AbiFunction {

  constructor({inputs, name, outputs, constant}) {
    this.name = name;
    this.inputTypes = inputs.map(({type}) => type);
    this.inputs = inputs;
    this.outputTypes = outputs.map(({type}) => type);
    this.outputs = outputs;
    this.constant = constant;
    this.methodAbiHash = toHex(methodID(name, this.inputTypes));
  }


  encodeInputs(inputs) {
    this.checkInputs(inputs);


  }

  checkInputs(inputs) {
    this.inputs.forEach(({name, type}) => {
      if (!inputs[name]) {
        throw new Error(`Parameter ${name} of type ${type} is required!`)
      }
    })
  }

}



