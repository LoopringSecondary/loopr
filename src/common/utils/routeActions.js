import { routerRedux} from 'dva/router';
import createHashHistory from 'history/createHashHistory';
const history  = createHashHistory()

export default  {
  goBack:()=>{
      history.goBack()
  },
  goForward:()=>{
      history.goForward()
  },
  gotoRoute:(route)=>{
      history.push(route);
  },
  gotoPath:(path,state)=>{
    history.push({
      pathname:path,
      ...state,
    });
  },
  gotoHref:(href)=>{
     window.open(href);
  }
}

