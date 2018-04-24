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
  shouldComponentUpdate(nextProps){
    if(nextProps.filters !== this.props.filters){
      this.init()
    }
    return true
  }
  componentDidMount() {
    this.init();
  }
  init(){
    const { actions,filters,page,sort,originQuery,defaultState,id } = this.props;
    actions.fetch({filters,page,sort,originQuery,defaultState,id});
  }
  render() {
    let { actions,LIST,dispatch,filters,id} = this.props;
    // console.log('async container',filters)
    if(LIST.filters && filters){
      LIST.filters={
        ...LIST.fitlers,
        ...filters
      }
    }
    let childProps = {actions,LIST,dispatch,id};

    return (
       <div>
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
