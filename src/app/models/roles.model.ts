import { IGroupMembers } from './group-members.model';

export interface IRoles {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  groupMembers?: IGroupMembers[];
}

export class Roles implements IRoles {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public description?: string,
    public groupMembers?: IGroupMembers[]
  ) { }
}
