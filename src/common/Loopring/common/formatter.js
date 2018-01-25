import ethUtil from 'ethereumjs-util'


function toBuffer (buffer) {
  if (buffer instanceof Buffer) {
    return buffer;
  } else {
    return ethUtil.toBuffer(buffer)
  }
}

function toHex(mixed){
  // tweb3 lib
  // http://web3js.readthedocs.io/en/1.0/web3-utils.html#tohex
  // http://web3js.readthedocs.io/en/1.0/web3-utils.html#utf8tohex
  // http://web3js.readthedocs.io/en/1.0/web3-utils.html#numbertohex

  // loopring demand
  // '0x' + xxx.toString('hex')
  return mixed;

}

function toNumber(mixed){
  // web3 lib
  // http://web3js.readthedocs.io/en/1.0/web3-utils.html#hextonumber
  // http://web3js.readthedocs.io/en/1.0/web3-utils.html#hextonumberstring

  // loopring demand
  //Number(signature.v.toString())
  return mixed;
}


function toBN(mixed){
  // web3 lib
  // http://web3js.readthedocs.io/en/1.0/web3-utils.html#tobn
  //
  // loopring ex
  // new BN(new BigNumber(amountS).toString(10), 10),
  return mixed;
}

function format(payload){
  let {type, value, onError, onSuccess} = payload

  return value;
}


function formatPrivateKey (payload){
  let {target, value} = payload;
  // target valiadte'

  if (target === 'buffer') {
    if (value instanceof Buffer) {

    }
    if (typeof value === 'string') {

    }


  } else if (target === 'string') {

  }
}

function formatAddress(payload){
  let {target, value} = payload;
  // target valiadte'

}
function formatQuantity(payload){
  let {target, value} = payload;
  // target valiadte'

}

export default {
  format,
  formatPrivateKey,
  formatQuantity,
  toHex,
  toBuffer,
  toNumber,
  toBN,
}
