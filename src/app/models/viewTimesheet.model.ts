export interface IViewTimesheet {
    id?: number;
    projectId?: number;
    employeeId?: number;
    projectName?: string;
    loghours?: number;
    notes?: string;
}

export class ViewTimesheet implements IViewTimesheet {
    constructor(public id?: number, public projectId?: number, public employeeId?: number, public projectName?: string, public loghours?: number, public notes?: string) { }
}
