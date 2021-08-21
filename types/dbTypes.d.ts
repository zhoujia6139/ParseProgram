interface GridPriceSchema {
  date: Date;
  last: number; // price is last
  max: number;
  min: number;
}

interface BaseGridSchema extends GridPriceSchema {
  _id?: any;
  sell_volume: number;
  buy_volume: number;
  first: number;
}

interface TradeDbSchemaFrontend {
  _id?: string;
  s: 'b' | 's';
  r: number;
  a: number;
  c: string;
  t: number; // transaction time
  ts: number; // server time when data is recorded
  tId: number | string;
}
