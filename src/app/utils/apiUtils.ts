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
    }
  ];
  return { data: AllOptions };
  // return await get('text-metric-options');
}

export async function submitTextMetric(body: { methodName: string; values: Record<string, any> }) {
  return await Axios.post(`${baseUrl}/text-metric`, body);
}

export async function fetchBackTestTaskRunnerOptions() {
  return await get('back-test-task-runner');
}
export async function fetchBackTestTaskRunnerTfOptions() {
  return await get('back-test-task-runner-tf');
}

export async function fetchBackTestTaskRunnerUltraTfOptions() {
  return await get('back-test-task-runner-ultratf');
}

export async function fetchBackTestRetestTaskRunnerOptions() {
  return await get('back-test-retest-task-runner');
}

export async function backTestTaskRunnerStartBuild(body: any) {
  return await Axios.post(`${baseUrl}/back-test-task-runner`, body);
}

export async function backTestTaskRunnerTfStartBuild(body: any) {
  return await Axios.post(`${baseUrl}/back-test-task-runner-tf`, body);
}

export async function backTestTaskRunnerUltraTfStartBuild(body: any) {
  return await Axios.post(`${baseUrl}/back-test-task-runner-ultratf`, body);
}

export async function backTestRetestTaskRunnerStartBuild(body: any) {
  return await Axios.post(`${baseUrl}/back-test-retest-task-runner`, body);
}

export async function fetchBackTestResultsVersions() {
  return await get<{ title: string }[]>(`back-test-results-table-versions`);
}

export async function fetchBackTestResultsTableRows(version: string, headerFilters: string[]) {
  return await Axios.post(`${baseUrl}/back-test-results-detail/${version}`, { headerFilters });
}

export async function fetchBackTestResultDetail(version: string, id: string) {
  return await get(`back-test-results-detail/${version}/${id}`);
}

export async function fetchBackTestPdfDetails(version: string, id: string, isUSD?: boolean) {
  return await get(`back-test-pdf-detail/${version}/${id}?usd=${!!isUSD}`);
}

export async function fetchDevChart(id: string) {
  return await get(`dev-chart/${id}`);
}

export async function fetchBackTestResultBackTestResultCompare(
  version: string,
  id: string,
  id2: string
) {
  return await get(`back-test-compare/${version}/${id}/${id2}`);
}

export async function fetchMergedBacktestResult(version: string, id: string) {
  return await get(`back-test-merged/${version}/${id}`);
}

export async function fetchEquityCurve(id: string, resolution: string) {
  if (!id) return { data: null };
  return await get(`tradingview/equitycurve?accountId=${id}&resolution=${resolution}`);
}
