import basicSchemas from '../common/validator_schemas'

let standSchemas = {
  BASIC_TX: {
    to: {
      ...basicSchemas.ADDRESS
    },
    value: {
      ...basicSchemas.ETH_DATA
    },
    gasLimit: {
      type: "string",
      pattern: /^0x[0-9a-fA-F]{1,64}$/g
    },
    gasPrice: {
      type: "string",
      pattern: /^0x[0-9a-fA-F]{1,64}$/g
    },
    chainId: {
      type: 'number'
    },
    nonce: {
      type: "string",
      pattern: /^0x[0-9a-fA-F]{1,64}$/g
    },
    data: {
      type: 'string',
      required: true,
      pattern: /^0x[0-9a-fA-F]*$/g
    }
  },
  TX: {
    to: {
      ...basicSchemas.ADDRESS
    },
    value: {
      ...basicSchemas.ETH_DATA
    },
    gasLimit: {
      ...basicSchemas.ETH_DATA
    },
    gasPrice: {
      ...basicSchemas.ETH_DATA
    },
    chainId: {
      type: 'number',
      required: true
    },
    nonce: {
      ...basicSchemas.ETH_DATA
    },
    data: {
      type: 'string',
      required: true,
      pattern: /^0x[0-9a-fA-F]*$/g
    },
    signed: {
      type: 'string'
    }
  }
}

export default standSchemas







