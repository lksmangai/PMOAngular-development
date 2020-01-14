export interface ISkillExpertise {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
}

export class SkillExpertise implements ISkillExpertise {
  constructor(public id?: number, public code?: string, public name?: string, public description?: string) {}
}
