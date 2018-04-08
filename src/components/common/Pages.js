import React, { PropTypes } from 'react';

class Pages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active:this.props.active
    }
  }
  gotoPage(payload){
    this.setState({
      active:payload.id,
      [payload.id]:{
        ...this.state[payload.id],
        ...payload,
      }
    })
  }
  loadingChange(payload){
    this.setState({
      [payload.id]:{
        ...this.state[payload.id],
        ...payload,
      }
    })
  }
  render() {
    let props = this.props;
    return (
       <div>
         {
           React.Children.map(this.props.children, child => {
              if(child && child.props.id){
                const id = child.props.id
                let page = this.state[id] || {}
                let className = child.props.className || ''
                className += ' animated'
                className = className.replace('d-block','')
                className = className.replace('d-none','')
                let style = {}
                if(this.state.active === id){
                  className += " d-block"
                }else{
                  className += " d-none"
                }
                if(page.transition){
                  className += ` ${page.transition}`
                }else{
                  className += ` fadeIn`
                }
                const childProps = {
                  className,
                  page:{
                    ...page,
                    gotoPage:this.gotoPage.bind(this),
                    loadingChange:this.loadingChange.bind(this),
                  }
                }
                return React.cloneElement(child, {...childProps})
              }else{
                return null
              }
           })
         }
       </div>
    );
  }
}
const Page = (props)=>{
  const {style,className,visible,transition,render,id,loadingChange,children,...rest} = props;
  const showLoading = ()=>{
    loadingChange({
      id,
      loading:true,
    })
  }
  const hideLoading = ()=>{
    loadingChange({
      id,
      loading:false,
    })
  }

  const childProps ={
    ...rest,
    showLoading:showLoading.bind(this),
    hideLoading:hideLoading.bind(this),
  }
  if(typeof render === 'function'){
    return (
      <div className={className} style={style}>
        {render.call(this,{...childProps})}
      </div>
    )
  }
  return (
    <div className={className} style={style}>
      {
        React.Children.map(props.children, child => {
           return React.cloneElement(child, {...childProps})
        })
      }
    </div>
  )
}
export { Page }
export { Pages }
export default Pages
