export interface IProjectRoles {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
}

export class ProjectRoles implements IProjectRoles {
  constructor(public id?: number, public code?: string, public name?: string, public description?: string) {}
}
