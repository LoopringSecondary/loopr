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

export default {
  setWallet,
  getWallet,
}

