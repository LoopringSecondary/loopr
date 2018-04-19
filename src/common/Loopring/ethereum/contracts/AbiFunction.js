import {rawEncode, methodID} from 'ethereumjs-abi';
import {toHex,clearHexPrefix} from "../../common/formatter";
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
   const abiInputs = this.parseInputs(inputs);
   return this.methodAbiHash + clearHexPrefix(toHex(rawEncode(this.inputTypes,abiInputs)))
  }

  parseInputs(inputs) {
    this.inputs.map(({name, type}) => {
      if (!inputs[name]) {
        throw new Error(`Parameter ${name} of type ${type} is required!`)
      }
      return inputs[name];
    })
  }
}



