export interface IProjectSubgoalId {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
}

export class ProjectSubgoalId implements IProjectSubgoalId {
  constructor(public id?: number, public code?: string, public name?: string, public description?: string) {}
}
