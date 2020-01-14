export interface IDepartment {
  id?: number;
  departmentCode?: string;
  departmentName?: string;
}

export class Department implements IDepartment {
  constructor(public id?: number, public departmentCode?: string, public departmentName?: string) {}
}
