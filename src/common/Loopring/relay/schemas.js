import basicSchemas from '../common/validator_schemas'
// Schema Help： https://github.com/yiminghe/async-validator
// required: value should be not empty eg: null, undefined, ''

let schemas = {

  RAW_Order: {
    delegateAddress:{
      ...basicSchemas.ADDRESS
    },
    protocol: {
      ...basicSchemas.ADDRESS
    },
    owner: {
      ...basicSchemas.ADDRESS
    },
    tokenS: {
      ...basicSchemas.ADDRESS
    },
    tokenB: {
      ...basicSchemas.ADDRESS
    },
    authAddr: {
      ...basicSchemas.ADDRESS
    },
    authPrivateKey:{
      ...basicSchemas.PRIVATE_KEY
    },
    validSince: {
      ...basicSchemas.ETH_DATA
    },
    validUntil: {
      ...basicSchemas.ETH_DATA
    },
    amountS: {
      ...basicSchemas.ETH_DATA
    },
    amountB: {
      ...basicSchemas.ETH_DATA
    },
    lrcFee: {
      ...basicSchemas.ETH_DATA
    },
    walletAddress: {
      ...basicSchemas.ADDRESS
    },
    buyNoMoreThanAmountB: {
      type: 'boolean',
      required: true
    },
    marginSplitPercentage: {
      type: 'integer',
      required: true,
      minimum: 0,
      maximum: 100
    }
  },
  ORDER: {

    delegateAddress:{
      ...basicSchemas.ADDRESS
    },
    protocol: {
      ...basicSchemas.ADDRESS
    },
    owner: {
      ...basicSchemas.ADDRESS
    },
    tokenS: {
      ...basicSchemas.ADDRESS
    },
    tokenB: {
      ...basicSchemas.ADDRESS
    },
    authAddr: {
      ...basicSchemas.ADDRESS
    },
    authPrivateKey:{
      ...basicSchemas.PRIVATE_KEY
    },
    validSince: {
      ...basicSchemas.ETH_DATA
    },
    validUntil: {
      ...basicSchemas.ETH_DATA
    },
    amountS: {
      ...basicSchemas.ETH_DATA
    },
    amountB: {
      ...basicSchemas.ETH_DATA
    },
    lrcFee: {
      ...basicSchemas.ETH_DATA
    },
    walletAddress: {
      ...basicSchemas.ADDRESS
    },
    buyNoMoreThanAmountB: {
      type: 'boolean',
      required: true
    },
    marginSplitPercentage: {
      type: 'integer',
      required: true,
      minimum: 0,
      maximum: 100
    },
    v: {
      type: 'integer',
      required: true,
      minimum: 0
    },
    s: {
      'type': 'string',
      required: true,
      pattern: /^0x[0-9a-fA-F]{64}$/g
    },
    r: {
      'type': 'string',
      required: true,
      pattern: /^0x[0-9a-fA-F]{64}$/g
    }
  }


}

export default schemas
