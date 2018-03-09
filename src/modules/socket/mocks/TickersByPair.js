import React from 'react'
import PropTypes from 'prop-types';
import tikcers from './TickersByPair.json'
class TickerByPair extends React.Component {
  render() {
    const tickersByPair = tikcers
    const {children,...rest} = this.props
    const childProps = {
      ...rest,
      tickersByPair
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
export default TickerByPair
