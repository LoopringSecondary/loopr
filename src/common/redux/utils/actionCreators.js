
function create(module,keys = []) {
  
  let actionCreators = {};
  keys.forEach(key=>{

    function actionCreator(payload,custom){
        // console.error('arguments',arguments);
        let action = {
          type:module+"/"+key,
          payload
        }
        console.log('action',action);
        return action;
    }

    actionCreators[key]= actionCreator;
      
  })
  return  actionCreators;
  
}

export default create;
