import {decrypt, fromMnemonic, fromPrivateKey, create} from 'Loopring/ethereum/account';
import PrivateKeyUnlockAccount from "./PrivateKeyUnlockAccount";
import MetaMaskUnlockAccount from './MetaMaskUnlockAccount'
import MnemonicUnlockAccount from './MnemonicUnlockAccount'
import TrezorUnlockAccount from './TrezorUnlockAccount'
import LedgerUnlockAccount from './LedgerUnlockAccount'
import {register} from "Loopring/relay/account";


export default {
  namespace: 'account',
  state: {
    address: null,
    privateKey: null,
    mnemonic: null,
    publicKey: null,
    password: null,
    isUnlocked: false,
    walletType:null, //key, metaMask, trezor, ledgerHQ
  },
  reducers: {
    setAccount(state, {payload}) {
      return {
        ...state,
        ...payload,
        isUnlocked: true,
      };
    },

    deleteAccount(state, {payload}) {
      return {
        ...state,
        address: null,
        privateKey: null,
        mnemonic: null,
        publicKey: null,
        password: null,
        isUnlocked: false,
        walletType:null, //key, metaMask, trezor, ledgerHQ
      };
    },

  },


  effects: {
    * setKeystore({payload}, {put}) {
      const {keyStore, password} = payload;
      const wallet = decrypt(keyStore, password);
      window.WALLET = new PrivateKeyUnlockAccount({privateKey: wallet.privateKey, address: wallet.address})
      window.WALLET_UNLOCK_TYPE = 'KeyStore'
      yield put({type: 'setWallet', payload: {...wallet, mnemonic: null, password,walletType:'key'}})
    },
    * setMnemonic({payload}, {put}) {
      const {mnemonic, dpath, password,index} = payload;
      const wallet = fromMnemonic(mnemonic, dpath.concat(`/${index}`), password);
      window.WALLET.setIndex(index);
      window.WALLET.setPrivateKey(wallet.privateKey);
      yield put({type: 'setWallet', payload: {...wallet, password,walletType:'key'}})
    },
    * setPrivateKey({payload}, {put}) {
      const {privateKey} = payload;
      const wallet = fromPrivateKey(privateKey);
      window.WALLET = new PrivateKeyUnlockAccount({privateKey: privateKey, address: wallet.address})
      window.WALLET_UNLOCK_TYPE = 'PrivateKey'
      yield put({type: 'setWallet', payload: {...wallet, mnemonic: null, password: null,walletType:'key'}})
    },
    * createWallet({payload}, {put}) {
      const wallet = create(payload.password);
      yield put({type: 'setWallet', payload: {...wallet,password:payload.password,walletType:'key'}})
    },
    * connectToTrezor({payload},{put}){
      const {index} = payload;
      window.WALLET.setIndex(index);
      const address = window.WALLET.getAddress();
      yield put({type: 'setWallet', payload: {address,walletType:'trezor'}})
    },
    * setWallet({payload}, {put,call}) {
      yield put({type: 'setAccount',payload:{...payload}});
      window.STORAGE.wallet.setWallet({address:payload.address});
      yield call(register,payload.address);
    },

  }
};
