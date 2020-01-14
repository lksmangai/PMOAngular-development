export interface IState {
  id?: number;
  stateCode?: string;
  stateName?: string;
}

export class State implements IState {
  constructor(public id?: number, public stateCode?: string, public stateName?: string) {}
}
