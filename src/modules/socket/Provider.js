import React from 'react'
import PropTypes from 'prop-types';
import io from 'socket.io-client'

class SocketProvider extends React.Component {
  getChildContext() {
    return { socket: this.socket }
  }
  connect(url){
    const socket = io(url)
    return new Promise((resolve)=>{
      socket.on('connect',()=>{
        console.log('socket connect success!')
        resolve(socket)
      })
    })
  }
  constructor(props, context) {
    super(props, context)
    let options = {
      transports: ['websocket']
    }
    this.socket = io(props.url,options)
    this.socket.on('connect', (data) => {
      console.log('socket connected success!')
    })
    options = {
      "contractVersion" : "v1.0",
      "market":"RDN-WETH",
    }
    this.socket.emit('tickers_req',JSON.stringify(options))

    options = {
      "contractVersion" : "v1.0",
      "owner":"0x750ad4351bb728cec7d639a9511f9d6488f1e259",
    }
    this.socket.emit('balance_req',JSON.stringify(options))

    options = {
      "currency" : "CNY"
    }
    // this.socket.emit('marketcap_req',JSON.stringify(options))

    this.socket.on('disconnect', (data) => {
      console.log('socket disconnect')
    });
    this.socket.on('error', (err) => {
      console.log('socket error',err)
    });
  }
  render() {
    return React.Children.only(this.props.children)
  }
}

SocketProvider.childContextTypes = {
  socket: PropTypes.object
}
export default SocketProvider
