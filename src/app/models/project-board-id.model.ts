export interface IProjectBoardId {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
}

export class ProjectBoardId implements IProjectBoardId {
  constructor(public id?: number, public code?: string, public name?: string, public description?: string) {}
}
