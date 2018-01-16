import { hashHistory } from 'dva/router';
import {MODULE} from '../namespace';

let actions = {
  goToList({item}) {
      hashHistory.push({
            pathname: `${MODULE}/list`,
      }) 
  }
  goToDetail({item}) {
      hashHistory.push({
            pathname: `${MODULE}/detail/${item.id}`,
      }) 
  }
  goBack() {
      hashHistory.go(-1);
  }
}

export default actions;