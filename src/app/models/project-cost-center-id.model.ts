import { ICompany } from './company.model';

export interface IProjectCostCenterId {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  companies?: ICompany[];
}

export class ProjectCostCenterId implements IProjectCostCenterId {
  constructor(public id?: number, public code?: string, public name?: string, public description?: string, public companies?: ICompany[]) { }
}
