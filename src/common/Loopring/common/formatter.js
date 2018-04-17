import ethUtil from 'ethereumjs-util';
import BigNumber from 'bignumber.js';
import BN from "bn.js";

/**
 *
 * @param mixed Buffer|number|string (hex string must be with '0x' prefix)
 * @returns {Buffer}
 */
export function toBuffer(mixed) {
  if (mixed instanceof Buffer) {
    return mixed;
  } else {
    return ethUtil.toBuffer(mixed)
  }
}

/**
 *
 * @param mixed number | BigNumber |  BN  | Buffer | string
 * @returns {string}
 */
export function toHex(mixed) {

  if (typeof mixed === 'number' || mixed instanceof BigNumber || mixed instanceof BN) {
    return addHexPrefix(mixed.toString(16))
  }

  if (mixed instanceof Buffer) {
    return addHexPrefix(mixed.toString('hex'))
  }

  if (typeof mixed === 'string') {
    const regex = new RegExp(/^0x[0-9a-fA-F]*$/);
    return regex.test(mixed) ? mixed : addHexPrefix(toBuffer(String).toString('hex'))

  }
  throw new Error('Unsupported type')
}

/**
 *
 * @param mixed number | BigNumber |  BN  | Buffer | string
 * @returns {number}
 */
export function toNumber(mixed) {
  if (typeof mixed === 'number') {
    return mixed
  }

  if (mixed instanceof BigNumber || mixed instanceof BN) {
   return mixed.toNumber()
  }

  if (typeof mixed === 'string') {
    return Number(mixed)
  }

  throw new Error('Unsupported type')
}

/**
 *
 * @param mixed number | BigNumber |  BN  | Buffer | string
 * @returns {BigNumber}
 */
export function toBig(mixed) {

  if(mixed instanceof BigNumber){
    return mixed;
  }

  if (typeof mixed === 'number') {

    return new BigNumber(mixed.toString())
  }

  if (typeof mixed === 'string') {

    return new BigNumber(mixed)
  }

  throw new Error('Unsupported type')

}

/**
 *
 * @param mixed number | BigNumber |  BN  | Buffer | string
 * @returns {BN}
 */
export function toBN(mixed) {
  return (mixed instanceof BN) ? mixed : new BN(toBig(mixed).toString(10), 10);
}

/**
 * Returns formatted hex string of a given private key
 * @param mixed Buffer| string
 * @returns {string}
 */
export function formatKey(mixed) {

  if (mixed instanceof Buffer) {
    return mixed.toString('hex')
  }

  if (typeof mixed === 'string') {
    return mixed.startsWith("0x") ? mixed : mixed
  }
  throw new Error('Unsupported type')
}

/**
 * Returns hex string of a given address
 * @param mixed Buffer | string
 * @returns {string}
 */
export function formatAddress(mixed) {
  if (mixed instanceof Buffer) {
    return '0x' + mixed.toString('hex')
  }

  if (typeof mixed === 'string') {
    return mixed.startsWith("0x") ? mixed : "0x" + mixed
  }
  throw new Error('Unsupported type')

}

/**
 * Returns hex string with '0x' prefix
 * @param input
 * @returns {string}
 */
export function addHexPrefix(input) {

  if(typeof input === 'string'){
   return input.startsWith('0x') ? input : "0x" + input;
  }
  throw new Error('Unsupported type')
}

/**
 * Returns hex string without '0x' prefix
 * @param input string
 * @returns {string}
 */
export function clearHexPrefix(input) {
  if(typeof input === 'string'){
    return input.startsWith('0x') ? input.slice(2) : input;
  }
  throw new Error('Unsupported type')
}

/**
 * Returns symbol of a given kind of currency
 * @param settingsCurrency
 * @returns {*}
 */
export function getDisplaySymbol(settingsCurrency) {
  switch(settingsCurrency) {
    case 'CNY': return '￥';
    case 'USD': return '$';
    default: return ''
  }
}

/**
 * Returns number in string with a given precision
 * @param number number | BigNumber | BN
 * @param precision number
 * @returns {string}
 */
export function toFixed(number, precision) {
  if(number >0 && precision >0) {
    const numberArr = number.toFixed(16).toString().split('.');
    if(numberArr.length === 2) {
      const decimal = numberArr[1].substring(0, Math.min(numberArr[1].length, precision));
      if(toNumber(decimal) === 0) {
        if(toNumber(numberArr[0]) === 0) {
          return "0."+'0'.repeat(precision)
        } else {
          return numberArr[0]+"."+'0'.repeat(precision)
        }
      } else {
        return numberArr[0]+"."+decimal
      }
    }
  } else {
    return '0'
  }
}





