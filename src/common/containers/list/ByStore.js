import React from 'react';

/**
 * props
 * actions: redux actions
 * data-items:  request参数TODO
 * 
 * state
 * item: data
 * loading: data
 * loaded: data
 * 
 */

class ListAsync extends React.Component {
  constructor(props) {
    super(props); 
  }
  componentDidMount() {
    this.init();
  }
  init(){
    const { actions,filters,page,sort,originQuery,defaultState } = this.props;
    actions.fetch({filters,page,sort,originQuery,defaultState});
  }
  render() {
    let { actions,LIST,dispatch} = this.props;
    let childProps = {actions,LIST};
    return (
       <div>
        <div hidden>Async Layer</div>
          {
            React.Children.map(this.props.children, child => {
                return React.cloneElement(child, {...childProps})
            })
          }
       </div>
    );
  }
}

export default ListAsync;