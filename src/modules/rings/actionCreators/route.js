
import { routerRedux } from 'dva/router';
import namespace from '../namespace'
const {MODULES} = namespace

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