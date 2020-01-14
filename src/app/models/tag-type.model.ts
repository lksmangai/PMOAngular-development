export interface ITagType {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
}

export class TagType implements ITagType {
  constructor(public id?: number, public code?: string, public name?: string, public description?: string) { }
}
