import React from 'react';
import { Form,Button,Icon,Card,Modal,Input,Radio,Select,DatePicker} from 'antd';
import intl from 'react-intl-universal'

let FiltersForm = ({
  LIST,
  actions,
  form,
  style={},
  }) => {
  const {filters} = LIST
  const {token} = filters;
  function handleSubmit() {
    form.validateFields((err,values) => {
      console.log('values',values)
      if(!err){
        // TODO
        actions.filtersChange({
          filters:values
        })
      }
    })
  }
  function handleChange() {
    setTimeout(handleSubmit, 0)
  }
  function handleCancle() {
  }
  let types = [
    {label:intl.get(`global.all`)+ ' ' +intl.get('txs.type'),value:''},
    {label:intl.get(`txs.type_sell`),value:'sell'},
    {label:intl.get(`txs.type_buy`),value:'buy'},
    {label:intl.get(`txs.type_transfer`),value:'send'},
    {label:intl.get(`txs.type_receive`),value:'receive'},
    {label:intl.get(`txs.type_enable`),value:'approve'},
  ]
  let convertTypes = [{label:intl.get(`txs.type_convert`),value:'convert'}]
  let lrcTypes = [
     {label:intl.get(`txs.type_lrc_fee`),value:'lrc_fee'},
     {label:intl.get(`txs.type_lrc_reward`),value:'lrc_reward'},
  ]
  let othersTypes = [
     // {label:intl.get(`txs.type_others`),value:'others'},
  ]
  if(token.toUpperCase() === 'WETH' || token.toUpperCase() === 'ETH'){
    types = [...types,...convertTypes]
  }
  if(token.toUpperCase() === 'LRC'){
    types = [...types,...lrcTypes]
  }
  types = [...types,...othersTypes]

  return (
      <div style={style}>
        <Form layout="inline">
          <Form.Item label={null && intl.get('txs.status')} >
            {form.getFieldDecorator('status', {
              initialValue:filters.status || '',
              rules:[]
            })(
              <Select
                  style={{ width: 120 }}
                  allowClear
                  placeholder={intl.get('txs.status')}
                  optionFilterProp="children"
                  onChange={handleChange}
                  onFocus={()=>{}}
                  onBlur={()=>{}}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                <Select.Option value="">{intl.get('global.all')}&nbsp;{intl.get('txs.status')}</Select.Option>
                <Select.Option value="pending">{intl.get('txs.status_pending')}</Select.Option>
                <Select.Option value="success">{intl.get('txs.status_success')}</Select.Option>
                <Select.Option value="failed">{intl.get('txs.status_failed')}</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label={null && intl.get('txs.type')} className="mr0">
            {form.getFieldDecorator('txType', {
              initialValue: filters.type || '',
              rules:[]
            })(
              <Select
                style={{ width: 120 }}
                allowClear
                onChange={handleChange}
                placeholder={intl.get('txs.type')}
              >
                {
                  types.map((item,index)=>
                    <Select.Option value={item.value} key={index}>{item.label}</Select.Option>
                  )
                }
              </Select>
            )}
          </Form.Item>

        </Form>
      </div>
  );
};


export default Form.create()(FiltersForm);


