import React from 'react'
import PropTypes from 'prop-types'
import balancesData from './balances.json'

class AssetsSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      assets:[],
      asset:{},
    }
  }
  getTokenBySymbol(tokens){
    const { symbol } = this.props
    let asset = {}
    if(symbol){
      asset = tokens.find(token=>token.symbol === symbol)
    }
    return asset
  }
  componentDidMount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    socket.on('balance_res', (res)=>{
      console.log('balance_res')
      res = JSON.parse(res)
      const asset = this.getTokenBySymbol(res.tokens)
      this.setState({
        assets:res.tokens,
        asset,
      })
    })
  }
  componentWillUnmount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    console.log('balance unmount')
    // socket.emit('balance_end')
    socket.off('balance_res')
  }
  render() {
    const childProps = {
     ...this.props,
     ...this.state,
     // assets:balancesData, // for mock data
     // asset:this.getTokenBySymbol(balancesData) // for mock data
    }
    const {render} = this.props
    if(render){
      return render.call(this,childProps)
    }
    return (
      <div>
        {
          React.Children.map(this.props.children, child => {
              return React.cloneElement(child, {...childProps})
          })
        }
      </div>
    )

  }
}
AssetsSocketContainer.contextTypes = {
  socket: PropTypes.object.isRequired
};
export default AssetsSocketContainer
