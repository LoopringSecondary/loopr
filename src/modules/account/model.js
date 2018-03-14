import {create, decrypt, fromMnemonic, fromPrivateKey} from 'Loopring/ethereum/account';
import PrivateKeyUnlockAccount from "./PrivateKeyUnlockAccount";
import MetaMaskUnlockAccount from './MetaMaskUnlockAccount'
import MnemonicUnlockAccount from './MnemonicUnlockAccount'
import {register} from "Loopring/relay/account";
import {message} from 'antd'

export default {
  namespace: 'account',
  state: {
    address: null,
    isUnlocked: false,
    walletType:null, //PrivateKey,KeyStore,Mnemonic, Metamask, Trezor, LedgerHQ
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
        isUnlocked: false,
        walletType:null, //PrivateKey,KeyStore,Mnemonic, Metamask, Trezor, LedgerHQ
      };
    },

  },


  effects: {
    * setKeystore({payload}, {put}) {
      console.log('arguments',arguments);
      const {keyStore, password,cb} = payload;
      try{
        const wallet = decrypt(keyStore, password);
        window.WALLET = new PrivateKeyUnlockAccount({privateKey: wallet.privateKey, address: wallet.address,password});
        window.WALLET_UNLOCK_TYPE = 'KeyStore';
        yield put({type: 'setWallet', payload: {address:wallet.address,walletType:'KeyStore'}});
        cb();
      }catch(e){
       cb(e)
      }
    },
    * setMnemonic({payload}, {put}) {
      const {index} = payload;
      window.WALLET.setIndex(index);
      const address = window.WALLET.getAddress();
      yield put({type: 'setWallet', payload: {address,walletType:'Mnemonic'}})
    },
    * setPrivateKey({payload}, {put}) {
      const {privateKey} = payload;
      const wallet = fromPrivateKey(privateKey);
      window.WALLET = new PrivateKeyUnlockAccount({privateKey: privateKey, address: wallet.address});
      window.WALLET_UNLOCK_TYPE = 'PrivateKey';
      yield put({type: 'setWallet', payload: {address:wallet.address,walletType:'PrivateKey'}})
    },
    * setMetamask({payload}, {put}) {
      const {web3} = payload;
      window.WALLET = new MetaMaskUnlockAccount({web3: web3, address: web3.eth.accounts[0]});
      window.WALLET_UNLOCK_TYPE = 'MetaMask';
      yield put({type: 'setWallet', payload: {address:web3.eth.accounts[0],walletType:'MetaMask'}})
    },
    * createWallet({payload}, {put}) {
      const wallet = create(payload.password);
      window.WALLET = new MnemonicUnlockAccount({...wallet,password:payload.password});
      window.WALLET_UNLOCK_TYPE = 'Mnemonic';
      yield put({type: 'setWallet', payload: {address:wallet.address,walletType:'Mnemonic'}})
    },

    * connectToTrezor({payload},{put}){
      const {index} = payload;
      window.WALLET.setIndex(index);
      const address = window.WALLET.getAddress();
      yield put({type: 'setWallet', payload: {address,walletType:'Trezor'}})
    },

    * setWallet({payload}, {put,call}) {
      yield put({type: 'setAccount',payload});
      window.STORAGE.wallet.setWallet({address:payload.address});
      yield call(register,payload.address);
    },

  }
};
