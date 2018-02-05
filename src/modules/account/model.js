import {decrypt} from 'Loopring/ethereum/account';
import {fromMnemonic} from "Loopring/ethereum/account"
import {fromPrivateKey} from 'Loopring/ethereum/account'


export default {
  namespace: 'account',
  state: {
    address:null,
    privateKey:null,
    mnemonic:null,
    publicKey:null,
    password:null,
    isUnlocked:false,
  },
  reducers: {
    setAccount(state, { payload }) {
      return {
        ...state,
        ...payload,
        isUnlocked:true,
      };
    },

    deleteAccount(state, { payload }) {
      return {
        ...state,
        isUnlocked:false,
      };
    },
  },


  effects: {
    *setKeystore({payload}, {put}) {
      const {keyStore, password} = payload;
      const wallet = decrypt(keyStore, password);
      yield put({type: 'setWallet', payload: {...wallet, mnemonic: null,password}})
    },
    *setMnemonic({payload},{put}){
      const {mnemonic, dpath,password} = payload;
      const wallet = fromMnemonic(mnemonic,dpath,password);
      yield put({type: 'setWallet', payload: {...wallet,password}})
    },
    *setPrivateKey({payload},{put}){
      const {privateKey} = payload;
      const wallet = fromPrivateKey(privateKey);
      yield put({type: 'setWallet', payload: {...wallet, mnemonic: null,password:null}})
    },
    *setWallet({payload},{put}){
      yield put({type: 'setAccount', payload})
     // yield put({type:'register',payload:{address:payload.address}})
    }
  }
};
