declare namespace MainTableTypes {
  interface ActionCell {
    label: string;
    method: 'get' | 'post' | 'delete' | 'put';
    url: string;
    body?: string;
    confirm?: boolean;
  }
  interface TableData {
    headers: string[];
    defaultHeaders?: string[];
    rows: (string | ActionCell)[][];
  }
  type GraphItem = UI.GraphData;
  interface RowDetail {
    [key: string]: any;
  }
}
