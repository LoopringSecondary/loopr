import React, { PropTypes } from 'react';
import { Select} from 'antd';
let Option = Select.Option;

class SelectContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options:[],
      loading:false,
      loaded:false
    }
  }
  componentDidMount() {
    this.loadOptions();
  }
  loadOptions(){
    this.setState({
      loading:true
    })
    let transform = this.props.transform;
    this.props.loadOptions()
    .then(transform)
    .then(options=>{
      this.setState({
        options,
        loading:false,
        loaded:true,
      })
    })
  }
  render() {
    let props = this.props;
    let { options,loading,loaded,required } = this.state;
    let selectProps = {
      notFoundContent:"无选项",
      allowClear:true,
      showArrow:true,
      showSearch:true,
      filterOption:false,
      defaultActiveFirstOption:false,
      ...this.props,
    }
    return (
       <Select {...selectProps}>
        {
          options.map((option,index)=>{
            return (<Option key={index} value={option.value.toString()}>{option.label}</Option>);
          })
        }
       </Select>
    );
  }
}

export default SelectContainer;
