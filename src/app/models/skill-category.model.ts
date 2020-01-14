export interface ISkillCategory {
  id?: number;
  skillCategoryCode?: string;
  skillCategoryName?: string;
}

export class SkillCategory implements ISkillCategory {
  constructor(public id?: number, public skillCategoryCode?: string, public skillCategoryName?: string) {}
}
