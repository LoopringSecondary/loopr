
function getActionCreators(module,keys = []) {
  let actionCreators = {};
  keys.forEach(key=>{

    function actionCreator(payload,custom){
        let action = {}
        if(module){
          action = {
            type:module+"/"+key,
            payload
          }
        }else{
          action = {
            type:key,
            payload
          }
        }
        console.log('action',action);
        return action;
    }

    actionCreators[key]= actionCreator;

  })
  return  actionCreators;

}

export default getActionCreators;
