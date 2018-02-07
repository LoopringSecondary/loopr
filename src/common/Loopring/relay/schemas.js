import basicSchemas from '../common/validator_schemas'
// Schema Help： https://github.com/yiminghe/async-validator
// required: value should be not empty eg: null, undefined, ''

let schemas = {

  RAW_Order: {
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
    walletId: {
      ...basicSchemas.ETH_DATA
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
    walletId: {
      ...basicSchemas.ETH_DATA
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
    r: {
      type: 'integer',
      required: true,
      minimum: 0
    },
    s: {
      'type': 'string',
      required: true,
      pattern: /^0x[0-9a-fA-F]{64}$/g
    },
    v: {
      'type': 'string',
      required: true,
      pattern: /^0x[0-9a-fA-F]{64}$/g
    }
  }


}

export default schemas
