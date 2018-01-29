import ethUtil from 'ethereumjs-util';
import Big from 'bignumber.js';
import BN from "bn.js";


function toBuffer(buffer) {
  if (buffer instanceof Buffer) {
    return buffer;
  } else {
    return ethUtil.toBuffer(buffer)
  }
}

// Number | BigNumber |  BN  | Buffer | String
function toHex(mixed) {

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

function toNumber(mixed) {
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

function toBig(mixed) {

  if (mixed instanceof Number) {

    return new Big(mixed.toString())
  }

  if (mixed instanceof String) {

    return new Big(mixed)
  }

  throw new Error('Unsupported type')

}

function toBN(mixed) {
  return new BN(toBig(mixed).toString(), 10);
}

function formatPrivateKey(mixed) {

  if(mixed instanceof Buffer){
   return '0x' + mixed.toString('hex')
  }

  if(mixed instanceof String){
    return mixed.startsWith("0x") ? mixed : "0x" + mixed
  }
  throw new Error('Unsupported type')
}

function formatAddress(mixed) {
  if(mixed instanceof Buffer){
    return '0x' + mixed.toString('hex')
  }

  if(mixed instanceof String){
    return mixed.startsWith("0x") ? mixed : "0x" + mixed
  }
  throw new Error('Unsupported type')

}


export default {
  toHex,
  toBuffer,
  toNumber,
  toBig,
  toBN,
}
