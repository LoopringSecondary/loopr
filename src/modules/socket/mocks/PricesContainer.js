import React from 'react'
import PropTypes from 'prop-types';
import prices from './prices.json'
class PricesContainer extends React.Component {
  render() {
    const {children,...rest} = this.props
    const childProps = {
      ...rest,
      prices,
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
export default PricesContainer
