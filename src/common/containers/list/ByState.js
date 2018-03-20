import React from 'react';

/**
 * props
 * actions: API actions
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
    this.state = {
      items:[],
      loading:false,
      loaded:false,
      filters:{},
      sort:{},
      page:{},
    }
  }
  componentDidMount() {
    this.loadItems();
  }
  init(){
    this.loadItems();
  }
  loadItems(){
    let { actions } = this.props;
    // let { filters,page,sort } = this.state;
    this.setState({
      loading:true
    })
    // let payload = { filters, page, sort,}
    if(typeof actions.loadItems === 'function'){
      actions.loadItems().then(res=>{
        this.setState({
          items:res.data.items,
          loading:false,
          loaded:true,
        })
      })
    }else{
      console.error('action.loadItems should be a function')
    }
  }
  render() {
    let { items,loading,loaded } = this.state;
    let { render } = this.props;
    let childProps = {
      ...this.state,
    }
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

export default ListAsync;
