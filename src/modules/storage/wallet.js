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
const getAddress = ()=>{
  if(localStorage.wallet){
    const wallet = JSON.parse(localStorage.wallet)
    return wallet && wallet.address
  }else{
    return null
  }
}

const isUnlocked = ()=>{
  return !!getAddress()
}
const isInWhiteList = (address)=>{

}

export default {
  setWallet,
  getWallet,
  getAddress,
  isUnlocked,
  isInWhiteList,
}

