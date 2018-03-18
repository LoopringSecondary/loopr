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
export default {
  set,
  get,
}

