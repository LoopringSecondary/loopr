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
          <Form.Item label={intl.get('orders.market')} >
            {form.getFieldDecorator('market', {
              initialValue: filters.market || '',
              rules:[]
            })(
              <SelectContainer
                loadOptions={getSupportedMarket}
                transform={(res)=>{
                  let options = res.result.map(item=>({label:item,value:item}))
                  return [
                    {label:intl.get('global.all'),value:'',},
                    ...options,
                  ]
                }}
                style={{width:'120px'}}
                onChange={handleChange}
                placeholder={intl.get('global.all')}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
              </SelectContainer>
            )}
          </Form.Item>
          <Form.Item label={intl.get('orders.status')} >
            {form.getFieldDecorator('status', {
              initialValue:filters.status || '',
              rules:[]
            })(
              <Select
                  showSearch
                  allowClear
                  style={{width:'120px'}}
                  placeholder={intl.get('global.all')}
                  optionFilterProp="children"
                  onChange={handleChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Select.Option value="">{intl.get('global.all')}</Select.Option>
                  <Select.Option value="ORDER_OPENED">{intl.get('orders.status_opened')}</Select.Option>
                  <Select.Option value="ORDER_FINISHED">{intl.get('orders.status_completed')}</Select.Option>
                  <Select.Option value="ORDER_CANCELED">{intl.get('orders.status_canceled')}</Select.Option>
                  <Select.Option value="ORDER_EXPIRE">{intl.get('orders.status_expired')}</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label={intl.get('orders.side')} >
            {form.getFieldDecorator('side', {
              initialValue:filters.side || '',
              rules:[]
            })(
              <Radio.Group onChange={handleChange}>
                <Radio.Button value="">{intl.get('global.all')}</Radio.Button>
                <Radio.Button value="sell">{intl.get('orders.side_sell')}</Radio.Button>
                <Radio.Button value="buy">{intl.get('orders.side_buy')}</Radio.Button>
              </Radio.Group>
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


