import { ISkillExpertise } from './skill-expertise.model';
import { IUserContact } from './user-contact.model';
import { ISkills } from './skills.model';


export interface ISkillTable {
  id?: number;
  skillExpertise?: ISkillExpertise;
  userContact?: IUserContact;
  skills?: ISkills;
}

export class SkillTable implements ISkillTable {
  constructor(public id?: number, public skillExpertise?: ISkillExpertise, public userContact?: IUserContact, public skills?: ISkills) { }
}
