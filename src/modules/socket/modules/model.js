const socket = {}
const sockets = {
  fetchList:(payload,cb)=>{
    socket.on('eventName',cb)
  }
}

export default {
  namespace: 'sockets',
  state: {

  },
  effects: {
    *pageChange({payload},{call, select,put}){
      yield put({type:'pageChangeStart',payload});
      yield put({type:'fetch'});
    },
    *filtersChange({payload},{call, select,put}){
      yield put({type:'filtersChangeStart',payload});
      yield put({type:'fetch'});
    },
    *sortChange({payload},{call, select,put}){
      yield put({type:'sortChangeStart',payload});
      yield put({type:'fetch'});
    },
    *queryChange({payload},{call, select,put}){
      yield put({type:'queryChangeStart',payload});
      yield put({type:'fetch'});
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
      emit(new_payload,({})=>{
          yield put({
          type: 'fetchSuccess',
          payload: {
            page:{
              ...page,
              ...res.page,
            },
            items:res.items,
            loading: false,
            loaded:true
          },
        });
      })
      // const res = yield call(apis.fetchList, new_payload);
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
    pageChangeStart(state,action){
      let page = state.page;
      return {...state,page:{
        ...page,...action.payload.page
      }}
    },

    // filters 变化时 page.current也必须变化
    filtersChangeStart(state,action){
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
      console.log('itemsChange',action)
      let items = action.payload.items || [];
      return {
        ...state,
        items:[ ...items ]
      }
    },
  },

};


