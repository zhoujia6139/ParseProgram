import * as _ from 'lodash';

export function setItem(key: string, value: any) {
  const valueStr = _.isString(value) ? value : JSON.stringify(value);
  window.localStorage.setItem(key, valueStr);
}

export function getItem(key: string) {
  return window.localStorage.getItem(key);
}
