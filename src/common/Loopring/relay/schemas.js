import basicSchemas from '../common/schemas'

const loopringScheams = {
  ...basicSchemas,
  PROJECT_ID: {
    type: 'number',
    required: true,
    min: 1
  },
  LOOPRING_TOKEN: {
    type: 'enum',
    required: true,
    enum: ['LRC', 'LRN', 'LRQ']
  },
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
    authPrivateKey: {
      ...basicSchemas.PRIVATE_KEY
    },
    validSince: {
      ...basicSchemas.VALUES
    },
    validUntil: {
      ...basicSchemas.VALUES
    },
    amountS: {
      ...basicSchemas.VALUES
    },
    amountB: {
      ...basicSchemas.VALUES
    },
    lrcFee: {
      ...basicSchemas.VALUES
    },
    walletId: {
      ...basicSchemas.VALUES
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
    authPrivateKey: {
      ...basicSchemas.PRIVATE_KEY
    },
    validSince: {
      ...basicSchemas.VALUES
    },
    validUntil: {
      ...basicSchemas.VALUES
    },
    amountS: {
      ...basicSchemas.VALUES
    },
    amountB: {
      ...basicSchemas.VALUES
    },
    lrcFee: {
      ...basicSchemas.VALUES
    },
    walletId: {
      ...basicSchemas.VALUES
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
};

export default loopringScheams;
