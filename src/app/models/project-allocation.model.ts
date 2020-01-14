import { IImEmployee } from './im-employee.model';
import { IImProjects } from './im-projects.model';

export interface IProjectAllocation {
  id?: number;
  percentage?: number;
  imEmployee?: IImEmployee;
  imProjects?: IImProjects;
}

export class ProjectAllocation implements IProjectAllocation {
  constructor(public id?: number, public percentage?: number, public imEmployee?: IImEmployee, public imProjects?: IImProjects) { }
}
