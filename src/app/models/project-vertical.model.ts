export interface IProjectVertical {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
}

export class ProjectVertical implements IProjectVertical {
  constructor(public id?: number, public code?: string, public name?: string, public description?: string) {}
}
