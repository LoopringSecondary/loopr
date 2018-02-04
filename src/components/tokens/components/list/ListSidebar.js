import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table,Badge,Button,List,Avatar,Icon,Switch,Tooltip,Input,Menu,Popover,Checkbox } from 'antd';
import schema from '../../../../modules/tokens/schema';
import { tokens } from '../../../../common/config/data';
import './ListSidebar.less'

function ListSidebar({LIST,actions,dispatch}) {
  const {
      items=[],
      selected={},
      loading,
      filters={},
      page={}
  } = LIST
  const showModal = (payload)=>{
    dispatch({
      type:'modals/modalChange',
      payload:{
        ...payload,
        visible:true,
      }
    })
  }
  const gotoTransfer = (item,e)=>{
    e.stopPropagation()
    showModal({
      id:'token/transfer',
      item,
    })
  }
  const gotoReceive = (item,e)=>{
    e.stopPropagation()
    showModal({
      id:'token/receive',
      item,
    })
  }
  const gotoConvert = (item)=>{
    showModal({
      id:'token/convert',
      item,
    })
  }
  const gotoTrade = (item)=>{
    window.routeActions.gotoPath('/trade')
  }
  const gotoEdit = (item)=>{
    showModal({
      id:'token/edit',
      item,
    })
  }
  const gotoAdd = ()=>{
    showModal({
      id:'token/add',
    })
  }
  const toggleApprove = (checked)=>{
    // there is no event in arguments
    setTimeout(()=>{
      // TODO
    }, 3000)
  }
  const toggleMyFavorite = ()=>{
    actions.filtersChange({filters:{
      ...filters,
      ifOnlyShowMyFavorite: !filters.ifOnlyShowMyFavorite
    }})
  }
  const toggleSmallBalance = ()=>{
    actions.filtersChange({filters:{
      ...filters,
      ifHideSmallBalance: !filters.ifHideSmallBalance
    }})
  }
  const searchToken = (e)=>{
    actions.filtersChange({filters:{
      ...filters,
      keywords: e.target.value
    }})
  }
  const toggleFavored = (item,e)=>{
    e.stopPropagation()
    actions.updateItem({item:{
      symbol:item.symbol,
      isFavored:!item.isFavored,
    }})
  }
  const toggleSelected = (item)=>{
    let new_selected = {}
    for(let key in selected){
      new_selected[key]=false
    }
    actions.selectedChange({selected:{
      ...new_selected,
      [item.symbol]:true,
    }})
  }
  const TokenListAcionsBar = (
    <div className="row zb-b-b p15 pl10 pr10 no-gutters">
      <div className="col mr5">
        <Input
          placeholder=""
          prefix={<Icon type="search" className="color-grey-600"/>}
          className="d-block w-100"
          onChange={searchToken.bind(this)}
        />
      </div>
      <div className="col-auto mr5">
        <Tooltip title="Only Show My Favorites">
          {
            filters.ifOnlyShowMyFavorite &&
            <Button onClick={toggleMyFavorite.bind(this)} className="color-white border-blue-600 bg-blue-600" icon="star-o" shape="circle"></Button>
          }
          {
            !filters.ifOnlyShowMyFavorite &&
            <Button onClick={toggleMyFavorite.bind(this)} className="color-grey-600" icon="star-o" shape="circle"></Button>
          }

        </Tooltip>
      </div>
      <div className="col-auto mr5">
        <Tooltip title="Hide 0 Balances">
          {
            filters.ifHideSmallBalance &&
            <Button onClick={toggleSmallBalance.bind(this)} className="color-white border-blue-600 bg-blue-600" icon="eye-o" shape="circle"></Button>
          }
          {
            !filters.ifHideSmallBalance &&
            <Button onClick={toggleSmallBalance.bind(this)} className="color-grey-600" icon="eye-o" shape="circle"></Button>
          }
        </Tooltip>
      </div>
      <div className="col-auto">
        <Tooltip title="Add Custom Token">
          <Button onClick={gotoAdd.bind(this)} className="color-grey-600" icon="plus" shape="circle"></Button>
        </Tooltip>
      </div>
      
      <div className="col-auto" hidden>
        <Tooltip title="">
          <Popover
            title="Sort"
            placement="bottom"
            arrowPointAtCenter
            content={
              <div>
                <div className="fs12 pb10 zb-b-b">Sort By Name</div>
                <div className="fs12 pt10 pb10 zb-b-b">Sort By Balance</div>
                <div className="fs12 pt10 ">Sort By Amount</div>
              </div>
            }
          >
            <Button className="color-grey-600" shape="circle">
              <i className="fa fa-sort"></i>
            </Button>
          </Popover>
        </Tooltip>
      </div>
    </div>
  )
  const TokenItemActions = (token)=>(
    <div style={{width:'120px'}}>
      <div className="row no-gutters">
        <div className="col-12 p5">
          <Button onClick={gotoTransfer.bind(this,token)} className="" type="primary" icon="pay-circle-o">Transfer</Button>
        </div>
        <div className="col-12 p5">
          <Button onClick={gotoReceive.bind(this,token)} className="" type="primary" icon="qrcode">Receive</Button>
        </div>
        <div className="col-12 p5">
          <Button onClick={gotoEdit.bind(this,token)} className="" type="primary" icon="edit">Edit</Button>
        </div>
        {
          token.symbol === 'ETH' &&
          <div className="col-12 p5">
            <Button onClick={gotoConvert.bind(this,token)} className="" type="primary" icon="retweet">Wrap</Button>
          </div>
        }
        <div className="col-12 p5">
          <Button onClick={gotoTrade.bind(this,token)} className="" type="primary">
            <i className="fa fa-line-chart mr5"></i>Trade
          </Button>
        </div>
      </div>
    </div>
  )
  const TokenItem = ({item,index})=>{
    return (
      <div style={{borderBottom:'1px solid rgba(0,0,0,0.05)'}} onClick={toggleSelected.bind(this,item)} className={`cursor-pointer token-item-sidebar ${selected[item.symbol] && 'token-item-sidebar-dark'}`}>
        <div className={`row align-items-center no-gutters p10`} >
          <div className="col-auto pr10">
            {
              item.isFavored && 
              <Icon type="star" className="color-yellow-700" onClick={toggleFavored.bind(this,item)} />
            }
            {
              !item.isFavored && 
              <Icon type="star" className="color-grey-300" onClick={toggleFavored.bind(this,item)} />
            }
          </div>
          <div className="col-auto pr10">
            <Avatar src={item.logo} size="" className="bg-white border border-grey-300 p5" />
          </div>
          <div className="col pr10">
            <div className="">
              <span className="fs18 color-grey-900">{item.symbol}</span>
              <span className="fs12 ml5 color-grey-400 align-middle text-truncate text-nowrap d-inline-block" style={{width:'55px'}}>{item.title}</span>
            </div>
            <div className="">
              <span className="fs14 color-grey-900">{item.balance}</span>
              <span className="fs12 ml5 color-grey-400">$ {item.balance}</span>
            </div>
          </div>
          {
            item.symbol != 'ETH' &&
            <div className="col-auto mr5">
                {
                  item.allowance > item.balance &&
                  <Tooltip title={`Disable ${item.symbol}`} >
                    <div onClick={(e)=>{e.stopPropagation();e.preventDefault()}}>
                      <Switch onChange={toggleApprove.bind(this,item)} size="small" checkedChildren="" unCheckedChildren="" defaultChecked={index<=4} loading={index == 4 || index == 5} />
                    </div>
                  </Tooltip>
                }
                {
                  item.allowance <= item.balance &&
                  <Tooltip title={`Enable ${item.symbol}`} >
                    <div onClick={(e)=>{e.stopPropagation();e.preventDefault()}}>
                      <Switch onChange={toggleApprove.bind(this,item)} size="small" checkedChildren="" unCheckedChildren="" defaultChecked={index<=4} loading={index == 4 || index == 5} />
                    </div>
                  </Tooltip>
                }
            </div>
          }
          <div className="col-auto pr5">
            <Tooltip title="Send/Transfer" >
              <Button onClick={gotoTransfer.bind(this,item)} shape="circle" className="bg-none color-grey-500 border-grey-400">
                <Icon type="retweet" />
              </Button>
            </Tooltip>
          </div>
          <div className="col-auto pr5">
            <Tooltip title="Receive" >
              <Button onClick={gotoReceive.bind(this,item)} shape="circle" className="bg-none color-grey-500 border-grey-400">
                <Icon type="qrcode" />
              </Button>
            </Tooltip>
          </div>
          <div className="col-auto" onClick={(e)=>{e.stopPropagation();e.preventDefault()}}>
            <Popover
              title="Actions"
              placement="right"
              arrowPointAtCenter
              content={TokenItemActions(item)}
            >
              <Button shape="circle" className="bg-none color-grey-500 border-grey-400">
                <Icon type="ellipsis" />
              </Button>
            </Popover>
          </div>
        </div>
        
      </div>
    )
  }

  let results = [...items]
  let keys = Object.keys(filters)
  keys.map(key=>{
    const value = filters[key]
    if(key==='ifOnlyShowMyFavorite'){
      if(value){
        results = results.filter(token=> !!token.isFavored == !!value)
      }
    }
    if(key==='ifHideSmallBalance'){
      if(value){
        results = results.filter(token=>Number(token['balance']) > 0) 
      }
    }
    if(key==='keywords'){
      results = results.filter(token=>{
        let text = (token.symbol + token.title).toLowerCase()
        return text.indexOf(value.toLowerCase()) > -1
      })
    }
  })
  
  return (
    <div className="">
      {TokenListAcionsBar}
      <div className="token-list-sidebar">
        {
          results.map((item,index)=><TokenItem key={index} index={index} item={item} />)
        }
      </div>
      
    </div>
  )
}

export default connect()(ListSidebar)

