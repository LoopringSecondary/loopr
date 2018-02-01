import React, { Component, PropTypes } from 'react'

export default class Socket {
  constructor(socket) {
    this.socket = socket
  }
  // functions
  getTicker(msg){
    this.socket.emit('getTicker',{msg: msg});
  }
  getRatio(msg){
    this.socket.emit('getRatio',{msg: msg});
  }
  // events
  onFetchTicker(cb){
    this.socket.on('receiveTicker', cb);
  }
  onFetchRatio(cb){
    this.socket.on('receiveRatio', cb);
  }
}
