export interface IProjectClass {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
}

export class ProjectClass implements IProjectClass {
  constructor(public id?: number, public code?: string, public name?: string, public description?: string) {}
}
