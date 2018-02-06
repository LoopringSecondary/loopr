import namespace from '../namespace'
import * as apis from '../apis'
import { tokens } from '../../../common/config/data';

export default {
  namespace: 'tokens',
  state: {
    items: [...tokens],
    selected:{ETH:true},
    loading: false,
    loaded: false,
    page:{
      total:0,
      size:10,
      current:0,
    },
    filters:{},
    layer:{},
    defaultState:{},
    originQuery:{},
  },
  reducers: {
    updateItem(state,{payload}){
      const { items } = state
      const { item } = payload
      items.forEach((token,index)=>{
       if(token.symbol===item.symbol){
         items[index] = {
           ...token,
           ...item,
         }
       }
      })
      return {
       ...state,
       items,
      }
    },
    selectedChange(state,action){
      return {
        ...state,
        selected:{
          ...state.selected,
          ...action.payload.selected,
      }}
    },
    favoredChange(state,action){
      return {
        ...state,
        favored:{
          ...state.favored,
          ...action.payload.favored,
      }}
    },
    pageChange(state,action){
      let page = state.page;
      return {...state,page:{
        ...page,...action.payload.page
      }}
    },
    filtersChange(state,action){
      let filters = state.filters;
      let page = state.page;
      return {
        ...state,
        filters:{
          ...filters,...action.payload.filters
        },
        page:{
          ...page,
          current:1,
        }
      }
    },
    columnsChange(state,action){
      return {...state,columns:action.payload.columns}
    },
    sortChange(state,action){
      return {...state,sort:action.payload.sort}
    },
    queryChange(state,action){
      let filters = state.filters;
      let page = state.page;
      return {
        ...state,
        filters:{
          ...filters,
          ...action.payload.filters
        },
        page:{
          ...page,
          current:1,
        },
        sort:{
          ...action.payload.sort
        }
      }
    },
    updateSuccess(state, action) {
      return { ...state, ...action.payload };
    },
  },
};


