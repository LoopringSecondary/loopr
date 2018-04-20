import {soliditySHA3} from 'ethereumjs-abi';
import {addHexPrefix, bufferToHex, ecrecover, ecsign, pubToAddress, sha3, toBuffer} from 'ethereumjs-util';
import {toHex} from "../common/formatter";

export function solSHA3(types, data) {
  return soliditySHA3(types, data);
}


export function sign(message, privateKey) {
  const hash = sha3(message);
  const sig = ecsign(hash, toBuffer(privateKey));
  const v = Number(sig.v.toString());
  const r =  toHex(sig.r);
  const s =  toHex(sig.s);
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





