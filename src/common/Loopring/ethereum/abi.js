import {soliditySHA3, rawEncode, methodID} from 'ethereumjs-abi';
import validator from '../common/validator';
import {sha3, ecsign, toBuffer, ecrecover, pubToAddress, bufferToHex, addHexPrefix} from 'ethereumjs-util';


export function solSHA3(types, data) {
  return soliditySHA3(types, data);
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





