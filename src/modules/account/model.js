import {decrypt, fromMnemonic, fromPrivateKey, create} from 'Loopring/ethereum/account';
import PrivateKeyUnlockAccount from "./PrivateKeyUnlockAccount";
import MetaMaskUnlockAccount from './MetaMaskUnlockAccount'
import MnemonicUnlockAccount from './MnemonicUnlockAccount'
import TrezorUnlockAccount from './TrezorUnlockAccount'
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

    register(state,payload){
      register(payload.address)
    }
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
    * setMetamask({payload}, {put}) {
      const {web3} = payload
      window.WALLET = new MetaMaskUnlockAccount({web3: web3, address: web3.eth.accounts[0]})
      window.WALLET_UNLOCK_TYPE = 'Metamask'
      yield put({type: 'setWallet', payload: {privateKey: null, address:web3.eth.accounts[0] , mnemonic: null, password: null,walletType:'metaMask'}})
    },
    * createWallet({payload}, {put}) {
      const wallet = create(payload.password);
      yield put({type: 'setWallet', payload: {...wallet,password:payload.password,walletType:'key'}})
    },

    * connectToTrezor({payload},{put}){
      window.WALLET = new TrezorUnlockAccount({address: payload.address, path: payload.path})
      window.WALLET_UNLOCK_TYPE = 'Trezor'
      yield put({type: 'setWallet', payload: {...payload,walletType:'trezor'}})
    },

    * setWallet({payload}, {put,call}) {
      yield put({type: 'setAccount',payload:{...payload}});
      window.STORAGE.wallet.setWallet({address:payload.address});
    //  yield call({type:'register',payload:{address:payload.address}})
    }
  }
};
