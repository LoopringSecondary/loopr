import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table,Badge,Button,List,Modal,Avatar,Icon,Switch,Tooltip,Input,Menu,Popover,Checkbox } from 'antd';
import schema from '../../../../modules/tokens/schema';
import { tokens } from '../../../../common/config/data';
import {configs} from '../../../../common/config/data'
import './ListSidebar.less'
import Token from '../../../../common/Loopring/ethereum/token'
import {getTransactionCount} from '../../../../common/Loopring/ethereum/utils'
import {BigNumber} from 'bignumber.js'

function ListSidebar({LIST,actions,dispatch}) {
  const {
      items=[],
      selected={},
      loading,
      filters={},
      page={}
  } = LIST
  //TODO load from store
  const selectedGasPrice = 30
  const selectedGasLimit = 21000
  const address = "0x4919776519F2B290E0E98AA8d9f5751b5321876C"
  const privateKey ="93d2d40c13f4d4ca422c154dac7db78f8b0964ad8aa9047c9eb5dfa750357c4e"
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
  const toggleApprove = (token, checked)=>{
    // there is no event in arguments
    console.log(token)
    console.log(checked)
    const gasPrice = '0x' + (Number(selectedGasPrice) * 1e9).toString(16)
    const gasLimit = '0x' + Number(selectedGasLimit).toString(16);
    const chainId = configs.chainId | 1
    if(checked) {
      enableToken(token,gasPrice,gasLimit,chainId)
    } else {
      Modal.confirm({
        title: 'Attention',
        content: 'You are disabling '+token.symbol,
        onOk:()=>{
          disableToken(token,gasPrice,gasLimit,chainId)
        },
        onCancel:()=>{},
        okText:'Yes, Disable it',
        cancelText:'No',
      })
    }
  }
  const enableToken = (token,gasPrice,gasLimit,chainId) => {
    const tokenConfig = window.CONFIG.getTokenBySymbol(token.symbol)
    const setAllowance = '0x'+(new BigNumber('9223372036854775806').times('1e'+tokenConfig.digits).toString(16));
    const api = new Token({address:tokenConfig.address})
    let latestNonce = ''
    actions.updateItem({item:{
      symbol:token.symbol,
      loading:true,
      checked:true
    }})
    getTransactionCount(address).then(nonce=>{
      console.log(nonce)
      //TODO mock data
      token.allowance = 1
      if(nonce.result){
        if(Number(token.allowance) > 0){
          latestNonce = "0x"+(Number(nonce.result)+1).toString(16)
          return api.approve(configs.delegateAddress, "0x0", privateKey, gasPrice, gasLimit, nonce.result, chainId)
        } else {
          latestNonce = nonce.result
          return {result:true}
        }
      }
    }).then(disable => {
      console.log(disable)
      if(disable.result){
        return api.approve(configs.delegateAddress, setAllowance, privateKey, gasPrice, gasLimit, latestNonce, chainId)
      } else {
        throw new Error('Failed to call ethereum API, please try later')
      }
    }).then(enable=>{
      console.log(enable)
      if(enable.reslut){
        actions.updateItem({item:{
          symbol:token.symbol,
          loading:false,
          checked:true
        }})
      } else {
        throw new Error('Failed to call ethereum API, please try later')
      }
    }).catch(e=>{
      console.error(e)
      actions.updateItem({item:{
        symbol:token.symbol,
        loading:false,
        checked:false
      }})
    })
  }
  const disableToken = (token,gasPrice,gasLimit,chainId) => {
    const tokenConfig = window.CONFIG.getTokenBySymbol(token.symbol)
    const api = new Token({address:tokenConfig.address})
    //TODO mock data
    token.allowance = 1
    actions.updateItem({item:{
      symbol:token.symbol,
      loading:true,
      checked:false
    }})
    if(Number(token.allowance) > 0){
      getTransactionCount(address).then(nonce=>{
        if(nonce.result){
          return api.approve(configs.delegateAddress, "0x0", privateKey, gasPrice, gasLimit, nonce.result, chainId)
        } else {
          throw new Error('Failed to call ethereum API, please try later')
        }
      }).then(disable => {
        if(!disable.result){
          throw new Error('Failed to call ethereum API, please try later')
        }
        actions.updateItem({item:{
          symbol:token.symbol,
          loading:false,
          checked:false
        }})
      }).catch(e=>{
        console.error(e)
        actions.updateItem({item:{
          symbol:token.symbol,
          loading:false,
          checked:true
        }})
      })
    } else {
      actions.updateItem({item:{
        symbol:token.symbol,
        loading:false,
        checked:false
      }})
    }
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
    updateTransations(item.symbol)
  }
  const updateTransations = (token)=>{
    dispatch({
      type:'transactions/filtersChange',
      payload:{
        filters:{token}
      }
    })
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
        {
          token.custom &&
          <div className="col-12 p5">
            <Button onClick={gotoEdit.bind(this,token)} className="" type="primary" icon="edit">Edit</Button>
          </div>
        }
        {
          (token.symbol === 'ETH' || token.symbol === 'WETH') &&
          <div className="col-12 p5">
            <Button onClick={gotoConvert.bind(this,token)} className="" type="primary" icon="retweet">Wrap</Button>
          </div>
        }
        {
          (token.symbol != 'ETH' && token.symbol != 'WETH') &&
          <div className="col-12 p5">
            <Button onClick={gotoTrade.bind(this,token)} className="" type="primary">
              <i className="fa fa-line-chart mr5"></i>Trade
            </Button>
          </div>
        }
      </div>
    </div>
  )
  const TokenItem = ({item,index})=>{
    //TODO mock datas, should calculate with configuration
    if(Number(item.allowance) >= 10) {
      item.checked = true
    }
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
              <Tooltip title={item.checked ? `Disable` : `Enable`} >
                <div onClick={(e)=>{e.stopPropagation();e.preventDefault()}}>
                  <Switch onChange={toggleApprove.bind(this,item)} size="small" checkedChildren="" unCheckedChildren="" defaultChecked={item.checked} loading={item.loading} />
                </div>
              </Tooltip>
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

