export interface  RadiometerState {
    state: boolean;
    values: RadiometerEntry[];
}

export interface RadiometerEntry {
    V: number;
    A: number;
    a: number;
    date: string;
    iteration: number;
}
  