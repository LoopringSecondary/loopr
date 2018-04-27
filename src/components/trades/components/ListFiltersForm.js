import React from 'react';
import { Form,Button,Icon,Card,Modal,Input,Radio,Select} from 'antd';
import SelectContainer from '../../common/SelectContainer';
import {getSupportedMarket} from 'Loopring/relay/market';
import intl from 'react-intl-universal'
let FiltersForm = ({
  form,
  actions,
  LIST,
  }) => {
  const {filters} = LIST
  function handleSubmit() {
    form.validateFields((err,values) => {
      console.log('values',values)
      if(!err){
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
  function handleReset() {
    form.resetFields()
    handleSubmit()
  }

  let formLayout = 'inline'
  return (
      <div className="">
        <Form layout="inline">
          <div className="row">
            <div className="col-auto">
              <span>{intl.get('global.market')}</span>
              <Form.Item label={null} >
                {form.getFieldDecorator('market', {
                  initialValue:filters.pair || '',
                  rules:[]
                })(
                  <SelectContainer
                    loadOptions={getSupportedMarket}
                    transform={(res)=>{
                      let pairs = window.CONFIG.getMarkets().map(item=>`${item.tokenx}-${item.tokeny}`)
                      let options = res.result.filter(item=>pairs.includes(item)).map(item=>({label:item,value:item}))
                      return [
                        ...options,
                      ]
                    }}
                    style={{width:'120px'}}
                    onChange={handleChange}
                    placeholder={intl.get('global.market')}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                  </SelectContainer>
                )}
              </Form.Item>
            </div>
            <div className="col">
              <span>{intl.get('trades.side')}</span>
              <Form.Item label={null} >
                {form.getFieldDecorator('side', {
                  initialValue:filters.side || '',
                  rules:[]
                })(
                  <Select
                    showSearch
                    allowClear
                    style={{width:'120px'}}
                    placeholder={intl.get('trades.side')}
                    optionFilterProp="children"
                    onChange={handleChange}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    <Select.Option value="">{intl.get('global.all')}</Select.Option>
                    <Select.Option value="sell">{intl.get('trades.side_sell')}</Select.Option>
                    <Select.Option value="buy">{intl.get('trades.side_buy')}</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
  );
};


export default Form.create()(FiltersForm);


