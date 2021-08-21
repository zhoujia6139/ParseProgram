import * as _ from 'lodash';
export function getFormInitValues(params: FormFormat.FormParam[]) {
  const ret: any = {};
  _.each(params, (param) => {
    if (param.baseSection) {
      ret[param.name] = param.initialValue || [getFormInitValues(param.baseSection)];
    } else {
      ret[param.name] = param.placeholder || '';
    }
  });
  return ret;
}
