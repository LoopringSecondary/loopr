import React from 'react';
import { Avatar,Icon,Button } from 'antd';

let Preview = ({
  form,
  modal,
  }) => {
  return (
      <div>
        <div className="row flex-nowrap zb-b-b pb30">
          <div className="col-auto">
            <div className="text-center">
              <Avatar size="large" className="bg-blue-500" src="">U</Avatar>
              <div className="fs12 color-grey-500 text-wrap" style={{maxWidth:'180px'}}>0xebA7136A36DA0F5e16c6bDBC739c716Bb5B65a00</div>
            </div>
          </div>
          <div className="col">
            <div className="text-center">
              <Avatar size="" className="bg-white border-grey-900" src="https://loopring.io/images/favicon.ico"></Avatar>
              <div className="fs12 color-grey-500">LRC</div>
              <div className="fs12  ">
                <div className="row no-gutters align-items-center">
                  <div className="col">
                    <hr className="w-100 bg-grey-900"/>
                  </div>
                  <div className="col-auto">
                    <Icon type="right" className="color-grey-900" style={{marginLeft:'-9px'}}></Icon>
                  </div>
                </div>
              </div>
              <div className="fs14 color-grey-900">-2000LRC($4000)</div>
            </div>
          </div>
          <div className="col-auto">
            <div className="text-center">
              <Avatar size="large" className="bg-blue-500" src="">U</Avatar>
              <div className="fs12 color-grey-500 text-wrap" style={{maxWidth:'180px'}}>0xebA7136A36DA0F5e16c6bDBC739c716Bb5B65a00</div>
            </div>
          </div>
        </div>
        <div className="row pt10 pb10 zb-b-b">
          <div className="col">
            <div className="fs14 color-grey-600">To</div>
          </div>
          <div className="col-auto">
            <div className="fs14 color-grey-900">0xebA7136A36DA0F5e16c6bDBC739c716Bb5B65a00</div>
          </div>
        </div>
        <div className="row pt10 pb10 zb-b-b">
          <div className="col">
            <div className="fs14 color-grey-600">From</div>
          </div>
          <div className="col-auto">
            <div className="fs14 color-grey-900">0xebA7136A36DA0F5e16c6bDBC739c716Bb5B65a00</div>
          </div>
        </div>
        <div className="row pt10 pb10 zb-b-b">
          <div className="col">
            <div className="fs14 color-grey-600">GasLimit</div>
          </div>
          <div className="col-auto">
            <div className="fs14 color-grey-900">2100</div>
          </div>
        </div>
        <div className="row pt10 pb10 zb-b-b">
          <div className="col">
            <div className="fs14 color-grey-600">GasPrice</div>
          </div>
          <div className="col-auto">
            <div className="fs14 color-grey-900">21 Gwei ( 0.000012 LRC )</div>
          </div>
        </div>
        <div className="row pt10 pb10 zb-b-b">
          <div className="col">
            <div className="fs14 color-grey-600">Max Tx Fee</div>
          </div>
          <div className="col-auto">
            <div className="fs14 color-grey-900">12 LRC ( 420000 Gwei )</div>
          </div>
        </div>
        <div className="row pt40">
          <div className="col pl0">
            <Button className="d-block w-100" type="" size="large">No, Cancel It</Button>
          </div>
          <div className="col pr0">
            <Button className="d-block w-100" type="primary" size="large">Yes, Send Now</Button>
          </div>
        </div>
      </div>
  );
};


export default Preview;

 
