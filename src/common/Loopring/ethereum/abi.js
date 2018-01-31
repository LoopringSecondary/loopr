import {soliditySHA3,rawEncode,methodID} from 'ethereumjs-abi';
import validator from '../common/validator';
import {sha3,ecsign,toBuffer,ecrecover,pubToAddress,bufferToHex,addHexPrefix} from 'ethereumjs-util';
import {toBN} from '../common/formatter'
export function solSHA3(types, data) {
  return soliditySHA3(types, data);
}

function generateCancelOrderData(signedOrder, amount){
  // TODO signedOrder schema
  // amountS，amountB 是否在orderSchema中
  let {
    owner, tokenS, tokenB,
    amountS, amountB, timestamp, ttl, lrcFee,
    buyNoMoreThanAmountB,
    marginSplitPercentage,
    v,
    r,
    s
  } = signedOrder;
  const addresses = [owner, tokenS, tokenB];
  amount = amount ? amount : (buyNoMoreThanAmountB ? amountB : amountS);
  const orderValues = [toBN(amountS), toBN(amountB), toBN(timestamp), toBN(ttl), toBN(lrcFee), toBN(amount)];
  const data = rawEncode([
    'address[3]',
    'uint[7]',
    'bool',
    'uint8',
    'uint8',
    'bytes32',
    'bytes32'
  ], [
    addresses,
    orderValues,
    buyNoMoreThanAmountB,
    marginSplitPercentage,
    v,
    r,
    s
  ]).toString('hex');

  const method = methodID(
    'cancelOrder', [
      'address[3]',
      'uint[7]',
      'bool',
      'uint8',
      'uint8',
      'bytes32',
      'bytes32'
    ]).toString('hex');

  return '0x' + method + data;
}

function generateCutOffData(timestamp) {
  validator.validate({value:timestamp,type:'TIMESTAMP'});

  const method = methodID('setCutoff', ['uint']).toString('hex');
  const data = rawEncode(['uint'], [timestamp]).toString('hex');
  return '0x' + method + data;
}

function generateApproveData(address, amount) {
  validator.validate({value:address,type:'ADDRESS'});
  validator.validate({value:amount,type:'QUANTITY'});

  const method = methodID('approve', ['address', 'uint']).toString('hex');
  const data = rawEncode(['address', 'uint'], [address, amount]).toString('hex');
  return '0x' + method + data;
}

function generateWithdrawData (amount){
  validator.validate({value:amount,type:'QUANTITY'});

  const method = methodID('withdraw', ['uint']).toString('hex');
  const data = rawEncode(['uint'], [amount]).toString('hex');
  return '0x' + method + data;
}

function generateDeposit() {
  const method = methodID('deposit', ['']).toString('hex');
  return '0x' + method ;

}

function generateTransferData (address, amount) {
  validator.validate({value:address,type:'ADDRESS'});
  validator.validate({value:amount,type:'QUANTITY'});

  const method = methodID('transfer', ['address', 'uint']).toString('hex');
  const data = rawEncode(['address', 'uint'], [address, amount]).toString('hex');
  return '0x' + method + data;
}

function generateBalanceOfData(address) {
  validator.validate({value:address,type:'ADDRESS'});

  const method = methodID('balanceOf', ['address']).toString('hex');
  const data = rawEncode(['address'], [address]).toString('hex');
  return '0x' + method + data;
}

function generateAllowanceData(owner, spender) {
  validator.validate({value:owner,type:'ADDRESS'});
  validator.validate({value:spender,type:'ADDRESS'});

  const method = methodID('allowance', ['address', 'address']).toString('hex');
  const data = rawEncode(['address', 'address'], [owner, spender]).toString('hex');
  return '0x' + method + data;
}

export function sign(message, privateKey){

  const hash = sha3(message);
  const sig =ecsign(hash, toBuffer(privateKey));
  const v = Number(sig.v.toString());
  const r = '0x' + sig.r.toString('hex');
  const s = '0x' + sig.s.toString('hex');

  return {
    v,
    r,
    s
  }
}

export function isValidSig(message, sig, address){
  const hash = sha3(message);
  const pubKey = ecrecover(hash, sig.v, toBuffer(sig.r), toBuffer(sig.s));
  const recoveredAddress = bufferToHex(pubToAddress(pubKey));
  return addHexPrefix(recoveredAddress) === address.toLowerCase();
}

export function generateAbiData({method,timestamp,address,amount,order,owner,spender}){
  validator.validate({value:method,type:'ABI_METHOD'})
  if (method === 'cancelOrder') {
    return generateCancelOrderData(order);
  }
  if (method === 'setCutoff') {
    return generateCutOffData(timestamp);
  }
  if (method === 'approve') {
    return generateApproveData(address, amount);
  }
  if (method === 'withdraw') {
    return generateWithdrawData(amount);
  }
  if(method === 'deposit'){
    return generateDeposit();
  }
  if (method === 'transfer') {
    return generateTransferData(address, amount);
  }
  if (method === 'balanceOf') {
    return  generateBalanceOfData(address);
  }
  if (method === 'allowance') {
    return generateAllowanceData(owner, spender);
  }
}


