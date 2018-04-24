export function unlockRedirection(fromPage) {
  switch(fromPage){
    case 'TradeFrom': window.routeActions.gotoPath('/trade'); break;
    case 'Wallet': window.routeActions.gotoPath('/wallet'); break;
    //case 'Portfolio': window.routeActions.gotoPath('/wallet/portfolio'); break;
    default: window.routeActions.gotoPath('/wallet/assets'); break;
  }
}
