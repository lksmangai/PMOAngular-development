import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { SidenavService } from "src/app/services/sidenav.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CommonService } from "src/app/services/common.service";
import { ImEmployee } from "src/app/models/im-employee.model";
import { IProjectVertical } from 'src/app/models/project-vertical.model';
import { IProjectTypeId } from 'src/app/models/project-type-id.model';
import { IProjectTheme } from 'src/app/models/project-theme.model';
import { IProjectStatusId } from 'src/app/models/project-status-id.model';
import { IOpportunityPriorityId } from 'src/app/models/opportunity-priority-id.model';
import * as moment from 'moment';
@Component({
  selector: "app-riskmodal",
  templateUrl: "./riskmodal.component.html",
  styleUrls: ["./riskmodal.component.css"]
})
export class RiskmodalComponent implements OnInit, OnChanges {
  @Input() updateProject: any;
  //  @Input() flagUpdate: boolean;

  @Output() projectRefresh = new EventEmitter<boolean>();
  @Output() userRefresh = new EventEmitter<boolean>();
  projectVertical: IProjectVertical[] = [];
  status: IProjectStatusId[] = [];
  opportunityPriorityId: IOpportunityPriorityId[];
  editForm: FormGroup;
  activeEmp: any;
  activeDate: moment.Moment;
  flagUpdate: boolean;
  constructor(private sidenav: SidenavService, private fb: FormBuilder,
    private commonService: CommonService) {
    this.activeDate = moment(new Date());
    this.editForm = this.fb.group({
      id: [],
      projectName: ["", Validators.required],
      projectNr: [],
      projectPath: [],
      treeSortkey: [],
      maxChildSortkey: [],
      description: [],
      billingTypeId: [],
      note: [],
      requiresReportP: [],
      projectBudget: [],
      projectRisk: [],
      corporateSponsor: [],
      percentCompleted: [],
      projectBudgetHours: [],
      costQuotesCache: [],
      costInvoicesCache: [],
      costTimesheetPlannedCache: [],
      costPurchaseOrdersCache: [],
      costBillsCache: [],
      costTimesheetLoggedCache: [],
      endDate: [],
      startDate: [],
      templateP: [],
      sortOrder: [],
      reportedHoursCache: [],
      costExpensePlannedCache: [],
      costExpenseLoggedCache: [],
      confirmDate: [],
      costDeliveryNotesCache: [],
      costCacheDirty: [],
      milestoneP: [],
      releaseItemP: [],
      presalesProbability: [],
      presalesValue: [],
      reportedDaysCache: [],
      presalesValueCurrency: [],
      opportunitySalesStageId: [],
      opportunityCampaignId: [],
      scoreRevenue: [],
      scoreStrategic: [],
      scoreFinanceNpv: [],
      scoreCustomers: [],
      scoreFinanceCost: [],
      costBillsPlanned: [],
      costExpensesPlanned: [],
      scoreRisk: [],
      scoreCapabilities: [],
      scoreEinanceRoi: [],
      projectUserwiseBoard: [],
      projectBringNextday: [],
      projectBringSameboard: [],
      projectNewboardEverytime: [],
      projectUserwiseBoard2: [],
      projectBringSameboard2: [],
      projectNewboard2Everytime: [],
      projectNewboard2Always: [],
      projectReportWeekly: [],
      scoreGain: [],
      scoreLoss: [],
      scoreDelivery: [],
      scoreOperations: [],
      scoreWhy: [],
      javaServices: [],
      netServices: [],
      collectionLink: [],
      trainingLink: [],
      collectionName: [],
      trainingName: [],
      trainingDoc: [],
      testingRichtext: [],
      templateCategory: [],
      dType: [],
      dOption: [],
      dFilter: [],
      dId: [],
      tType: [],
      tOption: [],
      tFilter: [],
      tId: [],
      risktype: ["", Validators.required],
      riskimpact: [],
      riskprobability: [],
      projectInitiativeId: [],
      projectBusinessgoalId: [],
      projectSubgoalId: [],
      projectMaingoalId: [],
      projectBucketId: [],
      projectCostCenterId: [],
      opportunityPriorityId: [],
      backlogPractice: [],
      projectTheme: [],
      projectClass: [],
      projectVertical: [],
      projectBoardId: [],
      projectBoard2Id: [],
      projectStatusId: [],
      projectTypeId: [],
      projectLeadId: [],
      parentId: []
    });

  }

  ngOnInit() {
    //this.status = this.sidenav.status;
    this.activeEmp = this.commonService.getEmployeDetails();
    this.commonService.projectsStatus().subscribe(projectStatus => {
      this.status = projectStatus;
      this.status.sort((a, b) => a.name.localeCompare(b.name))

    });
    this.commonService
      .projectsVerticals()
      .subscribe((projectsVerticals: IProjectVertical[]) => {
        this.projectVertical = projectsVerticals;
        this.projectVertical.sort((a, b) => a.name.localeCompare(b.name))

      });
    this.commonService.projectsPriority().subscribe((projectsPriority: IOpportunityPriorityId[]) => {
      this.opportunityPriorityId = projectsPriority;
    });

  }
  ngOnChanges() {
    console.log("up", this.updateProject);
    if (this.updateProject == null) {
      this.editForm.reset();
      this.flagUpdate = true;
    }
    else if (this.updateProject) {
      this.flagUpdate = false;
      var project = this.updateProject;
      this.editForm.patchValue({
        id: project.id,
        projectName: project.projectName,
        projectNr: project.projectNr,
        projectPath: project.projectPath,
        treeSortkey: project.treeSortkey,
        maxChildSortkey: project.maxChildSortkey,
        description: project.description,
        billingTypeId: project.billingTypeId,
        note: project.note,
        requiresReportP: project.requiresReportP,
        projectBudget: project.projectBudget,
        projectRisk: project.projectRisk,
        corporateSponsor: project.corporateSponsor,
        percentCompleted: project.percentCompleted,
        projectBudgetHours: project.projectBudgetHours,
        costQuotesCache: project.costQuotesCache,
        costInvoicesCache: project.costInvoicesCache,
        costTimesheetPlannedCache: project.costTimesheetPlannedCache,
        costPurchaseOrdersCache: project.costPurchaseOrdersCache,
        costBillsCache: project.costBillsCache,
        costTimesheetLoggedCache: project.costTimesheetLoggedCache,
        endDate: project.endDate != null ? new Date(project.endDate.toString()) : null,
        startDate: project.startDate != null ? new Date(project.startDate.toString()) : null,
        templateP: project.templateP,
        sortOrder: project.sortOrder,
        reportedHoursCache: project.reportedHoursCache,
        costExpensePlannedCache: project.costExpensePlannedCache,
        costExpenseLoggedCache: project.costExpenseLoggedCache,
        confirmDate: project.confirmDate != null ? new Date(project.confirmDate.toString()) : null,
        costDeliveryNotesCache: project.costDeliveryNotesCache,
        costCacheDirty: project.costCacheDirty != null ? new Date(project.costCacheDirty.toString()) : null,
        milestoneP: project.milestoneP,
        releaseItemP: project.releaseItemP,
        presalesProbability: project.presalesProbability,
        presalesValue: project.presalesValue,
        reportedDaysCache: project.reportedDaysCache,
        presalesValueCurrency: project.presalesValueCurrency,
        opportunitySalesStageId: project.opportunitySalesStageId,
        opportunityCampaignId: project.opportunityCampaignId,
        scoreRevenue: project.scoreRevenue,
        scoreStrategic: project.scoreStrategic,
        scoreFinanceNpv: project.scoreFinanceNpv,
        scoreCustomers: project.scoreCustomers,
        scoreFinanceCost: project.scoreFinanceCost,
        costBillsPlanned: project.costBillsPlanned,
        costExpensesPlanned: project.costExpensesPlanned,
        scoreRisk: project.scoreRisk,
        scoreCapabilities: project.scoreCapabilities,
        scoreEinanceRoi: project.scoreEinanceRoi,
        projectUserwiseBoard: project.projectUserwiseBoard,
        projectBringNextday: project.projectBringNextday,
        projectBringSameboard: project.projectBringSameboard,
        projectNewboardEverytime: project.projectNewboardEverytime,
        projectUserwiseBoard2: project.projectUserwiseBoard2,
        projectBringSameboard2: project.projectBringSameboard2,
        projectNewboard2Everytime: project.projectNewboard2Everytime,
        projectNewboard2Always: project.projectNewboard2Always,
        projectReportWeekly: project.projectReportWeekly,
        scoreGain: project.scoreGain,
        scoreLoss: project.scoreLoss,
        scoreDelivery: project.scoreDelivery,
        scoreOperations: project.scoreOperations,
        scoreWhy: project.scoreWhy,
        javaServices: project.javaServices,
        netServices: project.netServices,
        collectionLink: project.collectionLink,
        trainingLink: project.trainingLink,
        collectionName: project.collectionName,
        trainingName: project.trainingName,
        trainingDoc: project.trainingDoc,
        testingRichtext: project.testingRichtext,
        templateCategory: project.templateCategory,
        dType: project.dType,
        dOption: project.dOption,
        dFilter: project.dFilter,
        dId: project.dId,
        tType: project.tType,
        tOption: project.tOption,
        tFilter: project.tFilter,
        tId: project.tId,
        risktype: project.risktype,
        riskimpact: project.riskimpact,
        riskprobability: project.riskprobability,
        projectInitiativeId: project.projectInitiativeId,
        projectBusinessgoalId: project.projectBusinessgoalId,
        projectSubgoalId: project.projectSubgoalId,
        projectMaingoalId: project.projectMaingoalId,
        projectBucketId: project.projectBucketId,
        projectCostCenterId: project.projectCostCenterId,
        opportunityPriorityId: project.opportunityPriorityId,
        backlogPractice: project.backlogPractice,
        projectTheme: project.projectTheme,
        projectClass: project.projectClass,
        projectVertical: project.projectVertical,
        projectBoardId: project.projectBoardId,
        projectBoard2Id: project.projectBoard2Id,
        projectStatusId: project.projectStatusId,
        projectTypeId: project.projectTypeId,
        projectLeadId: project.projectLeadId,
        parentId: project.parentId
      });

    }
  }

  projectSave() {
    var project: any = this.editForm.value;
    console.log(project);
    // var themes: IProjectTheme[] = this.projectTheme.filter(p => p.id == project.projectTheme);
    // project.projectTheme = themes[0];

    // var status: IProjectStatusId[] = this.projectStatusId.filter(p => p.id == project.projectStatusId);
    // project.projectStatusId = status[0];

    // var priority: IOpportunityPriorityId[] = this.opportunityPriorityId.filter(p => p.id == project.opportunityPriorityId);
    // project.opportunityPriorityId = priority[0];

    // var vertical: IProjectVertical[] = this.projectVertical.filter(p => p.id == project.projectVertical);
    // project.projectVertical = vertical[0];

    // var bucket: IProjectBucketId[] = this.projectBucketId.filter(p => p.id == project.projectBucketId);
    // project.projectBucketId = bucket[0];

    // var type: IProjectTypeId[] = this.projectTypeId.filter(p => p.id == project.projectTypeId);
    // project.projectTypeId = type[0];
    project.projectPath = this.editForm.value.projectName.substring(250);
    project.projectLeadId = this.activeEmp.id;
    // if (!project.startDate) {
    //   project.startDate = this.activeDate;
    // }
    console.log("this.", this.activeEmp);
    console.log("proj", JSON.stringify(project));
    if (project.id) {
      this.commonService.updateImProjects(project).subscribe((resp: any) => {
        //  this.projects[this.projects.indexOf(this.project)] = project;
        console.log("resp", resp);
        this.projectRefresh.emit(true);

      });
    } else {
      this.commonService.createImProjects(project).subscribe((resp: any) => {
        console.log(resp);
        var myEmplyee: any[] = [];
        myEmplyee.push(this.activeEmp);
        this.commonService.saveUser(myEmplyee, resp);

        this.editForm.reset();
        this.projectRefresh.emit(true);
      });
    }

    this.sidenav.closeNav();

  }
  closerisk() {
    this.sidenav.closeNav();
  }

}
