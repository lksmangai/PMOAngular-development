import { IQnowUser } from './qnow-user.model';
import { ICity } from './city.model';
import { IState } from './state.model';
import { ICountry } from './country.model';
import { IGroupMembers } from './group-members.model';
import { IImEmployee } from './im-employee.model';


export interface IUserContact {
  id?: number;
  homePhone?: string;
  workPhone?: string;
  cellPhone?: string;
  permentAddress?: string;
  haLine1?: string;
  haLine2?: string;
  haPostal?: string;
  waLine1?: string;
  waLine2?: string;
  waPostal?: string;
  ucNote?: string;
  primaryRole?: string;
  secondaryRole?: string;
  initiative?: string;
  technology?: string;
  teamName?: string;
  qnowUser?: IQnowUser;
  waCity?: ICity;
  haCity?: ICity;
  waState?: IState;
  haState?: IState;
  waCountry?: ICountry;
  haCountry?: ICountry;
  groupMembers?: IGroupMembers[];
  imEmployees?: IImEmployee[];
}

export class UserContact implements IUserContact {
  constructor(
    public id?: number,
    public homePhone?: string,
    public workPhone?: string,
    public cellPhone?: string,
    public permentAddress?: string,
    public haLine1?: string,
    public haLine2?: string,
    public haPostal?: string,
    public waLine1?: string,
    public waLine2?: string,
    public waPostal?: string,
    public ucNote?: string,
    public primaryRole?: string,
    public secondaryRole?: string,
    public initiative?: string,
    public technology?: string,
    public teamName?: string,
    public qnowUser?: IQnowUser,
    public waCity?: ICity,
    public haCity?: ICity,
    public waState?: IState,
    public haState?: IState,
    public waCountry?: ICountry,
    public haCountry?: ICountry,
    public groupMembers?: IGroupMembers[],
    public imEmployees?: IImEmployee[]
  ) { }
}
