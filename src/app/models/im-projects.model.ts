import { Moment } from 'moment';
import { IProjectInitiativeId } from './project-initiative-id.model';
import { IProjectBusinessgoalId } from './project-businessgoal-id.model';
import { IProjectSubgoalId } from './project-subgoal-id.model';
import { IProjectMaingoalId } from './project-maingoal-id.model';
import { IProjectBucketId } from './project-bucket-id.model';
import { IProjectCostCenterId } from './project-cost-center-id.model';
import { IOpportunityPriorityId } from './opportunity-priority-id.model';
import { IBacklogPractice } from './backlog-practice.model';
import { IProjectTheme } from './project-theme.model';
import { IProjectClass } from './project-class.model';
import { IProjectVertical } from './project-vertical.model';
import { IProjectBoardId } from './project-board-id.model';
import { IProjectStatusId } from './project-status-id.model';
import { IProjectTypeId } from './project-type-id.model';
import { IImEmployee } from './im-employee.model';


export interface IImProjects {
  id?: number;
  projectName?: string;
  projectNr?: string;
  projectPath?: string;
  treeSortkey?: string;
  maxChildSortkey?: string;
  description?: string;
  billingTypeId?: number;
  note?: string;
  requiresReportP?: boolean;
  projectBudget?: number;
  projectRisk?: string;
  corporateSponsor?: string;
  percentCompleted?: number;
  projectBudgetHours?: number;
  costQuotesCache?: number;
  costInvoicesCache?: number;
  costTimesheetPlannedCache?: number;
  costPurchaseOrdersCache?: number;
  costBillsCache?: number;
  costTimesheetLoggedCache?: number;
  endDate?: Moment;
  startDate?: Moment;
  templateP?: boolean;
  sortOrder?: number;
  reportedHoursCache?: number;
  costExpensePlannedCache?: number;
  costExpenseLoggedCache?: number;
  confirmDate?: Moment;
  costDeliveryNotesCache?: number;
  costCacheDirty?: Moment;
  milestoneP?: boolean;
  releaseItemP?: string;
  presalesProbability?: number;
  presalesValue?: number;
  reportedDaysCache?: number;
  presalesValueCurrency?: string;
  opportunitySalesStageId?: number;
  opportunityCampaignId?: number;
  scoreRevenue?: number;
  scoreStrategic?: number;
  scoreFinanceNpv?: number;
  scoreCustomers?: number;
  scoreFinanceCost?: number;
  costBillsPlanned?: number;
  costExpensesPlanned?: number;
  scoreRisk?: number;
  scoreCapabilities?: number;
  scoreEinanceRoi?: number;
  projectUserwiseBoard?: string;
  projectBringNextday?: number;
  projectBringSameboard?: string;
  projectNewboardEverytime?: string;
  projectUserwiseBoard2?: string;
  projectBringSameboard2?: string;
  projectNewboard2Everytime?: number;
  projectNewboard2Always?: string;
  projectReportWeekly?: string;
  scoreGain?: number;
  scoreLoss?: number;
  scoreDelivery?: number;
  scoreOperations?: number;
  scoreWhy?: number;
  javaServices?: string;
  netServices?: string;
  collectionLink?: string;
  trainingLink?: string;
  collectionName?: string;
  trainingName?: string;
  trainingDoc?: string;
  testingRichtext?: number;
  templateCategory?: string;
  dType?: number;
  dOption?: number;
  dFilter?: number;
  dId?: number;
  tType?: number;
  tOption?: number;
  tFilter?: number;
  tId?: number;
  risktype?: string;
  riskimpact?: number;
  riskprobability?: number;
  projectInitiativeId?: IProjectInitiativeId;
  projectBusinessgoalId?: IProjectBusinessgoalId;
  projectSubgoalId?: IProjectSubgoalId;
  projectMaingoalId?: IProjectMaingoalId;
  projectBucketId?: IProjectBucketId;
  projectCostCenterId?: IProjectCostCenterId;
  opportunityPriorityId?: IOpportunityPriorityId;
  backlogPractice?: IBacklogPractice;
  projectTheme?: IProjectTheme;
  projectClass?: IProjectClass;
  projectVertical?: IProjectVertical;
  projectBoardId?: IProjectBoardId;
  projectBoard2Id?: IProjectBoardId;
  projectStatusId?: IProjectStatusId;
  projectTypeId?: IProjectTypeId;
  projectLeadId?: IImEmployee;
  parentId?: IImProjects;
}

export class ImProjects implements IImProjects {
  constructor(
    public id?: number,
    public projectName?: string,
    public projectNr?: string,
    public projectPath?: string,
    public treeSortkey?: string,
    public maxChildSortkey?: string,
    public description?: string,
    public billingTypeId?: number,
    public note?: string,
    public requiresReportP?: boolean,
    public projectBudget?: number,
    public projectRisk?: string,
    public corporateSponsor?: string,
    public percentCompleted?: number,
    public projectBudgetHours?: number,
    public costQuotesCache?: number,
    public costInvoicesCache?: number,
    public costTimesheetPlannedCache?: number,
    public costPurchaseOrdersCache?: number,
    public costBillsCache?: number,
    public costTimesheetLoggedCache?: number,
    public endDate?: Moment,
    public startDate?: Moment,
    public templateP?: boolean,
    public sortOrder?: number,
    public reportedHoursCache?: number,
    public costExpensePlannedCache?: number,
    public costExpenseLoggedCache?: number,
    public confirmDate?: Moment,
    public costDeliveryNotesCache?: number,
    public costCacheDirty?: Moment,
    public milestoneP?: boolean,
    public releaseItemP?: string,
    public presalesProbability?: number,
    public presalesValue?: number,
    public reportedDaysCache?: number,
    public presalesValueCurrency?: string,
    public opportunitySalesStageId?: number,
    public opportunityCampaignId?: number,
    public scoreRevenue?: number,
    public scoreStrategic?: number,
    public scoreFinanceNpv?: number,
    public scoreCustomers?: number,
    public scoreFinanceCost?: number,
    public costBillsPlanned?: number,
    public costExpensesPlanned?: number,
    public scoreRisk?: number,
    public scoreCapabilities?: number,
    public scoreEinanceRoi?: number,
    public projectUserwiseBoard?: string,
    public projectBringNextday?: number,
    public projectBringSameboard?: string,
    public projectNewboardEverytime?: string,
    public projectUserwiseBoard2?: string,
    public projectBringSameboard2?: string,
    public projectNewboard2Everytime?: number,
    public projectNewboard2Always?: string,
    public projectReportWeekly?: string,
    public scoreGain?: number,
    public scoreLoss?: number,
    public scoreDelivery?: number,
    public scoreOperations?: number,
    public scoreWhy?: number,
    public javaServices?: string,
    public netServices?: string,
    public collectionLink?: string,
    public trainingLink?: string,
    public collectionName?: string,
    public trainingName?: string,
    public trainingDoc?: string,
    public testingRichtext?: number,
    public templateCategory?: string,
    public dType?: number,
    public dOption?: number,
    public dFilter?: number,
    public dId?: number,
    public tType?: number,
    public tOption?: number,
    public tFilter?: number,
    public tId?: number,
    public risktype?: string,
    public riskimpact?: number,
    public riskprobability?: number,
    public projectInitiativeId?: IProjectInitiativeId,
    public projectBusinessgoalId?: IProjectBusinessgoalId,
    public projectSubgoalId?: IProjectSubgoalId,
    public projectMaingoalId?: IProjectMaingoalId,
    public projectBucketId?: IProjectBucketId,
    public projectCostCenterId?: IProjectCostCenterId,
    public opportunityPriorityId?: IOpportunityPriorityId,
    public backlogPractice?: IBacklogPractice,
    public projectTheme?: IProjectTheme,
    public projectClass?: IProjectClass,
    public projectVertical?: IProjectVertical,
    public projectBoardId?: IProjectBoardId,
    public projectBoard2Id?: IProjectBoardId,
    public projectStatusId?: IProjectStatusId,
    public projectTypeId?: IProjectTypeId,
    public projectLeadId?: IImEmployee,
    public parentId?: IImProjects
  ) {
    this.requiresReportP = this.requiresReportP || false;
    this.templateP = this.templateP || false;
    this.milestoneP = this.milestoneP || false;
  }
}
