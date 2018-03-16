import {getTransactionCount} from "Loopring/ethereum/utils";
import {toNumber} from "Loopring/common/formatter";
import validator from 'Loopring/ethereum/validator';

const setWallet = (wallet) => {
  const wallets = localStorage.wallet ? JSON.parse(localStorage.wallet) : [];
  const otherWallets = wallets.filter(w => w.address.toLowerCase() === wallet.address.toLowerCase());
  localStorage.wallet = JSON.stringify(otherWallets.push(wallet))
};

const getWallet = (address) => {
  const wallets = localStorage.wallet ? JSON.parse(localStorage.wallet) : [];
  return wallets.find((wallet) => wallet.address.toLowerCase() === address.toLowerCase())
};

const getNonce = async (address) => {
  try {
    validator.validate({value: address, type: "ADDRESS"});
    const nonce = toNumber((await getTransactionCount(address, 'pending')).result);
    const localNonce = getWallet(address) && getWallet(address).nonce ? getWallet(address).nonce : 0;
    if (nonce > localNonce) {
      setWallet({address,nonce});
      return nonce;
    } else {
      return localNonce
    }
  } catch (e) {
    throw  new Error(e.message)
  }
};

const isInWhiteList = (address) => {

}

export default {
  setWallet,
  getWallet,
  isInWhiteList,
  getNonce
}

