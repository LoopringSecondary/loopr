import React from 'react';
import intl from 'react-intl-universal';
import {toNumber} from "../../../common/Loopring/common/formatter";
const uiFormatter = window.uiFormatter
const fm = window.uiFormatter.TokenFormatter

function ListBlock(props) {
  const {className, style,trades=[],market=""} = props;
  const tokenL = market.split('-')[0].toUpperCase()
  const tokenR = market.split('-')[1].toUpperCase()
  return (
    <div className={className} style={{...style}}>
      <div style={{height:'445px',overflow:'auto'}}>
        <table className="w-100">
          <tbody>
          <tr className="zb-b-b">
            <th className="border-0 p0 pl10">
              <div className="col fs12 color-black-3 text-left lh25 font-weight-normal">
                {intl.get('global.price')} ({tokenR})
              </div>
            </th>
            <th className="border-0 p0 pl5 pr5">
              <div className="col-auto fs12 color-black-3 text-left lh25 font-weight-normal">
                {intl.get('global.amount_label')} ({tokenL})
              </div>
            </th>
            <th className="border-0 p0 pr10">
              <div className="col-auto fs12 color-black-3 text-right lh25 font-weight-normal">
                {intl.get('global.time')}
              </div>
            </th>
          </tr>
          {
            trades.filter(item=>item.side === 'sell').map((item,index)=>
              <tr key={index} className="">
                <td className="border-0 pl0 pl10">
                  <div className="fs12 color-black-2 text-left lh20 p0">
                    {item.price}
                  </div>
                </td>
                <td className="border-0 pl5 pr5">
                  <div className="fs12 color-black-2 text-left lh20 p0" >
                    {item.amount}
                  </div>
                </td>
                <td className="border-0 pr10">
                  <div className="fs12 color-black-2 text-right lh20 p0">
                    {uiFormatter.getFormattedTime(item.createTime,'MM-DD HH:mm')}
                  </div>
                </td>
              </tr>
            )
          }
          {
            trades.length == 0 &&
            <tr >
              <td colSpan="10" className="fs12 border-0 text-center color-black-3 lh20 pt10 pb10">{intl.get('global.no_data')}</td>
            </tr>
          }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListBlock
