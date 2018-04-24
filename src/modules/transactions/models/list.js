import namespace from '../namespace'
import * as apis from '../apis'
const {MODULES} = namespace
const currentToken = window.STORAGE.tokens.getCurrent()
export default {
  namespace: MODULES,
  state: {
    items: [],
    loading: false,
    loaded: false,
    page:{
      total:0,
      size:10,
      current:0,
    },
    filters:{token:currentToken},
    layer:{},
    defaultState:{},
    originQuery:{},
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
      yield put({type:'emit'});
    },
    *filtersChange({payload},{call, select,put}){
      yield put({type:'filtersChangeStart',payload});
      yield put({type:'emit'});
    },
    *columnsChange({payload},{call, select,put}){
      yield put({type:'pageChangeStart',payload});
      // yield put({type:'fetch'});
    },
    *sortChange({payload},{call, select,put}){
      yield put({type:'sortChangeStart',payload});
      // yield put({type:'fetch'});
    },
    *queryChange({payload},{call, select,put}){
      yield put({type:'queryChangeStart',payload});
      // yield put({type:'fetch'});
    },
    *emit({payload},{call, select,put}){
      const {page,filters,sort,defaultState,originQuery} = yield select(({ [MODULES]:LIST }) => LIST );
      if(window.SOCKET){
        const owner = window.WALLET && window.WALLET.getAddress()
        const query = {
          owner,
          symbol:filters.token,
          status:filters.status,
          txType:filters.txType,
          pageIndex:page.current,
          pageSize:page.size,
        }
        console.log('transaction_req',query)
        window.SOCKET.emit('transaction_req',JSON.stringify(query),(res)=>{
          res = JSON.parse(res)
          console.log('transaction_req res',res)
          if(!res.error){
            put({
              type: 'emitSuccess',
              payload: {
                page:{
                  ...page,
                },
                items:res.data.data,
                loading:false,
              },
            });
          }
        })
      }

    },

    *fetch({ payload={} }, { call, select, put }) {
      yield put({ type: 'fetchStart',payload});
      const {page,filters,sort,defaultState,originQuery} = yield select(({ [MODULES]:LIST }) => LIST );
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
            page:{
              ...page,
              ...res.page,
            },
            items:res.items,
            loading: false,
          },
        });
      }
    },
  },

  reducers: {
    fetchStart(state, action) {
      let {filters,page,sort,defaultState,originQuery}=state;
      let {payload} = action;
      if(!payload.defaultState){ payload.defaultState={} }
      if(!payload.originQuery){ payload.originQuery={} }
      return { ...state, loading: true, loaded:false,
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

      };

    },
    fetchSuccess(state, action) {
      return { ...state, ...action.payload };
    },
    emitSuccess(state, action) {
      return { ...state, ...action.payload };
    },
    pageChangeStart(state,action){
      let page = state.page;
      return {...state,page:{
        ...page,...action.payload.page
      }}
    },
    filtersChangeStart(state,action){
      let filters = state.filters;
      let page = state.page;
      return {
        ...state,
        loading:true,
        filters:{
          ...filters,...action.payload.filters
        },
        page:{
          ...page,
          current:1,
        },
        items:[]
      }
    },
    columnsChangeStart(state,action){
      return {...state,columns:action.payload.columns}
    },
    sortChangeStart(state,action){
      return {...state,sort:action.payload.sort}
    },
    queryChangeStart(state,action){
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
    itemsChange(state,action){
      let items = action.payload.items || [];
      return {
        ...state,
        items:[ ...items ],
        loading:false, // fix bug for loading
        page:{
          ...state.page,
          total:action.payload.page.total
        }
      }
    },
  },

};


