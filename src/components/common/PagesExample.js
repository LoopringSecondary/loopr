import React, { PropTypes } from 'react';
import { Button } from 'antd';
import { Pages,Page } from 'Loopr/Pages';

const Example = ()=>{
  const Content1 = ({page})=>{
    return <div>
      Content 1
      <Button onClick={page.gotoPage.bind(this,{id:'2'})} className="m15" type="" size="small">Go To 2</Button>
    </div>
  }
  const Content2 = ({page})=>{
    return <div>
      Content 2
      <Button onClick={page.gotoPage.bind(this,{id:'3'})} className="m15" type="" size="small">Go To 3</Button>
    </div>
  }
  const Content3 = ({page})=>{
    return <div>
      Content 3
      <Button onClick={page.gotoPage.bind(this,{id:'1'})} className="m15" type="" size="small">Go To 1</Button>
    </div>
  }
  return (
    <div>
      <Pages active="1">
        <Page id="1" render={({page})=>{
          return (
            <div className="fs14">
              First Page
              <Button onClick={page.gotoPage.bind(this,{id:'2'})} className="m15" type="" size="small">Go To 2</Button>
            </div>
          )
        }} />
        <Page id="2" render={({page})=>{
          return (
            <div className="fs14">
              Second Page
              <Button onClick={page.gotoPage.bind(this,{id:'3'})} className="m15" type="" size="small">Go To 3</Button>
            </div>
          )
        }} />
        <Page id="3" render={({page})=>{
          return (
            <div className="fs14">
              Third Page
              <Button onClick={page.gotoPage.bind(this,{id:'1'})} className="m15" type="" size="small">Go To 1</Button>
            </div>
          )
        }} />
      </Pages>
      <Pages active="1">
        <Page id="1">
          <Content1 />
        </Page>
        <Page id="2">
          <Content2 />
        </Page>
        <Page id="3">
          <Content3 />
        </Page>
      </Pages>
    </div>


  )
}

export default Example

