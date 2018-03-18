import namespace from '../namespace'
import * as apis from '../apis'
const {MODULES} = namespace
let initState = {
  items: [],
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
}
export default {
  namespace: MODULES,
  state: {
    'orders/trade':{...initState},
    'orders/wallet':{...initState}
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === `/${MODULES}/list`) {
          dispatch({type: 'fetch'});
        }
      });
    },
  },
  effects: {
    *pageChange({payload},{call, select,put}){
      yield put({type:'pageChangeStart',payload});
      yield put({type:'fetch',payload});
    },
    *filtersChange({payload},{call, select,put}){
      yield put({type:'filtersChangeStart',payload});
      yield put({type:'fetch',payload});
    },
    *columnsChange({payload},{call, select,put}){
      // yield put({type:'pageChangeStart',payload});
      // yield put({type:'fetch'});
    },
    *sortChange({payload},{call, select,put}){
      yield put({type:'sortChangeStart',payload});
      yield put({type:'fetch',payload});
    },
    *queryChange({payload},{call, select,put}){
      yield put({type:'queryChangeStart',payload});
      yield put({type:'fetch',payload});
    },
    *fetch({ payload={} }, { call, select, put }) {
      yield put({ type: 'fetchStart',payload});
      let {id} = payload
      const {page,filters,sort,defaultState,originQuery} = yield select(({ [MODULES]:LIST }) => LIST[id] );
      let new_payload = {page,filters,sort,originQuery};
      if(defaultState.filters){
        new_payload.filters={
          ...new_payload.filters,
          ...defaultState.filters
        }
      }

      const res = yield call(apis.fetchList, new_payload);
      if (res.items) {
        yield put({
          type: 'fetchSuccess',
          payload: {
            id:payload.id,
            page:{
              ...page,
              ...res.page,
            },
            items:res.items,
            loading: false,
            loaded:true
          },
        });
      }
    },
  },

  reducers: {
    fetchStart(state, action) {
      let {payload} = action
      let {id} = payload
      let {filters,page,sort,defaultState,originQuery}=state[id];
      if(!payload.defaultState){ payload.defaultState={} }
      if(!payload.originQuery){ payload.originQuery={} }
      return {
        ...state,
        [id]:{
          loading: true, loaded:false,
          filters:{
            ...filters,
            ...payload.filters,
          },
          page:{
            ...page,
            ...payload.page,
          },
          sort:{
            ...sort,
            ...payload.sort,
          },
          defaultState:{
            ...defaultState,
            ...payload.defaultState,
          },
          originQuery:{
            ...originQuery,
            ...payload.originQuery,
          },
        }
      }

    },
    fetchSuccess(state, action) {
      let {payload} = action
      let {id} = payload
      return {
        ...state,
        [id]:{
          ...state[id],
          ...payload,
        },
      };
    },
    pageChangeStart(state,action){
      let {payload} = action
      let {id} = payload
      return {
        ...state,
        [id]:{
          ...state[id],
          page:{
            ...state[id].page,
            ...payload.page
          }
        }
      }
    },

    // filters 变化时 page.current也必须变化
    filtersChangeStart(state,action){
      let {payload} = action
      let {id} = payload
      return {
        ...state,
        [id]:{
          ...state[id],
          filters:{
            ...state[id].filters,
            ...payload.filters,
          },
          page:{
            ...state[id].page,
            current:1,
          }
        }
      }
    },
    sortChangeStart(state,action){
      let {payload} = action
      let {id} = payload
      return {
        ...state,
        [id]:{
          ...state[id],
          sort:{
            // ...state[id].sort,
            ...payload.sort
          }
        }
      }
    },
    queryChangeStart(state,action){
      let {payload} = action
      let {id} = payload
      return {
        ...state,
        [id]:{
          ...state[id],
          filters:{
            ...state[id].filters,
            ...payload.filters,
          },
          page:{
            ...state[id].page,
            current:1,
          },
          sort:{
            // ...state[id].sort,
            ...payload.sort
          },

        }
      }
    },
  },

};


