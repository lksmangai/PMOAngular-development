export interface IEmployeeStatus {
  id?: number;
  statusCode?: string;
  statusName?: string;
}

export class EmployeeStatus implements IEmployeeStatus {
  constructor(public id?: number, public statusCode?: string, public statusName?: string) {}
}
