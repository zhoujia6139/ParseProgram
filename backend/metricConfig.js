const AllOptions = [
  {
    title: 'get price correlation',
    description: 'get correlation between assets',
    controller: 'CorrelationController',
    method: 'getPriceCorrelations',
    params: [
      {
        name: 'startDate',
        type: 'text',
        description: 'ISO format string',
        placeholder: '2018-06-20T01:42:48.515Z',
        required: true
      },
      {
        name: 'endDate',
        type: 'text',
        description: 'ISO format string',
        placeholder: '2019-02-01T01:42:48.515Z',
        required: true
      },
      {
        name: 'pairs',
        type: 'array',
        description: 'multiple pairs',
        required: true,
        initialValue: [
          { exchange: 'binance', pairDb: 'USDT_BTC' },
          { exchange: 'binance', pairDb: 'USDT_ETH' }
        ],
        baseSection: [
          {
            name: 'exchange',
            type: 'text'
          },
          {
            name: 'pairDb',
            type: 'text'
          }
        ]
      }
    ]
  },
];

module.exports = { AllOptions }
