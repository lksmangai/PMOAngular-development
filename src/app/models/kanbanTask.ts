import { IImProjects } from './im-projects.model';

export interface IKanbanTask {
    title?: string;
    id?: string;
    tasks?: IImProjects[];
}

export class KanbanTask implements IKanbanTask {
    constructor(public title?: string, public id?: string, public tasks?: IImProjects[]) { }
}
