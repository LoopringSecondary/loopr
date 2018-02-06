import {decrypt, fromMnemonic, fromPrivateKey, create} from 'Loopring/ethereum/account';

export default {
  namespace: 'account',
  state: {
    address: null,
    privateKey: null,
    mnemonic: null,
    publicKey: null,
    password: null,
    isUnlocked: false,
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
      };
    },
  },


  effects: {
    * setKeystore({payload}, {put}) {
      const {keyStore, password} = payload;
      const wallet = decrypt(keyStore, password);
      yield put({type: 'setWallet', payload: {...wallet, mnemonic: null, password}})
    },
    * setMnemonic({payload}, {put}) {
      const {mnemonic, dpath, password} = payload;
      const wallet = fromMnemonic(mnemonic, dpath, password);
      yield put({type: 'setWallet', payload: {...wallet, password}})
    },
    * setPrivateKey({payload}, {put}) {
      const {privateKey} = payload;
      const wallet = fromPrivateKey(privateKey);
      yield put({type: 'setWallet', payload: {...wallet, mnemonic: null, password: null}})
    },
    * createWallet({payload}, {put}) {
      const wallet = create(payload.password);
      yield put({type: 'setWallet', payload: {...wallet,password:payload.password}})
    },

    * setWallet({payload}, {put,call}) {
      yield put({type: 'setAccount', payload})
      // yield call({type:'register',payload:{address:payload.address}})
    }
  }
};
