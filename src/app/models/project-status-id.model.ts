export interface IProjectStatusId {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
}

export class ProjectStatusId implements IProjectStatusId {
  constructor(public id?: number, public code?: string, public name?: string, public description?: string) {}
}
