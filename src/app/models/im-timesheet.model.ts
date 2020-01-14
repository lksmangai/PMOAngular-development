import { Moment } from 'moment';
import { IImEmployee } from './im-employee.model';
import { IImProjects } from './im-projects.model';

export interface IImTimesheet {
  id?: number;
  logdate?: Moment;
  loghours?: number;
  billhours?: number;
  notes?: string;
  imEmployee?: IImEmployee;
  imProjects?: IImProjects;
  logday?:string;
}

export class ImTimesheet implements IImTimesheet {
  constructor(
    public id?: number,
    public logdate?: Moment,
    public loghours?: number,
    public billhours?: number,
    public notes?: string,
    public imEmployee?: IImEmployee,
    public imProjects?: IImProjects,
    public logday?:string
  ) { }
}

