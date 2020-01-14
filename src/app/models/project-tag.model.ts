import { ITagType } from './tag-type.model';
import { IImEmployee } from './im-employee.model';
import { IImProjects } from './im-projects.model';

// import { IImEmployee } from './im-employee.model';
// import { ITagType } from './tag-type.model';
// import { IImProjects } from './im-projects.model';

export interface IProjectTag {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  flag?: string;
  color?: string;
  tagType?: ITagType;
  imEmployee?: IImEmployee;
  imProjects?: IImProjects;
}

export class ProjectTag implements IProjectTag {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public description?: string,
    public flag?: string,
    public color?: string,
    public tagType?: ITagType,
    public imEmployee?: IImEmployee,
    public imProjects?: IImProjects
  ) { }
}
