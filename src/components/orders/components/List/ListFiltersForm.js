import React from 'react';
import { Form,Button,Icon,Card,Modal,Input,Radio,Select} from 'antd';
import SelectContainer from '../../../common/SelectContainer';
import {getSupportedMarket} from 'Loopring/relay/market';
import intl from 'react-intl-universal'

let FiltersForm = ({
  form,
  LIST,
  actions,
  id,
  }) => {
  const {filters={}} = LIST || {}
  function handleSubmit() {
    form.validateFields((err,values) => {
      console.log('values',values)
      if(!err){
        // TODO
        actions.filtersChange({
          id,
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
  function handleReset() {
    form.resetFields()
  }


  let formLayout = 'inline'
  return (
      <div className="">
        <Form layout="inline">
            <Form.Item label={null} >
              {form.getFieldDecorator('market', {
                initialValue: filters.market || '',
                rules:[]
              })(
                <SelectContainer
                  loadOptions={getSupportedMarket}
                  transform={(res)=>{
                    let pairs = window.CONFIG.getMarkets().map(item=>`${item.tokenx}-${item.tokeny}`)
                    let options = res.result.filter(item=>pairs.includes(item)).map(item=>({label:item,value:item}))
                    return [
                      {label:`${intl.get('global.all')} ${intl.get('orders.market')}`,value:""},
                      ...options,
                    ]
                  }}
                  style={{width:'120px'}}
                  onChange={handleChange}
                  placeholder={intl.get('orders.market')}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                </SelectContainer>
              )}
            </Form.Item>
            <Form.Item label={null && intl.get('orders.status')} >
              {form.getFieldDecorator('status', {
                initialValue:filters.status || '',
                rules:[]
              })(
                <Select
                  showSearch
                  allowClear
                  style={{width:'150px'}}
                  placeholder={intl.get('orders.status')}
                  optionFilterProp="children"
                  onChange={handleChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Select.Option value="">{intl.get('global.all')}&nbsp;{intl.get('orders.status')} </Select.Option>
                  <Select.Option value="ORDER_OPENED">{intl.get('orders.status_opened')}</Select.Option>
                  <Select.Option value="ORDER_FINISHED">{intl.get('orders.status_completed')}</Select.Option>
                  <Select.Option value="ORDER_CANCELLED">{intl.get('orders.status_canceled')}</Select.Option>
                  <Select.Option value="ORDER_EXPIRE">{intl.get('orders.status_expired')}</Select.Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label={null && intl.get('orders.side')} >
              {form.getFieldDecorator('side', {
                initialValue:filters.side || '',
                rules:[]
              })(
                <Select
                  showSearch
                  allowClear
                  style={{width:'120px'}}
                  placeholder={intl.get('orders.side')}
                  optionFilterProp="children"
                  onChange={handleChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Select.Option value="">{intl.get('global.all')}&nbsp;{intl.get('orders.side')}</Select.Option>
                  <Select.Option value="sell">{intl.get('orders.side_sell')}</Select.Option>
                  <Select.Option value="buy">{intl.get('orders.side_buy')}</Select.Option>
                </Select>
              )}
            </Form.Item>
          {
            false &&
            <Form.Item>
              <Button onClick={handleReset} type="default">Reset</Button>
            </Form.Item>
          }

        </Form>
      </div>
  );
};


export default Form.create()(FiltersForm);


