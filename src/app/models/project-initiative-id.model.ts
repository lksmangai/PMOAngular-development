export interface IProjectInitiativeId {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
}

export class ProjectInitiativeId implements IProjectInitiativeId {
  constructor(public id?: number, public code?: string, public name?: string, public description?: string) {}
}
