import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { IProjectTheme } from 'src/app/models/project-theme.model';
import { IOpportunityPriorityId } from 'src/app/models/opportunity-priority-id.model';
import { IProjectStatusId } from 'src/app/models/project-status-id.model';
import { IProjectTypeId } from 'src/app/models/project-type-id.model';
import { IProjectVertical } from 'src/app/models/project-vertical.model';
import { IProjectBucketId } from 'src/app/models/project-bucket-id.model';
import { IUser } from 'src/app/models/user.model';
import { ImProjects, IImProjects } from 'src/app/models/im-projects.model';
import { ImEmployee } from 'src/app/models/im-employee.model';
import { ProjectAllocation, IProjectAllocation } from 'src/app/models/project-allocation.model';
import { SidenavService } from 'src/app/services/sidenav.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-createproject',
  templateUrl: './createproject.component.html',
  styleUrls: ['./createproject.component.css']
})
export class CreateprojectComponent implements OnInit, OnChanges {

  // Send Output to parent component
  @Input() updateProject: ImProjects;
  //  @Input() flagUpdate: boolean;

  @Output() projectRefresh = new EventEmitter<boolean>();
  //@Output() userRefresh = new EventEmitter<boolean>();
  newTodo: string;
  todos: any[] = [];
  todoObj: any;

  selectedProject: ImProjects;
  editProject: IImProjects[];
  opportunityPriorityId: IOpportunityPriorityId[];
  projectStatusId: IProjectStatusId[];
  projectTheme: IProjectTheme[];
  projectTypeId: IProjectTypeId[];
  projectVertical: IProjectVertical[];
  projectBucketId: IProjectBucketId[];
  user: IUser[];
  public range = { start: null, end: null };
  uploadSaveUrl = 'saveUrl';
  uploadRemoveUrl = 'removeUrl';
  projects: ImProjects[] = [];
  myForm: FormGroup;
  editForm: FormGroup;
  globalProject: any;
  myEmplyee: ImEmployee[] = [];
  project: ImProjects;
  activeEmp: any;
  flagUpdate: boolean = true;
  activeDate: moment.Moment;
  userModelflag: number;

  projectNr = (new Date()).getFullYear() + "_" + Math.floor(1000 + Math.random() * 9000);
  constructor(private router: Router, private fb: FormBuilder, private commonService: CommonService, private sidenav: SidenavService) {

    this.activeDate = moment(new Date());
    this.myForm = this.fb.group({
      id: [],
      projectName: ['', Validators.required],
      projectNr: [''],
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
      risktype: [],
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

    this.newTodo = '';
    this.todos = [];
  }

  // addTodo() {
  //   console.log();
  //   this.todoObj = { newTodo: this.newTodo, completed: false }
  //   this.todos.push(this.todoObj);
  //   this.newTodo = 'value';
  //   // event.preventDefault();

  // }
  ngOnChanges() {
    console.log("up", this.updateProject);
    if (this.updateProject == null) {
      this.myForm.reset();
      this.flagUpdate = true;
    }
    else if (this.updateProject) {
      this.flagUpdate = false;
      this.project;
      this.commonService.getProject(this.updateProject.id).subscribe((project: any) => {
        this.project = project;
        console.log("proj", this.project);

        // var myallocations: any[] = [];
        // if (project.allocationRecord) {
        //   myallocations = JSON.parse(project.allocationRecord);
        //   console.log("myallocations", myallocations);
        // }
        // if (myallocations == null) {
        //   myallocations = [];
        // }
        // project.allocationTable = myallocations;
        // this.projects.push(project);

        // console.log("this", this.projects);

        this.myForm.patchValue({
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
          projectInitiativeId: project.projectInitiativeId ? project.projectInitiativeId.id : null,
          projectBusinessgoalId: project.projectBusinessgoalId ? project.projectBusinessgoalId.id : null,
          projectSubgoalId: project.projectSubgoalId ? project.projectSubgoalId.id : null,
          projectMaingoalId: project.projectMaingoalId ? project.projectMaingoalId.id : null,
          projectBucketId: project.projectBucketId ? project.projectBucketId.id : null,
          projectCostCenterId: project.projectCostCenterId ? project.projectCostCenterId.id : null,
          opportunityPriorityId: project.opportunityPriorityId ? project.opportunityPriorityId.id : null,
          backlogPractice: project.backlogPractice ? project.backlogPractice.id : null,
          projectTheme: project.projectTheme ? project.projectTheme.id : null,
          projectClass: project.projectClass ? project.projectClass.id : null,
          projectVertical: project.projectVertical ? project.projectVertical.id : null,
          projectBoardId: project.projectBoardId ? project.projectBoardId.id : null,
          projectBoard2Id: project.projectBoard2Id ? project.projectBoard2Id.id : null,
          projectStatusId: project.projectStatusId ? project.projectStatusId.id : null,
          projectTypeId: project.projectTypeId ? project.projectTypeId.id : null,
          projectLeadId: project.projectLeadId ? project.projectLeadId.id : null,
          parentId: project.parentId ? project.parentId.id : null
        });
      });
    }
  }
  ngOnInit() {
    this.activeEmp = this.commonService.getEmployeDetails();
    // console.log("activeEmp", this.activeEmp);

    // this.flagUpdate = true;

    this.commonService.projectsType().subscribe((projectType: IProjectTypeId[]) => {
      this.projectTypeId = projectType;
    });
    this.commonService.projectsBuckets().subscribe((projectBuckets: IProjectBucketId[]) => {
      this.projectBucketId = projectBuckets;
    });
    this.commonService.projectsStatus().subscribe((projectStatus: IProjectStatusId[]) => {
      this.projectStatusId = projectStatus;
    });
    this.commonService.projectsVerticals().subscribe((projectsVerticals: IProjectVertical[]) => {
      this.projectVertical = projectsVerticals;
    });
    this.commonService.projectsTheme().subscribe((projectsTheme: IProjectTheme[]) => {
      this.projectTheme = projectsTheme;
    });
    this.commonService.projectsPriority().subscribe((projectsPriority: IOpportunityPriorityId[]) => {
      this.opportunityPriorityId = projectsPriority;
    });
    this.commonService.getAllImUsers().subscribe((users) => {
      this.user = users;
    });

    $('.drop-menu').on('click', function (event) {
      event.stopPropagation();
    });

  }

  userRefresh($event) {
    this.myEmplyee = $event;
    $("#useradd2").modal("hide");
  }
  openUserModal(project) {
    this.sidenav.isUserModalProjectId = project;

    console.log("1", this.sidenav.isUserModalProjectId);
    if (project) {

      if (project.allocationRecord) {
        // this.sidenav.populateAllocation();
        this.sidenav.allocations = JSON.parse(project.allocationRecord);
      }
      if (project.allocationrecord) {
        this.sidenav.allocations = JSON.parse(project.allocationrecord);
      }
      this.userModelflag = project.id;

      // this.sidenav[projectId.toString()] = true;
    }
    else {
      this.sidenav.allocations = [];

    }
    console.log("side", this.sidenav.allocations);

  }
  projectSave(goTask) {
    var project: ImProjects = this.myForm.value;
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
    project.projectPath = this.myForm.value.projectName.substring(250);
    project.projectNr = this.projectNr.substring(250);
    project.projectLeadId = this.activeEmp.id;
    // if (!project.startDate) {
    //   project.startDate = this.activeDate;
    // }
    console.log("this.", this.activeEmp);
    console.log("proj", JSON.stringify(project));

    this.commonService.createImProjects(project).subscribe((resp: any) => {
      console.log(resp);
      this.selectedProject = resp;
      this.myEmplyee = this.sidenav.myEmployeeAddition;

      if (this.myEmplyee.length == 0) {
        this.myEmplyee.push(this.activeEmp);
      }
      this.commonService.saveUser(this.myEmplyee, resp);
      this.myEmplyee = [];
      this.sidenav.myEmployeeAddition = this.myEmplyee;
      this.projects.push(resp);
      if (goTask) {
        this.router.navigate(["/task", resp.id]);
      } else {
        this.projectRefresh.emit(true);
      }
      this.flagUpdate = !this.flagUpdate;

      this.myForm.reset();
    });
    this.sidenav.closeNav();

  }
  projectUpdate() {
    // var obj: IImProjects = this.myForm.value;

    var project: ImProjects = this.myForm.value;
    console.log("project", project);

    // var themes: IProjectTheme[] = this.projectTheme.filter(p => p.id == project.projectTheme);
    // this.project.projectTheme = themes[0];

    // var status: IProjectStatusId[] = this.projectStatusId.filter(p => p.id == project.projectStatusId);
    // this.project.projectStatusId = status[0];

    // var priority: IOpportunityPriorityId[] = this.opportunityPriorityId.filter(p => p.id == project.opportunityPriorityId);
    // this.project.opportunityPriorityId = priority[0];

    // var vertical: IProjectVertical[] = this.projectVertical.filter(p => p.id == project.projectVertical);
    // this.project.projectVertical = vertical[0];

    // var bucket: IProjectBucketId[] = this.projectBucketId.filter(p => p.id == project.projectBucketId);
    // this.project.projectBucketId = bucket[0];

    // var type: IProjectTypeId[] = this.projectTypeId.filter(p => p.id == project.projectTypeId);
    // this.project.projectTypeId = type[0];
    // this.project.projectPath = this.myForm.value.projectName;
    // this.project.projectNr = this.myForm.value.projectNr;
    // this.project.projectName = this.myForm.value.projectName;
    // this.project.description = this.myForm.value.description;
    // this.project.startDate = this.myForm.value.startDate;
    // this.project.endDate = this.myForm.value.endDate;
    // this.project.projectBudgetHours = this.myForm.value.projectBudgetHours;
    // this.project.projectBudget = this.myForm.value.projectBudget;

    console.log("obj", JSON.stringify(project));
    this.commonService.updateImProjects(project).subscribe((resp: any) => {
      //  this.projects[this.projects.indexOf(this.project)] = project;
      console.log("resp", resp);
      this.projectRefresh.emit(true);
      this.flagUpdate = !this.flagUpdate;

    });
    this.sidenav.closeNav();

  }
  userAdd() {
    $("#useradd2").modal("show");
  }
  outerHide() {
    event.stopPropagation();
  }
  // closeUpdate() {
  //   $("#createproject").modal("hide");
  //   this.myForm.reset();
  // }
  close() {
    this.sidenav.closeNav();
    $("#createproject").modal("hide");
    this.myForm.reset();
    this.updateProject = null
  }
}
