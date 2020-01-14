export interface IProjectMaingoalId {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
}

export class ProjectMaingoalId implements IProjectMaingoalId {
  constructor(public id?: number, public code?: string, public name?: string, public description?: string) {}
}
