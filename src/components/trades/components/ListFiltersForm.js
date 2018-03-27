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
          <Form.Item label={null} >
            {form.getFieldDecorator('market', {
              initialValue:filters.pair,
              rules:[]
            })(
              <SelectContainer
                loadOptions={getSupportedMarket}
                transform={(res)=>{
                  let options = res.result.map(item=>({label:item,value:item}))
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
          <Form.Item label={null && intl.get('trades.side')} >
            {form.getFieldDecorator('side', {
              initialValue:filters.side || '',
              rules:[]
            })(
              <Radio.Group onChange={handleChange}>
                <Radio.Button value="">{intl.get('global.all')}</Radio.Button>
                <Radio.Button value="sell">{intl.get('trades.side_sell')}</Radio.Button>
                <Radio.Button value="buy">{intl.get('trades.side_buy')}</Radio.Button>
              </Radio.Group>
            )}

          </Form.Item>
        </Form>
      </div>
  );
};


export default Form.create()(FiltersForm);


