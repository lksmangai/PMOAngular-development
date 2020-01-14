export interface IOpportunityPriorityId {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
}

export class OpportunityPriorityId implements IOpportunityPriorityId {
  constructor(public id?: number, public code?: string, public name?: string, public description?: string) {}
}
