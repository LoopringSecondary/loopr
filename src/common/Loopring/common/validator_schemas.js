
// Schema Help： https://github.com/yiminghe/async-validator
// required: value should be not empty eg: null, undefined, ''

let basicSchemas ={
  STRING:{
    type:'string',
    required:true,
  },
  URL:{
    type:'url',
    required:true,
  },
  ADDRESS:{
    type:'string',
    required:true,
    pattern:/^0x[0-9a-fA-F]{1,64}$/g,
  },
  HEX:{
    type:'string',
    required:true,
    pattern:/^0x[0-9a-fA-F]+$/g,
  },
  QUANTITY:{
    type:'string',
    required:true,
  },
  PRIVATE_KEY:{
    type:'string',
    required:true,
    length:64,
  },
  ABI_METHOD:{
    type:'enum',
    required:true,
    enum:['cancelOrder','setCutoff','approve','withdraw','transfer','balanceOf','allowance'],
  },
  RPC_TAG:{
    type:'enum',
    required:true,
    enum:['latest','earliest','pending'],
  },
  TIMESTAMP:{
    type:'string',
  },
  PRIVATE_KEY_BUFFER:{
    validator:(rule,value,cb)=>{
      if (value instanceof Buffer && pk.length === 32){
          cb()
      }else{
          cb('private_key must be buffer')
      }
    }
  },
  CURRENCY:{
    type:'string',
    required:true,
    enum:['USD','CNY'],
  },
}

export default basicSchemas
