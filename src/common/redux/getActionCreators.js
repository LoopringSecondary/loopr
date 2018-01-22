const listKeys = [
  "fetch",
  // "fetchStart",
  // "fetchSuccess",
  // "fetchError",
  "update",
  // "updateStart",
  // "updateSuccess",
  // "updateError",

  "create",
  // "createStart",
  // "createSuccess",
  // "createError",

  "delete",
  // "deleteStart",
  // "deleteSuccess",
  // "deleteError",

  "filtersChange",
  "sortChange",
  "pageChange",
  "queryChange",
  "columnsChange",
  "layerChange",
]


class ActionCreators {
  constructor(namespace){
    this.namespace = namespace
  }
  generator(){

  }
  getList(){
    let actionCreators = {};

    keys.forEach(key=>{
      const actionCreator = (payload)=>{
        // console.error('arguments',arguments);
        let action = {
          type:module+"/"+key,
          payload
        }
        // console.log('action',action);
        return action;
      }
      actionCreators[key]= actionCreator;
    })
    return actionCreators;
  }
}

function getActionCreators(module,type='list') {
  
}

// routeActionCreators

import { routerRedux } from 'dva/router';

let actionCreators = {
  goToEdit({item}) {
    let action = routerRedux.push({
        pathname: `${MODULES}/edit/${item.id}`,
    })
    console.log('action',action);
    return action;
  }
  ,
  goToList() {
      let action = routerRedux.push({
          pathname: `${MODULES}/list`,
      })
      console.log('action',action);
      return action;
  }
  ,
  goToRoute(pathname) {
      let action = routerRedux.push({
          pathname,
      })
      console.log('action',action);
      return action;
  }
  ,
  goToCreate({item}) {
      let action = routerRedux.push({
            pathname: `${MODULES}/create`,
      })
      console.log('action',action);
      return action;
  }
  ,
  goToDetail({item}) {
      let action = routerRedux.push({
            pathname: `${MODULES}/detail/${item.id}`,
      }) 
      console.log('action',action);
      return action;
  }
  ,
  goBack() {
      let action = routerRedux.go(-1);
      console.log('action',action);
      return action;
  }
}

export default actionCreators;

