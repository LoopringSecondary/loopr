import namespace from '../namespace'
import * as apis from '../apis'
const initTokens = window.STORAGE.tokens.getTokens()
const configTokens = window.CONFIG.getTokens()
export default {
  namespace: 'tokens',
  state: {
    items: [...configTokens],
    selected:initTokens.selected || {LRC:true},
    favored:initTokens.favored || {},
    loading: false,
    loaded: false,
    page:{
      total:0,
      size:10,
      current:0,
    },
    filters:initTokens.filters || {},
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
      window.STORAGE.tokens.update({
        selected:{
          ...state.selected,
          ...action.payload.selected,
        }
      })
      return {
        ...state,
        selected:{
          ...state.selected,
          ...action.payload.selected,
        }
      }
    },
    favoredChange(state,action){
      window.STORAGE.tokens.update({
        favored:{
          ...state.favored,
          ...action.payload.favored,
        }
      })
      return {
        ...state,
        favored:{
          ...state.favored,
          ...action.payload.favored,
        }
      }
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
      window.STORAGE.tokens.update({
        filters:{
          ...filters,
          ...action.payload.filters
        }
      })
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


