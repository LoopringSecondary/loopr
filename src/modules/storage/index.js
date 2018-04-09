import balances from './balances'
import wallet from './wallet'
import settings from './settings'
import tokens from './tokens'
import transactions from './transactions'
import markets from './markets'

const setLocalStorageVersion = (version) => {
  localStorage.dataVersion = version
}

const getLocalStorageVersion = () => {
  return localStorage.dataVersion || 0
}

const clearLocalStorage = () => {
  localStorage.clear();
}

export default {
  balances,
  wallet,
  settings,
  tokens,
  transactions,
  markets,
  setLocalStorageVersion,
  getLocalStorageVersion,
  clearLocalStorage
}
