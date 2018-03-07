import {decrypt, fromMnemonic, fromPrivateKey, create} from 'Loopring/ethereum/account';
import {register} from "Loopring/relay/account";
import {getTransactionCount} from "Loopring/ethereum/utils";
import {toNumber} from "Loopring/common/formatter";

export default {
  namespace: 'account',
  state: {
    address: null,
    privateKey: null,
    mnemonic: null,
    publicKey: null,
    password: null,
    isUnlocked: false,
    nonce:null,
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
        nonce:null,
        walletType:null, //key, metaMask, trezor, ledgerHQ
      };
    },

    register(state,payload){
      register(payload.address)
    },

    setNonce(state,{payload}){
      return {
        ...state,
        ...payload
      };
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
      yield put({type: 'setAccount',payload:{...payload}});
      let nonce = toNumber((yield call(getTransactionCount,payload.address,'latest')).result); // fix bug:
      yield window.STORAGE.transactions.updateTx();
      const txs = window.STORAGE.transactions.getTxs();
      nonce = nonce + txs.length;
      window.STORAGE.wallet.setWallet({nonce,address:payload.address});
      yield put({type:'setNonce',payload:{nonce}});
    //  yield call({type:'register',payload:{address:payload.address}})
    },

    * updateNonce({payload},{put}){
      yield put({type:'setNonce', payload});
      window.STORAGE.wallet.setWallet(payload);
    }

  }
};
