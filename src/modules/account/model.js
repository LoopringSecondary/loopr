import {create, decrypt, fromMnemonic, fromPrivateKey} from 'Loopring/ethereum/account';
import PrivateKeyUnlockAccount from "./PrivateKeyUnlockAccount";
import MetaMaskUnlockAccount from './MetaMaskUnlockAccount'
import MnemonicUnlockAccount from './MnemonicUnlockAccount'
import AddressUnlockAccount from './AddressUnlockAccount'
import {register} from "Loopring/relay/account";
import Notification from 'Loopr/Notification'
import intl from 'react-intl-universal';
import {unlockWithMetaMask} from '../../components/common/Unlock'

let unlockedType = window.STORAGE.wallet.getUnlockedType()
let unlockedAddress = window.STORAGE.wallet.getUnlockedAddress()
if(unlockedType && unlockedType === 'MetaMask' && window.web3) {
  if(window.web3.eth.accounts[0]) {
    unlockedAddress = window.web3.eth.accounts[0]
    unlockWithMetaMask(window.web3)
  } else {
    Notification.open({
      type:'warning',
      message:intl.get('wallet.metamask_installed_locked_title'),
      description:intl.get('wallet.metamask_installed_locked_content')
    });
  }
} else {
  if(unlockedAddress) {
    unlockedType = 'Address'
    window.WALLET_UNLOCK_TYPE = 'Address'
    window.WALLET = new AddressUnlockAccount({address: unlockedAddress})
    Notification.open({
      type:'warning',
      message:intl.get('wallet.in_watch_only_mode_title'),
      description:intl.get('wallet.unlock_by_cookie_address_notification')
    });
  } else {
    unlockedType = ''
  }
}

export default {
  namespace: 'account',
  state: {
    address: unlockedAddress || null,
    isUnlocked: !!unlockedAddress ,
    walletType: unlockedType ? unlockedType : unlockedAddress ? 'Address' : null, //PrivateKey, KeyStore,Mnemonic, MetaMask, Trezor, LedgerHQ
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
      window.WALLET = null
      window.WALLET_UNLOCK_TYPE = null
      window.routeActions.gotoPath('/auth/wallet') // TODO
      window.STORAGE.wallet.clearUnlockedAddress()
      return {
        ...state,
        address: null,
        isUnlocked: false,
        walletType: null, //PrivateKey,KeyStore, Mnemonic, MetaMask, Trezor, LedgerHQ
      };
    },

  },


  effects: {
    * setKeystore({payload}, {put}) {
      const {keyStore, password, cb} = payload;
      try {
        const wallet = decrypt(keyStore, password);
        window.WALLET = new PrivateKeyUnlockAccount({privateKey: wallet.privateKey, password});
        window.WALLET_UNLOCK_TYPE = 'KeyStore';
        yield put({type: 'setWallet', payload: {address: wallet.address, walletType: 'KeyStore'}});
        cb();
      } catch (e) {
        cb(e)
      }
    },
    * setMnemonic({payload}, {put}) {
      const {index} = payload;
      window.WALLET.setIndex(index);
      const address = window.WALLET.getAddress();
      yield put({type: 'setWallet', payload: {address, walletType: 'Mnemonic'}})
    },
    * setPrivateKey({payload}, {put}) {
      const {privateKey} = payload;
      const wallet = fromPrivateKey(privateKey);
      window.WALLET = new PrivateKeyUnlockAccount({privateKey: privateKey, address: wallet.address});
      window.WALLET_UNLOCK_TYPE = 'PrivateKey';
      yield put({type: 'setWallet', payload: {address: wallet.address, walletType: 'PrivateKey'}})
    },
    * setMetamask({payload}, {put}) {
      const {web3} = payload;
      window.WALLET = new MetaMaskUnlockAccount({web3: web3, address: web3.eth.accounts[0]});
      window.WALLET_UNLOCK_TYPE = 'MetaMask';
      yield put({type: 'setWallet', payload: {address: web3.eth.accounts[0], walletType: 'MetaMask'}})
    },
    * createWallet({payload}, {put}) {
      const wallet = create(payload.password);
      window.WALLET = new MnemonicUnlockAccount({...wallet, password: payload.password});
      window.WALLET_UNLOCK_TYPE = 'Mnemonic';
      yield put({type: 'setWallet', payload: {address: wallet.address, walletType: 'Mnemonic'}})
    },

    * connectToTrezor({payload}, {put}) {
      const {index} = payload;
      window.WALLET.setIndex(index);
      const address = window.WALLET.getAddress();
      yield put({type: 'setWallet', payload: {address, walletType: 'Trezor'}})
    },

    * setWallet({payload}, {put, call}) {
      window.STORAGE.wallet.storeUnlockedAddress(payload.walletType, payload.address)
      yield put({type: 'setAccount', payload});
      yield call(register, payload.address);
    },

  }
};
