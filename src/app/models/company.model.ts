import { IProjectCostCenterId } from './project-cost-center-id.model';

export interface ICompany {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  projectCostCenterIds?: IProjectCostCenterId[];
}

export class Company implements ICompany {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public description?: string,
    public projectCostCenterIds?: IProjectCostCenterId[]
  ) { }
}
