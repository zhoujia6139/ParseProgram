import Axios from 'axios';
import { baseUrl } from '@utils/apiUtils';

export function handleClick(cell: MainTableTypes.ActionCell) {
  const method = cell.method;
  if (method === 'post') {
    return Axios.post(baseUrl + cell.url, cell.body);
  } else if (method === 'delete') {
    return Axios.delete(baseUrl + cell.url);
  } else if (method === 'put') {
    return Axios.put(baseUrl + cell.url, cell.body);
  }
  throw new Error(`invalid method ${method}`);
}
