import React from 'react';
import intl from 'react-intl-universal';
const uiFormatter = window.uiFormatter
const fm = window.uiFormatter.TokenFormatter

function ListBlock(props) {
  const {className, style,items=[],market=""} = props;
  const tokenL = market.split('-')[0].toUpperCase()
  const tokenR = market.split('-')[1].toUpperCase()
  return (
    <div className={className} style={{...style}}>
      <table className="w-100">
        <tbody>
          <tr className="zb-b-b">
            <th className="border-0 p0 pl10">
              <div className="col fs12 color-black-3 text-left lh25 font-weight-normal">
                {intl.get('global.price')} {tokenR}
              </div>
            </th>
            <th className="border-0 p0 pl5 pr5">
              <div className="col-auto fs12 color-black-3 text-center lh25 font-weight-normal">
                {intl.get('global.amount_label')} {tokenL}
              </div>
            </th>
            <th className="border-0 p0 pr10">
              <div className="col-auto fs12 color-black-3 text-right lh25 font-weight-normal">
                {intl.get('global.time')}
              </div>
            </th>
          </tr>
          {
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map((item,index)=>
              <tr key={index} className="cursor-pointer">
                <td className="border-0 pl0 pl10">
                 <div className="fs12 color-green-500 text-left lh20 p0">
                   0.00118642
                 </div>
                </td>
                <td className="border-0 pl5 pr5">
                  <div className="fs12 color-black-2 text-center lh20 p0" >
                    10
                  </div>
                </td>
                <td className="border-0 pr10">
                  <div className="fs12 color-black-2 text-right lh20 p0">
                    21:23:55
                  </div>
                </td>
              </tr>
            )
          }
          {
            false && items.length == 0 &&
            <tr >
              <td colSpan="10" className="fs12 border-0 text-center color-black-3 lh20 pt10 pb10">{intl.get('global.no_data')}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  )
}

export default ListBlock
