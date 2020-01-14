export interface IProjectBusinessgoalId {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
}

export class ProjectBusinessgoalId implements IProjectBusinessgoalId {
  constructor(public id?: number, public code?: string, public name?: string, public description?: string) {}
}
