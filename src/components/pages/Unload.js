import React from 'react';
import { Modal } from 'antd'

export default function Unload(props){
  // window.onbeforeunload = function (event){
  //   if(event.clientX>document.body.clientWidth && event.clientY < 0 || event.altKey){
  //        Modal.confirm({
  //           title: 'Do you Want to close Loopr ?',
  //           content: 'Some descriptions',
  //           onOk() {
  //             window.close()
  //           },
  //           onCancel() {
  //           },
  //        })
  //   }else{
  //       Modal.confirm({
  //          title: 'Do you Want to Refresh Loopr ?',
  //          content: 'Some descriptions',
  //          onOk() {
  //            window.location.reload()
  //          },
  //          onCancel() {
  //          },
  //       }) 
  //   }
  // }
  window.onbeforeunload = function (e){
    alert("before close & refresh")
  }
  window.onunload=function(e){
    alert("离开")
  }
  return <div></div>

}
