import React from 'react';
import {Button,Icon} from 'antd'

export default function Footer(props){
  const socials = [
    {icon:'github',href:''}, 
    {icon:'wechat',href:''}, 
    {icon:'twitter',href:''}, 
    {icon:'envelope',href:''}, 
    {icon:'reddit',href:''}, 
    {icon:'medium',href:''}, 
    {icon:'facebook',href:''}, 
    {icon:'telegram',href:''}, 
    {icon:'youtube',href:''}, 
  ]
  const links = [
    {
      title:'FOUNDATION & COMMUNITY',
      sub:[
        {title:'Loopring Foundation',href:''},
        {title:'Knowledge Base',href:''},
      ]
    },
    {
      title:'LOOPRING PROTOCOL',
      sub:[
        {title:'Whitepaper',href:''},
        {title:'Ethereum Smart Contracts',href:''},
        {title:'Github Repositories',href:''},
        {title:'Protocol Audit Report',href:''},
      ]
    },
    {
      title:'WALLET & DEX',
      sub:[
        {title:'Disclaimer',href:''},
        {title:'Feedback',href:''},
        {title:'Github Repositories',href:''},
        {title:'Protocol & Tokens',href:''},
      ]
    },
  ]
  const MarkItem = (props)=>{
    return (
      <div className="p15 text-left" style={{background:'#0077FF'}}>
        <div className="fs16">
          <span className="color-white mr5">LRC/ETH</span>
          <span className="color-green-400">
            <Icon type="arrow-up" />10.5%
          </span>
        </div>
        <div className="fs20">
          <span className="color-white mr5">0.003</span>
          <span className="color-white">ETH</span>
        </div>

      </div>
    )
  }
  return (

    <div className="bg-white">
      <div className="row no-gutters">
        {
         Array(6).fill(1).map((item,index)=>
           <div className="col">
             <MarkItem key={index} item={item} />
           </div>
         )
        }
      </div>
      <div className="container mt50">
        <div className="row justify-content-center">
          {
            socials.map((social,index)=>
              <div className="col-auto p20" key={index}>
                <i className={`fa fa-${social.icon} fs32 color-grey-900`}></i>
              </div>
            ) 
          }
        </div>
        <hr />
        <div className="row justify-content-between">
          {
            links.map((link,index)=>
              <div className="col-auto p20" key={index}>
                  <div className="fs16 lh30 color-grey-900">{link.title}</div>
                  <div className="">
                    {
                      link.sub.map((item,index)=>
                        <a key={index} href="" className="fs14 lh20 d-block color-grey-800">{item.title}</a>
                      )
                    }
                  </div>
              </div>
            )  
          }
        </div>
        <div className="fs12 text-center p20 ">
          Loopring Project Ltd.(Loopring Foundation), All Right Reserved.
        </div>
      </div>
    </div>
    
    
  )
}