declare namespace UI {
  type InputType = 'TextInput' | 'TextBox' | 'Radio' | 'Dropdown';
  type SizeSML = 'sm' | 'md' | 'lg';

  interface Coord {
    x: number;
    y: number;
  }

  interface GraphAxis {
    id: string;
    label: string
    pointStyle?: 'crossRot' | 'cross';
    color?: string;
    gridLines?: {
      display?: boolean;
    }
  }

  interface GraphData {
    chartType: 'lineMulti' | 'scatter';
    chartData: Coord[][];
    graphAxis: GraphAxis[];
    isTimeAxis?: boolean;
  }
}
