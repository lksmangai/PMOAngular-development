import { IUserContact } from './user-contact.model';
import { IUser } from './user.model';

export interface IQnowUser {
  id?: number;
  user?: IUser;
}

export class QnowUser implements IQnowUser {
  constructor(public id?: number, public user?: IUserContact) { }
}
