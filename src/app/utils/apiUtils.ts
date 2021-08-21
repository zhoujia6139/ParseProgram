import Axios from 'axios';

export const baseUrl = '/api';

export async function get<T = any>(path: string) {
  return await Axios.get<T>(`${baseUrl}/${path}`);
}

export async function fetchMainTable() {
  return await get(`table-rows`);
}

export async function fetchTableRowDetail(id: string) {
  return await get(`table-row/${id}`);
}

// todo: move this to backend.
export async function fetchTextMetricOptions() {
  const AllOptions: any = [
    {
      title: 'dam compare rtm',
      description: 'get correlation between assets',
      controller: 'CorrelationController',
      method: 'getPriceCorrelations',
      params: [
        {
          name: 'startDate',
          type: 'text',
          description: 'ISO format string',
          placeholder: '2020-01-01 00:00:00',
          required: true
        },
        {
          name: 'endDate',
          type: 'text',
          description: 'ISO format string',
          placeholder: '2020-01-10 00:00:00',
          required: true
        },
        {
          name: 'repeated_hour_flag',
          description: 'Y or N',
          placeholder: 'N',
          label: 'repeated_hour_flag',
          type: 'select',
          options: [{ value: 'N', label: 'N' }, { value: 'Y', label: 'Y' }],
          required: true
        },
        {
          name: 'curtail_over_price',
          type: 'text',
          description: 'price',
          placeholder: '200',
          required: false
        },
        {
          name: 'compares',
          type: 'array',
          description: 'multiple pairs',
          required: true,
          initialValue: [
            { type: 'RTM', settlement_point: 'HB_WEST' },
            { type: 'RTM', settlement_point: 'HB_NORTH' }
          ],
          baseSection: [
            {
              name: 'settlement_point',
              description: 'settlement point',
              type: 'select',
              label: 'settlement_point',
              options: [
                { value: 'HB_BUSAVG', label: 'HB_BUSAVG' },
                { value: 'HB_HOUSTON', label: 'HB_HOUSTON' },
                { value: 'HB_HUBAVG', label: 'HB_HUBAVG' },
                { value: 'HB_NORTH', label: 'HB_NORTH' },
                { value: 'HB_SOUTH', label: 'HB_SOUTH' },
                { value: 'HB_WEST', label: 'HB_WEST' },
                { value: 'LZ_AEN', label: 'LZ_AEN' },
                { value: 'LZ_CPS', label: 'LZ_CPS' },
                { value: 'LZ_HOUSTON', label: 'LZ_HOUSTON' },
                { value: 'LZ_LCRA', label: 'LZ_LCRA' },
                { value: 'LZ_NORTH', label: 'LZ_NORTH' },
                { value: 'LZ_RAYBN', label: 'LZ_RAYBN' },
                { value: 'LZ_SOUTH', label: 'LZ_SOUTH' },
                { value: 'LZ_WEST', label: 'LZ_WEST' },
                { value: 'HB_PAN', label: 'HB_PAN' }
              ],
              required: true
            },
            {
              name: 'type',
              type: 'select',
              label: 'type',
              options: [{ value: 'RTM', label: 'RTM' }, { value: 'DAM', label: 'DAM' }]
            }
          ]
        }
      ]
    },
    {
      title: 'average rtm',
      description: 'get average',
      controller: 'CorrelationController',
      method: 'getPriceCorrelations',
      params: [
        {
          name: 'startDate',
          type: 'text',
          description: 'ISO format string',
          placeholder: '2020-01-01 00:00:00',
          required: true
        },
        {
          name: 'endDate',
          type: 'text',
          description: 'ISO format string',
          placeholder: '2020-01-10 00:00:00',
          required: true
        }
      ]
    }
  ];
  return { data: AllOptions };
  // return await get('text-metric-options');
}

export async function submitTextMetric(body: { methodName: string; values: Record<string, any> }) {
  return await Axios.post(`${baseUrl}/text-metric`, body);
}

export async function fetchDevChart(id: string) {
  return await get(`dev-chart/${id}`);
}
