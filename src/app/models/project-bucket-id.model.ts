export interface IProjectBucketId {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
}

export class ProjectBucketId implements IProjectBucketId {
  constructor(public id?: number, public code?: string, public name?: string, public description?: string) {}
}
