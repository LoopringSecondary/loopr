import {soliditySHA3, rawEncode, methodID} from 'ethereumjs-abi';
import validator from '../common/validator';
import {sha3, ecsign, toBuffer, ecrecover, pubToAddress, bufferToHex, addHexPrefix} from 'ethereumjs-util';
import {toHex} from "../common/formatter";


export function solSHA3(types, data) {
  return soliditySHA3(types, data);
}

function generateCancelOrderData(signedOrder, amount) {
  const {
    owner, tokenS, tokenB, walletAddress,authAddr,
    amountS, amountB, validSince, validUntil, lrcFee,
    buyNoMoreThanAmountB,
    marginSplitPercentage,
    v,
    r,
    s
  } = signedOrder;
  const addresses = [owner, tokenS, tokenB,walletAddress, authAddr];
  amount = amount || (buyNoMoreThanAmountB ? amountB : amountS);
  const orderValues = [amountS, amountB, validSince, validUntil, lrcFee, amount];
  const method = methodID('cancelOrder', ['address[5]', 'uint[6]', 'bool', 'uint8', 'uint8', 'bytes32', 'bytes32']).toString('hex');
  const data = rawEncode(['address[5]', 'uint[6]', 'bool', 'uint8', 'uint8', 'bytes32', 'bytes32'], [
    addresses, orderValues, buyNoMoreThanAmountB, marginSplitPercentage, v, r, s]).toString('hex');
  return '0x' + method + data;
}

function generateCancelOrdersByTokenPair(timestamp, tokenA, tokenB) {
  validator.validate({value: timestamp, type: 'TIMESTAMP'});
  validator.validate({value: tokenA, type: 'ADDRESS'});
  validator.validate({value: tokenB, type: 'ADDRESS'});
  const method = methodID('cancelAllOrdersByTradingPair', ['address', 'address', 'uint']).toString('hex');
  const data = rawEncode(['address', 'address', 'uint'], [tokenA, tokenB, timestamp]).toString('hex');
  return '0x' + method + data;
}

function generateCancelAllOrders(timestamp) {
  validator.validate({value: timestamp, type: 'TIMESTAMP'});
  const method = methodID('cancelAllOrders', ['uint']).toString('hex');
  const data = rawEncode(['uint'], [timestamp]).toString('hex');
  return '0x' + method + data;
}

function generateApproveData(address, amount) {
  validator.validate({value: address, type: 'ADDRESS'});
  validator.validate({value: amount, type: 'QUANTITY'});
  const method = methodID('approve', ['address', 'uint']).toString('hex');
  const data = rawEncode(['address', 'uint'], [address, amount]).toString('hex');
  return '0x' + method + data;
}

function generateWithdrawData(amount) {
  validator.validate({value: amount, type: 'QUANTITY'});
  const method = methodID('withdraw', ['uint']).toString('hex');
  const data = rawEncode(['uint'], [amount]).toString('hex');
  return '0x' + method + data;
}

function generateDeposit() {
  const method = methodID('deposit', ['']).toString('hex');
  return '0x' + method;
}

function generateTransferData(address, amount) {
  validator.validate({value: address, type: 'ADDRESS'});
  validator.validate({value: amount, type: 'QUANTITY'});
  const method = methodID('transfer', ['address', 'uint']).toString('hex');
  const data = rawEncode(['address', 'uint'], [address, amount]).toString('hex');
  return '0x' + method + data;
}

function generateBalanceOfData(address) {
  validator.validate({value: address, type: 'ADDRESS'});

  const method = methodID('balanceOf', ['address']).toString('hex');
  const data = rawEncode(['address'], [address]).toString('hex');
  return '0x' + method + data;
}

function generateAllowanceData(owner, spender) {
  validator.validate({value: owner, type: 'ADDRESS'});
  validator.validate({value: spender, type: 'ADDRESS'});

  const method = methodID('allowance', ['address', 'address']).toString('hex');
  const data = rawEncode(['address', 'address'], [owner, spender]).toString('hex');
  return '0x' + method + data;
}

function generateSymbol() {
  const method = methodID('symbol', ['']).toString('hex');
  return '0x' + method;
}

function generateDecimals() {
  const method = methodID('decimals', ['']).toString('hex');
  return '0x' + method;
}

function generateName() {
  const method = methodID('name', ['']).toString('hex');
  return '0x' + method;
}

function generateBind(projectId, address) {
  validator.validate({value: projectId, type: 'PROJECT_ID'});
  // validator.validate({value:address,type:'ADDRESS'});
  const method = methodID('bind', ['uint8', 'string']).toString('hex');
  const data = rawEncode(['uint8', 'string'], [projectId, address]).toString('hex');
  return '0x' + method + data;
}

function generateUnbind(projectId) {
  validator.validate({value: projectId, type: 'PROJECT_ID'});
  const method = methodID('unbind', ['uint8']).toString('hex');
  const data = rawEncode(['uint8'], [projectId]).toString('hex');
  return '0x' + method + data;
}

function generateGetBindingAddress(owner, projectId) {
  validator.validate({value: projectId, type: 'PROJECT_ID'});
  validator.validate({value: owner, type: 'ADDRESS'});
  const method = methodID('getBindingAddress', ['address', 'uint8']).toString('hex');
  const data = rawEncode(['address', 'uint8'], [owner, projectId]).toString('hex');
  return '0x' + method + data;
}

function register(key) {
  const method = methodID('register',['string']).toString('hex');
  const data = rawEncode(['string'],[key]).toString('hex');
  return '0x' + method + data;
}

function registerName(name) {
  const method = methodID('registerName',['string']).toString('hex');
  const data = rawEncode(['string'],[name]).toString('hex');
  return '0x' + method + data;
}

function addParticipant(feeRecipient,signer) {
  validator.validate({value: feeRecipient, type: 'ADDRESS'});
  validator.validate({value: signer, type: 'ADDRESS'});
  const method = methodID('addParticipant',['address','address']).toString('hex');
  const data = rawEncode(['address','address'],[feeRecipient,signer]).toString('hex');
  return '0x' + method + data;
}

function keys(address) {
  validator.validate({value: address, type: 'ADDRESS'});
  const method = methodID('keys',['address']).toString('hex');
  const data = rawEncode(['address'],[address]).toString('hex');
  return '0x' + method + data;
}


export function sign(message, privateKey) {
  const hash = sha3(message);
  const sig = ecsign(hash, toBuffer(privateKey));
  const v = Number(sig.v.toString());
  const r = '0x' + sig.r.toString('hex');
  const s = '0x' + sig.s.toString('hex');

  return {
    v,
    r,
    s
  }
}

export function isValidSig(message, sig, address) {
  const hash = sha3(message);
  const pubKey = ecrecover(hash, sig.v, toBuffer(sig.r), toBuffer(sig.s));
  const recoveredAddress = bufferToHex(pubToAddress(pubKey));
  return addHexPrefix(recoveredAddress) === address.toLowerCase();
}

export function generateAbiData({method, timestamp, address, amount, order, owner, spender, projectId, tokenA, tokenB, key,name,signer,feeRecipient}) {
  validator.validate({value: method, type: 'ABI_METHOD'});
  if (method === 'cancelOrder') {
    return generateCancelOrderData(order);
  }
  if (method === 'cancelOrdersByTokenPairs') {
    return generateCancelOrdersByTokenPair(timestamp, tokenA, tokenB)
  }
  if (method === 'cancelAllOrders') {
    return generateCancelAllOrders(timestamp);
  }
  if (method === 'approve') {
    return generateApproveData(address, amount);
  }
  if (method === 'withdraw') {
    return generateWithdrawData(amount);
  }
  if (method === 'deposit') {
    return generateDeposit();
  }
  if (method === 'transfer') {
    return generateTransferData(address, amount);
  }
  if (method === 'balanceOf') {
    return generateBalanceOfData(address);
  }
  if (method === 'allowance') {
    return generateAllowanceData(owner, spender);
  }
  if (method === 'symbol') {
    return generateSymbol();
  }

  if (method === 'name') {
    return generateName();
  }

  if (method === 'decimals') {
    return generateDecimals();
  }

  if (method === 'bind') {
    return generateBind(projectId, address)
  }

  if (method === 'unbind') {
    return generateUnbind(projectId);
  }

  if (method === 'getBindingAddress') {
    return generateGetBindingAddress(owner, projectId)
  }

  if(method === 'register'){
    return register(key)
  }

  if(method === 'keys'){
    return keys(address)
  }

  if(method === 'registerName'){
    return registerName(name)
  }

  if(method === 'addParticipant'){
    return addParticipant(feeRecipient,signer)
  }
}


