const setWallet = (wallet)=>{
  localStorage.wallet = JSON.stringify(wallet)
}

const getWallet = (wallet)=>{
  if(localStorage.wallet){
    return JSON.parse(localStorage.wallet)
  }else{
    return null
  }
}

const isUnlocked = ()=>{
  return localStorage.wallet && JSON.parse(localStorage.wallet) && JSON.parse(localStorage.wallet).address
}
const isInWhiteList = (address)=>{

}

export default {
  setWallet,
  getWallet,
  isUnlocked,
  isInWhiteList,
}

