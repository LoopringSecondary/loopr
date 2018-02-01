import ethUtil from 'ethereumjs-util';
import Big from 'bignumber.js';
import BN from "bn.js";


export function toBuffer(buffer) {
  if (buffer instanceof Buffer) {
    return buffer;
  } else {
    return ethUtil.toBuffer(buffer)
  }
}

// Number | BigNumber |  BN  | Buffer | String
export function toHex(mixed) {

  if (mixed instanceof Number || mixed instanceof Big || mixed instanceof BN) {
    return "0x" + mixed.toString(16)
  }

  if (mixed instanceof Buffer) {
    return "0x" + mixed.toString('hex')
  }

  if (mixed instanceof String) {

    const regex = new RegExp(/^0x[0-9a-fA-F]*$/);

    return regex.test(mixed) ? mixed : "0x" + toBuffer(String).toString('hex')

  }

  throw new Error('Unsupported type')

}

export function toNumber(mixed) {
  if (mixed instanceof Number) {
    return mixed
  }

  if (mixed instanceof Big || mixed instanceof BN) {
    mixed.toNumber()
  }

  if (mixed instanceof String) {
    return Number(mixed)
  }

  throw new Error('Unsupported type')
}

export function toBig(mixed) {

  if (mixed instanceof Number) {

    return new Big(mixed.toString())
  }

  if (mixed instanceof String) {

    return new Big(mixed)
  }

  throw new Error('Unsupported type')

}

export function toBN(mixed) {
  return (mixed instanceof BN) ? mixed : new BN(toBig(mixed).toString(), 10);
}

export function formatKey(mixed) {

  if (mixed instanceof Buffer) {
    return mixed.toString('hex')
  }

  if (mixed instanceof String) {
    return mixed.startsWith("0x") ? mixed : mixed
  }
  throw new Error('Unsupported type')
}

export function formatAddress(mixed) {
  if (mixed instanceof Buffer) {
    return '0x' + mixed.toString('hex')
  }

  if (mixed instanceof String) {
    return mixed.startsWith("0x") ? mixed : "0x" + mixed
  }
  throw new Error('Unsupported type')

}

export function addHexPrefix(input) {

  if(input instanceof String){

   return input.startsWith('0x') ? input : "0x" + input;
  }

  throw new Error('Unsupported type')
}

export function clearPrefix(input) {


  if(input instanceof String){

    return input.startsWith('0x') ? input.slice(2) : input;
  }

  throw new Error('Unsupported type')

}



