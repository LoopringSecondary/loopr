import React from 'react'
import PropTypes from 'prop-types';
import tikcers from './TickersByLoopring.json'
class TickersByLoopring extends React.Component {
  render() {
    const tickersByLoopring = tikcers
    const {children,...rest} = this.props
    const childProps = {
      ...rest,
      tickersByLoopring,
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
export default TickersByLoopring
