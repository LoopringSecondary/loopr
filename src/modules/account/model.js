import {decrypt, fromMnemonic, fromPrivateKey, create} from 'Loopring/ethereum/account';
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
        isUnlocked: false,
        walletType:null,
        address: null,
        privateKey: null,
        mnemonic: null,
        publicKey: null,
        password: null,
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
      yield put({type: 'setWallet', payload: {...wallet, mnemonic: null, password,walletType:'key'}})
    },
    * setMnemonic({payload}, {put}) {
      const {mnemonic, dpath, password} = payload;
      const wallet = fromMnemonic(mnemonic, dpath, password);
      yield put({type: 'setWallet', payload: {...wallet, password,walletType:'key'}})
    },
    * setPrivateKey({payload}, {put}) {
      const {privateKey} = payload;
      const wallet = fromPrivateKey(privateKey);
      yield put({type: 'setWallet', payload: {...wallet, mnemonic: null, password: null,walletType:'key'}})
    },
    * createWallet({payload}, {put}) {
      const wallet = create(payload.password);
      yield put({type: 'setWallet', payload: {...wallet,password:payload.password,walletType:'key'}})
    },

    * connectToTrezor({payload},{put}){
      yield put({type: 'setWallet', payload: {...payload,walletType:'trezor'}})
    },

    * setWallet({payload}, {put,call}) {
      window.STORAGE.wallet.setWallet({address:payload.address});
      yield put({type: 'setAccount', payload})
    //  yield call({type:'register',payload:{address:payload.address}})
    }
  }
};
