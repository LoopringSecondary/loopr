const set = (settings)=>{
  localStorage.settings = JSON.stringify(settings)
}
const get = ()=>{
  if(localStorage.settings){
     return JSON.parse(localStorage.settings)
  }else{
    return {
      preference:{},
      trading:{},
      relay:{},
    }
  }
}
const getRelay = ()=>{
  const defaultHost = '//relay1.loopring.io'
  return defaultHost
  if(localStorage.settings){
     const settings = JSON.parse(localStorage.settings)
     return settings.relay.selected || defaultHost
  }else{
    return defaultHost
  }
}
const getContractVersion = ()=>{
  const defaultVersion = 'v1.3'
  return defaultVersion
  if(localStorage.settings){
     const settings = JSON.parse(localStorage.settings)
     return settings.trading.contract.version || defaultVersion
  }else{
    return defaultVersion
  }
}


export default {
  set,
  get,
  getRelay,
  getContractVersion,
}

