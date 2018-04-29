import {getOrders} from 'Loopring/relay/order'

export async function fetchList(payload){
    let {page,filters,sort} = payload
    let filter = {}
    if(filters){
      filter = {...filters}
    }
    if(page){
      filter.pageIndex = page.current
      filter.pageSize = page.size
    }
    filter.delegateAddress = window.CONFIG.getDelegateAddress();
    filter.owner = window.WALLET && window.WALLET.getAddress();
    return getOrders(filter).then(res=>{
      if(!res.error && res.result.data){
        const orders = res.result.data.filter(order => window.CONFIG.getTokenBySymbol(order.originalOrder.tokenB) && window.CONFIG.getTokenBySymbol(order.originalOrder.tokenB).digits &&
          window.CONFIG.getTokenBySymbol(order.originalOrder.tokenS)&&  window.CONFIG.getTokenBySymbol(order.originalOrder.tokenS).digits &&
          window.CONFIG.getMarketBySymbol(order.originalOrder.tokenB,order.originalOrder.tokenS) && window.CONFIG.getMarketBySymbol(order.originalOrder.tokenB,order.originalOrder.tokenS).pricePrecision);
        return {
          items:orders,
          page:{
            current:res.result.pageIndex,
            size:res.result.pageSize,
            total:res.result.total,
          }
        }
      }else{
        // tmp code because server has no error-code
        return {
          items:[],
          page:{
          }
        }
      }
    })
}
