export interface IProjectTypeId {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
}

export class ProjectTypeId implements IProjectTypeId {
  constructor(public id?: number, public code?: string, public name?: string, public description?: string) {}
}
