import React from 'react';
import { Form,Button,Icon,Card,Modal,Input,Radio,Select} from 'antd';
import SelectContainer from '../../../common/SelectContainer';
import {getSupportedMarket} from 'Loopring/relay/market';

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
          <Form.Item label="Market" >
            {form.getFieldDecorator('market', {
              initialValue: filters.market || '',
              rules:[]
            })(
              <SelectContainer
                loadOptions={getSupportedMarket}
                transform={(res)=>{
                  let options = res.result.map(item=>({label:item,value:item}))
                  return [
                    {label:'All',value:'',},
                    ...options,
                  ]
                }}
                style={{width:'120px'}}
                onChange={handleChange}
                placeholder="Search/Select"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
              </SelectContainer>
            )}
          </Form.Item>
          <Form.Item label="Status" >
            {form.getFieldDecorator('status', {
              initialValue:filters.status || '',
              rules:[]
            })(
              <Select
                  showSearch
                  allowClear
                  style={{width:'120px'}}
                  placeholder="Search/Select"
                  optionFilterProp="children"
                  onChange={handleChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Select.Option value="">All</Select.Option>
                  <Select.Option value="ORDER_OPENED">Opened</Select.Option>
                  <Select.Option value="ORDER_FINISHED">Completed</Select.Option>
                  <Select.Option value="ORDER_CANCELED">Cancelled</Select.Option>
                  <Select.Option value="ORDER_EXPIRE">Expired</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Side" >
            {form.getFieldDecorator('side', {
              initialValue:filters.side || '',
              rules:[]
            })(
              <Radio.Group onChange={handleChange}>
                <Radio.Button value="">All</Radio.Button>
                <Radio.Button value="sell">Sell</Radio.Button>
                <Radio.Button value="buy">Buy</Radio.Button>
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


