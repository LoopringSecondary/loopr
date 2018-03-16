import {getTransactionCount} from "Loopring/ethereum/utils";
import {toNumber} from "Loopring/common/formatter";
import validator from 'Loopring/ethereum/validator';
import transactions from './transactions'


const setWallet = (wallet) => {
  const localWallet = getWallet();
  localStorage.wallet = JSON.stringify({...localWallet, ...wallet})
}

const getWallet = (wallet) => {
  if (localStorage.wallet) {
    return JSON.parse(localStorage.wallet)
  } else {
    return null
  }
}
const getAddress = () => {
  if (localStorage.wallet) {
    const wallet = JSON.parse(localStorage.wallet)
    return wallet && wallet.address
  } else {
    return null
  }
}

const getNonce = async (address) => {
  try {
    validator.validate({value: address, type: "ADDRESS"});
    const nonce = toNumber((await getTransactionCount(address, 'latest')).result);
    const localNonce = getWallet() ? getWallet().nonce : 0;
    if (nonce > localNonce) {
      setWallet({nonce});
      return nonce;
    } else {
      return localNonce
    }
  } catch (e) {
    throw  new Error(e.message)
  }
};

const isUnlocked = () => {
  return !!getAddress()
}
const isInWhiteList = (address) => {

}

export default {
  setWallet,
  getWallet,
  getAddress,
  isUnlocked,
  isInWhiteList,
  getNonce
}

