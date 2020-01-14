import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";

import { Router, ActivatedRoute } from "@angular/router";
import { ImProjects, IImProjects } from "src/app/models/im-projects.model";
import { IProjectTheme } from "src/app/models/project-theme.model";
import { IProjectStatusId } from "src/app/models/project-status-id.model";
import { IOpportunityPriorityId } from "src/app/models/opportunity-priority-id.model";
import { IProjectVertical } from "src/app/models/project-vertical.model";
import { IProjectBucketId } from "src/app/models/project-bucket-id.model";
import { IProjectTypeId } from "src/app/models/project-type-id.model";
import { IUser } from "src/app/models/user.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CommonService } from "src/app/services/common.service";
import { ImEmployee } from "src/app/models/im-employee.model";
import {
  IProjectAllocation,
  ProjectAllocation
} from "src/app/models/project-allocation.model";
import { SidenavService } from "src/app/services/sidenav.service";
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: "app-createtask",
  templateUrl: "./createtask.component.html",
  styleUrls: ["./createtask.component.css"]
})
export class CreatetaskComponent implements OnInit {
  @Output() taskRefresh = new EventEmitter<boolean>();
  @Input() selectedTask: ImProjects;
  @Input() selectedTitle: string;
  @Input() trackTitle: string;
  @Input() selectedId: number;

  opportunityPriorityId: IOpportunityPriorityId[];
  projectStatusId: IProjectStatusId[];
  projectTheme: IProjectTheme[];
  projectTypeId: IProjectTypeId[];
  projectVertical: IProjectVertical[];
  projectBucketId: IProjectBucketId[];
  user: IUser[];
  public range = { start: null, end: null };
  uploadSaveUrl = "saveUrl";
  uploadRemoveUrl = "removeUrl";
  projects: ImProjects[];
  myForm: FormGroup;
  myEmplyee: ImEmployee[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private commonService: CommonService,
    private sidenav: SidenavService,
    private toastr: ToastrService
  ) {
    this.myForm = this.fb.group({
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
  }

  ngOnInit() {
    // this.commonService.getAllImProjects().subscribe((projects: ImProjects[]) => {
    //   this.projects = projects;
    // });
    // this.trackTitle = this.selectedTitle;
    console.log("title", this.trackTitle);

    this.commonService
      .projectsType()
      .subscribe((projectType: IProjectTypeId[]) => {
        this.projectTypeId = projectType;
      });
    this.commonService
      .projectsBuckets()
      .subscribe((projectBuckets: IProjectBucketId[]) => {
        this.projectBucketId = projectBuckets;
      });
    this.commonService
      .projectsStatus()
      .subscribe((projectStatus: IProjectStatusId[]) => {
        this.projectStatusId = projectStatus;
      });
    this.commonService
      .projectsVerticals()
      .subscribe((projectsVerticals: IProjectVertical[]) => {
        this.projectVertical = projectsVerticals;
      });
    this.commonService
      .projectsTheme()
      .subscribe((projectsTheme: IProjectTheme[]) => {
        this.projectTheme = projectsTheme;
      });
    this.commonService
      .projectsPriority()
      .subscribe((projectsPriority: IOpportunityPriorityId[]) => {
        this.opportunityPriorityId = projectsPriority;
      });
    this.commonService.getAllImUsers().subscribe(users => {
      this.user = users;
    });
  }
  openUserModal(project) {
    this.sidenav.allocations = [];
    //this.sidenav.isUserModalProjectId = project;

  }
  taskSave() {
    var project: any = this.myForm.value;
    if (this.selectedTitle && this.selectedTitle != "Risk") {
      var status: IProjectStatusId[] = this.projectStatusId.filter(
        p => p.name == this.selectedTitle
      );
      if (status) {
        if (status.length > 0) {
          project.projectStatusId = status[0].id;
        }
      }

    }
    if (this.selectedId) {
      project.parentId = this.selectedId;
      this.sidenav.closeNav();

      this.commonService.createImProjects(project).subscribe(resp => {
        console.log("resp", resp);
        this.myEmplyee = this.sidenav.myEmployeeAddition;
        var user: ImEmployee[] = this.myEmplyee;
        this.commonService.saveUser(this.myEmplyee, resp);
        this.myEmplyee = [];
        this.sidenav.myEmployeeAddition = this.myEmplyee;
        this.taskRefresh.emit(true);
        this.toastr.success("Task Created Successfully!");
        this.myForm.reset();

      });
    } else if (this.selectedTask) {
      this.commonService.getProject(this.selectedTask.id).subscribe(resp => {
        project.parentId = resp;
        this.commonService.createImProjects(project).subscribe(resp => {
          console.log("resp", resp);
          var user: ImEmployee[] = this.myEmplyee;
          var allocation: IProjectAllocation;
          user.forEach(u => {
            allocation = new ProjectAllocation(0, 100, u, resp);
            this.commonService
              .createProjectsAllocation(allocation)
              .subscribe(resp => {
                console.log(resp);
                // this.taskRefresh.emit(true);
                $("#useradd").modal("hide");
                $("#useradd2").modal("hide");
                $("#useradd3").modal("hide");
                $("#userAddtask").modal("hide");
                $("#userAddSubTask").modal("hide");
              });
          });
          this.taskRefresh.emit(true);
          this.myForm.reset();
          this.sidenav.closeNav();

        });
      });
      // var parentId: IImProjects[] = this.projects.filter(p => p.id == this.selectedTask.id);
      // project.parentId = parentId[0];
    }
    else if (!this.selectedId) {
      project.parentId = null;
      this.commonService.createImProjects(project).subscribe(resp => {
        console.log("resp", resp);
        var user: ImEmployee[] = this.myEmplyee;
        var allocation: IProjectAllocation;
        user.forEach(u => {
          allocation = new ProjectAllocation(0, 100, u, resp);
          this.commonService
            .createProjectsAllocation(allocation)
            .subscribe(resp => {
              console.log(resp);
              // this.taskRefresh.emit(true);
              $("#useradd").modal("hide");
              $("#useradd2").modal("hide");
              $("#useradd3").modal("hide");
              $("#userAddtask").modal("hide");
              $("#userAddSubTask").modal("hide");
            });
        });
        this.taskRefresh.emit(true);
        this.myForm.reset();
      });
    }
  }
  sendUser($event) {
    this.myEmplyee = $event;
    console.log("respgh", this.myEmplyee);
    $("#userAddtask").modal("hide");
  }
  closetask() {
    this.sidenav.closeNav();
  }
  close() {
    this.sidenav.closeNav();
    this.myForm.reset();
    this.selectedTask = null;
  }
}
