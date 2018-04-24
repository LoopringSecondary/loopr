import React from 'react'
import PropTypes from 'prop-types';
import assets from './assets.json'
class AssetsContainer extends React.Component {
  render() {
    const {children,...rest} = this.props
    const childProps = {
      ...rest,
      assets,
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
export default AssetsContainer
