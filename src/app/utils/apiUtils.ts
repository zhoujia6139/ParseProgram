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
          placeholder: '2020-10-15T00:00:00.000Z',
          required: true
        },
        {
          name: 'endDate',
          type: 'text',
          description: 'ISO format string',
          placeholder: '2020-10-26T00:00:00.000Z',
          required: true
        },
        {
          name: 'settlement_point',
          type: 'text',
          description: 'settlement point',
          placeholder: 'HB_BUSAVG',
          required: true
        },
        {
          name: 'settlement_point_type',
          type: 'text',
          description: 'settlement point type',
          placeholder: 'SH',
          required: true
        },
        {
          name: 'repeated_hour_flag',
          type: 'text',
          description: 'Y or N',
          placeholder: 'N',
          required: true
        },
        {
          name: 'types',
          type: 'array',
          description: 'multiple pairs',
          required: true,
          initialValue: [{ type: 'DAM' }, { type: 'RTM' }],
          baseSection: [
            {
              name: 'type',
              type: 'select',
              options: [{ value: 'DAM', label: 'DAM' }, { value: 'RTM', label: 'RTM' }]
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
          placeholder: '2020-10-15T00:00:00.000Z',
          required: true
        },
        {
          name: 'endDate',
          type: 'text',
          description: 'ISO format string',
          placeholder: '2020-10-26T00:00:00.000Z',
          required: true
        },
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
