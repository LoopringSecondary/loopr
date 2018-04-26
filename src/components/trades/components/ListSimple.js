import React from 'react';
import intl from 'react-intl-universal';
const uiFormatter = window.uiFormatter
const fm = window.uiFormatter.TokenFormatter

function ListBlock(props) {
  const {className, style,items=[],market=""} = props;
  const tokenL = market.split('-')[0].toUpperCase()
  const tokenR = market.split('-')[1].toUpperCase()
  const ListHeader = ({})=>{
    return (
      <div className="row pb5 pt5 gutter-0 zb-b-b">
        <div className="col fs12 color-black-3 text-left">
          {intl.get('global.price')}{false && tokenR}
        </div>
        <div className="col-auto fs12 color-black-3 text-center" style={{width:'80px'}}>
          {intl.get('global.amount_label')}{false && tokenL}
        </div>
        <div className="col-auto fs12 color-black-3 text-center" style={{width:'80px'}}>
          {intl.get('global.time')}
        </div>
      </div>
    )
  }
  const ListItem = ({item})=>{
    return (
      <div className="row lh20 gutter-0">
        <div className="col fs12 color-green-500 text-left">
          0.00118642
        </div>
        <div className="col-auto fs12 color-black-2 text-center" style={{width:'80px'}}>
          10
        </div>
        <div className="col-auto fs12 color-black-2 text-center" style={{width:'80px'}}>
          21:23:55
        </div>
      </div>
    )
  }
  return (
    <div className={className} style={{...style}}>
      {
        false && <ListHeader/>
      }
      {
        false &&
        <div style={{maxHeight:'375px',overflow:'auto'}}>
          {
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map((item,index)=><ListItem key={index} item={item} />)
          }
        </div>
      }
      <table className="w-100">
        <tbody>
          <tr className="zb-b-b">
            <th className="border-0 pl5">
              <div className="col fs12 color-black-3 text-left lh20 font-weight-normal">
                {intl.get('global.price')}{false && tokenR}
              </div>
            </th>
            <th className="border-0 pl5">
              <div className="col-auto fs12 color-black-3 text-center lh20 font-weight-normal">
                {intl.get('global.amount_label')}{false && tokenL}
              </div>
            </th>
            <th className="border-0 pl5 pr5">
              <div className="col-auto fs12 color-black-3 text-center lh20 font-weight-normal">
                {intl.get('global.time')}
              </div>
            </th>
          </tr>
          {
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map((item,index)=>
              <tr key={index} className="cursor-pointer">
                <td className="border-0 pl5 pr5">
                 <div className="fs12 color-green-500 text-left lh20">
                   0.00118642
                 </div>
                </td>
                <td className="border-0 pl5 pr5">
                  <div className="fs12 color-black-2 text-center lh20" >
                    10
                  </div>
                </td>
                <td className="border-0 pl5 pr5">
                  <div className="fs12 color-black-2 text-center lh20">
                    21:23:55
                  </div>
                </td>
              </tr>
            )
          }
          {
            items.length == 0 &&
            <tr >
              <td colSpan="10" className="fs12 border-0 text-center color-black-3">{intl.get('global.no_data')}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  )
}

export default ListBlock
