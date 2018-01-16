const schema = [
    {
      title:'ID',
      name:'id',
    },
    {
      title:'Ring',
      description:'The ring hash',
      name:'ringHash',
    },
    {
      title:'Size',
      description:'The fills number int the ring.',
      name:'tradeAmount',
    },
    {
      title:'Miner',
      description:'The miner that submit match orders.',
      name:'miner',
    },

    {
      title:'FeeRecipient',
      description:'The fee recepient address.',
      name:'feeRecipient',
    },
    {
      title:'Transaction',
      description:' The ring match transaction hash.',
      name:'txHash',
    },
    {
      title:'BlockNumber',
      description:'The number of the block which contains the transaction.',
      name:'blockNumber',
    },
    {
      title:'LrcFee',
      description:'The total lrc fee.',
      name:'totalLrcFee',
    },

    {
      title:'Time',
      description:'The ring matched time',
      name:'timestamp',
    },
    {
      title:'Protocol',
      name:'protocol',
    },
  ]
  export default schema
