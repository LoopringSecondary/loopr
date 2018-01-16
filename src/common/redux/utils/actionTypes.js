
function create(module,keys) {

  let actionTypes = {};
  keys.forEach(key=>{
    actionTypes[key] = module+"/"+key;
  })
  return  actionTypes;
  
}

export default create;