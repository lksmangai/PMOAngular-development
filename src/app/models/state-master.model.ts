export interface IStateMaster {
  id?: number;
  stateCode?: string;
  stateName?: string;
}

export class StateMaster implements IStateMaster {
  constructor(public id?: number, public stateCode?: string, public stateName?: string) {}
}
