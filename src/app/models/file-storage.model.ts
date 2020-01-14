import { IUserContact } from './user-contact.model';
import { IImProjects } from './im-projects.model';


export interface IFileStorage {
  id?: number;
  filename?: string;
  caption?: string;
  userContact?: IUserContact;
  imProjects?: IImProjects;
}

export class FileStorage implements IFileStorage {
  constructor(
    public id?: number,
    public filename?: string,
    public caption?: string,
    public userContact?: IUserContact,
    public imProjects?: IImProjects
  ) { }
}
