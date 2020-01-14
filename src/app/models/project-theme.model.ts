export interface IProjectTheme {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
}

export class ProjectTheme implements IProjectTheme {
  constructor(public id?: number, public code?: string, public name?: string, public description?: string) {}
}
