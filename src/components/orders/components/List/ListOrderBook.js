import React from 'react';
import intl from 'react-intl-universal';
const uiFormatter = window.uiFormatter
const fm = window.uiFormatter.TokenFormatter

function ListOrderBook(props) {
  const {className, style,depth,market=""} = props;
  const tokenL = market.split('-')[0].toUpperCase()
  const tokenR = market.split('-')[1].toUpperCase()
  const ListItem = ({item,side})=>{
    return (
      <tr className="cursor-pointer">
        <td className="border-0 pl10">
          {
            side === 'sell' &&
            <div className="fs12 color-red-500 text-left p0 lh20">
              {Number(item[0]).toFixed(8)}
            </div>
          }
          {
            side === 'buy' &&
            <div className="fs12 color-green-500 text-left p0 lh20">
              {Number(item[0]).toFixed(8)}
            </div>
          }
        </td>
        <td className="border-0 pl5 pr5">
          <div className="fs12 color-black-2 text-center p0 lh20">
            {Number(item[1]).toFixed(4)}
          </div>
        </td>
        <td className="border-0 pr10">
          <div className="fs12 color-black-2 text-center p0 lh20">
            {Number(item[2]).toFixed(4)}
          </div>
        </td>
      </tr>
    )
  }

  const thead = (
      <tr className="zb-b-b">
        <th className="border-0 p0 pl10 lh25">
          <div className="fs12 color-black-3 text-left font-weight-normal">
            {intl.get('global.price')}{false && tokenR}
          </div>
        </th>
        <th className="border-0 p0 pl5 pr5 lh25">
          <div className="col-auto fs12 color-black-3 text-center font-weight-normal">
            {intl.get('global.amount_label')}{false && tokenL}
          </div>
        </th>
        <th className="border-0 p0 pr10 lh25">
          <div className="col-auto fs12 color-black-3 text-center font-weight-normal">
            {intl.get('global.time')}
          </div>
        </th>
      </tr>
  )
  return (
    <div className={className} style={{...style}}>
      <div style={{height:'230px'}}>
        <table className="w-100" >
          {thead}
          <tbody >
            {
              depth && depth.buy && depth.buy.map((item,index)=>
               <ListItem key={index} item={item} side="buy" />
              )
            }
            {
              !(depth && depth.buy && depth.buy.length > 0) &&
              <tr >
                <td colSpan="10" className="fs12 border-0 text-center color-black-3 lh20">{intl.get('global.no_data')}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <div style={{height:'230px'}}>
        <table className="w-100 zb-b-t" >
          {thead}
          <tbody style={{height:'210px'}}>
            {
              false &&
              <tr className="">
                <td colSpan="10" className="border-0 zb-b-t">
                  <div className="zb-b-b fs12 color-black-3 lh20 pl10 pr10">
                    Spread 0.1
                  </div>
                </td>
              </tr>
            }
            {
              depth && depth.sell && depth.sell.map((item,index)=>
               <ListItem key={index} item={item} side="sell" />
              )
            }
            {
              !(depth && depth.sell && depth.sell.length > 0) &&
              <tr >
                <td colSpan="10" className="fs12 border-0 text-center color-black-3 lh20">{intl.get('global.no_data')}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListOrderBook
