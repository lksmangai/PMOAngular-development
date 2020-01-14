import { Component, OnInit, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Track, Task } from "../../track-module";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import { CommonService } from "src/app/services/common.service";
import { ImProjects, IImProjects } from "src/app/models/im-projects.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IKanbanTask } from "src/app/models/kanbanTask";
import { IProjectStatusId } from "src/app/models/project-status-id.model";
import { IOpportunityPriorityId } from "src/app/models/opportunity-priority-id.model";
import { IProjectTheme } from "src/app/models/project-theme.model";
import { IProjectTypeId } from "src/app/models/project-type-id.model";
import { IProjectVertical } from "src/app/models/project-vertical.model";
import { IProjectBucketId } from "src/app/models/project-bucket-id.model";
import { DATE_TIME_FORMAT, DATE_FORMAT } from "src/app/models/input.constants";
import {
  IProjectAllocation,
  ProjectAllocation
} from "src/app/models/project-allocation.model";
import { ImEmployee } from "src/app/models/im-employee.model";
import { IUser } from "src/app/models/user.model";
import { sampleData, completed } from "src/app/data";
import { IImTimesheet, ImTimesheet } from "src/app/models/im-timesheet.model";
import * as moment from "moment";
import { SidenavService } from "src/app/services/sidenav.service";
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare var kendo: any;
declare var require: any;

@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.css"]
})
export class TaskComponent implements OnInit {
  public loading = false;
  private tracks: IKanbanTask[] = require("src/app/task.json");
  trackTitle: string = "In-Progress";
  public tableData: any[] = sampleData;
  public completeData: any[] = completed;
  selectedProjectId: any = null;
  id: number;
  activetab: string = "inProgress";
  //private tracks: ImProjects[];
  public viewtype = "list";
  projectStatusId: IProjectStatusId[];
  opportunityPriorityId: IOpportunityPriorityId[];
  projectTheme: IProjectTheme[];
  projectTypeId: IProjectTypeId[];
  projectVertical: IProjectVertical[];
  projectBucketId: IProjectBucketId[];
  projects: any[] = [];
  project: IImProjects = null;
  subTask: ImProjects = null;
  timesheet: any[] = [];
  allProjects: ImProjects[] = [];
  allProjectsDataSource: ImProjects[] = [];

  tasks: ImProjects[];
  public selectedProject: ImProjects;
  public selectedTask: ImProjects[] = [];
  selectedTitle: any;
  selectedId: any;
  flag_add: boolean = true;
  listItems = ["List 1", "List 2", "List 3"];
  checked: boolean = true;
  myEmplyee: ImEmployee[] = [];
  isChecked: boolean;
  activeUser: IUser;
  employee: ImEmployee[];
  activeEmp: ImEmployee;
  activeUserProjects: ImProjects[] = [];
  allocationCount: any;
  activeDate: moment.Moment;

  userModelflag: number;
  editForm: FormGroup;
  quickTaskForm: FormGroup;
  public defaultItem: { projectName: string; id: number } = {
    projectName: "Select project...",
    id: null
  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private fb: FormBuilder,
    private sidenav: SidenavService,
    private toastr: ToastrService
  ) {
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
    this.activeDate = moment(new Date());
    this.activeEmp = this.commonService.getEmployeDetails();
    const id = parseInt(this.route.snapshot.paramMap.get("id"));
    // this.selectedProject.id = id;
    //  console.log("id", id);

    if (id) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
    this.activeUser = JSON.parse(sessionStorage.getItem("newUser"));
    this.commonService
      .getEmpProject(this.activeEmp.id)
      .subscribe((projects: any[]) => {
        this.activeUserProjects = []
        for (var i = 0; i < projects.length; i++) {
          if (
            projects[i].projectStatusName != "Backlog" &&
            projects[i].projectStatusName != "Not For Tracking" &&
            !projects[i].risktype
          ) {
            this.activeUserProjects.push(projects[i]);
          }
        }
        this.activeUserProjects.sort((a, b) => a.projectName.localeCompare(b.projectName));

        this.projectsAll();
      });
    this.commonService.getAllMainProjects().subscribe((projects: any[]) => {
      this.projects = [];
      for (var i = 0; i < projects.length; i++) {
        if (
          projects[i].projectStatusName != "Backlog" &&
          projects[i].projectStatusName != "Not For Tracking" &&
          !projects[i].risktype
        ) {
          this.projects.push(projects[i]);
        }
      }
      this.projects.sort((a, b) => a.projectName.localeCompare(b.projectName));

      this.projectsAll();
    });
    //  const id = parseInt(this.route.snapshot.paramMap.get("id"));
    if (id) {
      this.commonService.getProject(id).subscribe(resp => {
        this.defaultItem.projectName = resp.projectName;
        this.defaultItem.id = resp.id;
        this.selectedProject = resp;
      });
    }
    this.commonService
      .projectsStatus()
      .subscribe((projectStatus: IProjectStatusId[]) => {
        this.projectStatusId = projectStatus;
      });
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

    $(document).ready(function () {
      // setTimeout(function(){
      var serviceRoot = "https://demos.telerik.com/kendo-ui/service";
      var tasksDataSource = new kendo.data.GanttDataSource({
        transport: {
          read: {
            url: serviceRoot + "/GanttTasks",
            dataType: "jsonp"
          },
          update: {
            url: serviceRoot + "/GanttTasks/Update",
            dataType: "jsonp"
          },
          destroy: {
            url: serviceRoot + "/GanttTasks/Destroy",
            dataType: "jsonp"
          },
          create: {
            url: serviceRoot + "/GanttTasks/Create",
            dataType: "jsonp"
          },
          parameterMap: function (options, operation) {
            if (operation !== "read") {
              return { models: kendo.stringify(options.models || [options]) };
            }
          }
        },
        schema: {
          model: {
            id: "id",
            fields: {
              id: { from: "ID", type: "number" },
              orderId: {
                from: "OrderID",
                type: "number",
                validation: { required: true }
              },
              parentId: {
                from: "ParentID",
                type: "number",
                defaultValue: null,
                validation: { required: true }
              },
              start: { from: "Start", type: "date" },
              end: { from: "End", type: "date" },
              title: { from: "Title", defaultValue: "", type: "string" },
              percentComplete: { from: "PercentComplete", type: "number" },
              summary: { from: "Summary", type: "boolean" },
              expanded: {
                from: "Expanded",
                type: "boolean",
                defaultValue: true
              }
            }
          }
        }
      });

      var dependenciesDataSource = new kendo.data.GanttDependencyDataSource({
        transport: {
          read: {
            url: serviceRoot + "/GanttDependencies",
            dataType: "jsonp"
          },
          update: {
            url: serviceRoot + "/GanttDependencies/Update",
            dataType: "jsonp"
          },
          destroy: {
            url: serviceRoot + "/GanttDependencies/Destroy",
            dataType: "jsonp"
          },
          create: {
            url: serviceRoot + "/GanttDependencies/Create",
            dataType: "jsonp"
          },
          parameterMap: function (options, operation) {
            if (operation !== "read") {
              return { models: kendo.stringify(options.models || [options]) };
            }
          }
        },
        schema: {
          model: {
            id: "id",
            fields: {
              id: { from: "ID", type: "number" },
              predecessorId: { from: "PredecessorID", type: "number" },
              successorId: { from: "SuccessorID", type: "number" },
              type: { from: "Type", type: "number" }
            }
          }
        }
      });

      var gantt = $("#gantt")
        .kendoGantt({
          dataSource: tasksDataSource,
          dependencies: dependenciesDataSource,
          views: ["day", { type: "week", selected: true }, "month"],
          columns: [
            { field: "id", title: "ID", width: 60 },
            { field: "title", title: "Title", editable: true, sortable: true },
            {
              field: "start",
              title: "Start Time",
              format: "{0:MM/dd/yyyy}",
              width: 100,
              editable: true,
              sortable: true
            },
            {
              field: "end",
              title: "End Time",
              format: "{0:MM/dd/yyyy}",
              width: 100,
              editable: true,
              sortable: true
            }
          ],
          height: 700,

          showWorkHours: false,
          showWorkDays: false,

          snap: false
        })
        .data("kendoGantt");

      $(document).bind("kendo:skinChange", function () {
        gantt.refresh();
      });
      //  },
      //  5000);
    });

    this.commonService.getTimesheetByEmpIdAndLogday(moment(this.activeDate).format("YYYY-MM-DD"), this.activeEmp.id).subscribe((timesheet) => {
      console.log("t", timesheet);
      this.timesheet = timesheet;
    });
  }
  refreshKanban() {

    if (this.selectedProject) {
      this.loading = true;
    }
    this.projectsAll();
  }
  projectsAll() {
    if (!this.isChecked) {
      this.allProjects = this.activeUserProjects;
      this.allProjectsDataSource = this.allProjects;
    } else if (this.isChecked) {
      this.allProjects = this.projects;
      this.allProjectsDataSource = this.allProjects;
    }
    this.task();
  }
  outerHide() {
    event.stopPropagation();
  }

  setviewtype(type) {
    this.viewtype = type;
  }

  get trackIds(): string[] {
    return this.tracks.map(track => track.id);
  }

  onTalkDrop(event: CdkDragDrop<ImProjects[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      if (event) {
        if (event.container.data) {
          var improject: any = event.container.data[event.currentIndex];
          //this.project = improject;
          //this.commonService.getProject(improject.id).subscribe(resp => {
          //  this.project = resp;
          // console.log("", this.project);
          if (event.container.id != "Risk") {
            var status: IProjectStatusId[] = this.projectStatusId.filter(
              p => p.name == event.container.id
            );
            if (status) {
              if (status.length > 0) {
                improject.projectStatusId = status[0].id;
              }
            }
          } else {
            if (!improject.risktype) {
              improject.risktype = "Risk";
            }
          }


          this.commonService
            .updateImProjects(improject)
            .subscribe((resp: any) => {
              //   this.projects[this.projects.indexOf(this.project)] = improject;
              console.log("resp", resp);
            });
          // });
        }
      }

      // for (var i = 0; i < event.previousContainer.data.length; i++){

      //   if(event.previousContainer.data[i].)
      // }
      // this.commonService.updateImProjects().subscribe(() => {
      // });
    }
  }

  onTrackDrop(event: CdkDragDrop<Track[]>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
  public handleFilter(value) {
    this.allProjects = this.allProjectsDataSource.filter(
      s => s.projectName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  public selectionChange(value: any): void {
    this.selectedProject = value;
    this.loading = true;
    this.projectsAll();
    // this.router.navigate([
    //   "/task/completed",
    //   this.selectedProject.id,
    //   "inProgress"
    // ]);

    // this.task();
  }

  task() {
    this.commonService.getTimesheetByEmpIdAndLogday(moment(this.activeDate).format("YYYY-MM-DD"), this.activeEmp.id).subscribe((timesheet) => {
      this.timesheet = timesheet;
    });
    for (var i = 0; i < this.tracks.length; i++) {
      this.tracks[i].tasks = [];
    }
    if (this.selectedProject == null) {
      return this.tracks;
    }
    // console.log("id", this.selectedProject.id);
    // getAllTaskByParentId getProjectByParentId


    // this.commonService
    //   .getchildProject(this.selectedProject.id)
    //   .subscribe(projects => {
    this.commonService
      .getAllTaskByParentId(this.selectedProject.id)
      .subscribe(projects => {
        // console.log("proj", projects);

        for (var i = 0; i < projects.length; i++) {
          var data: any = projects[i];
          // if (data.parentId) {
          // if (data.parentId.id == this.selectedProject.id) {
          if (data.parentId == this.selectedProject.id || data.milestoneP) {


            if (data.risktype) {
              for (var k = 0; k < this.timesheet.length; k++) {
                if (this.timesheet[k].imProjectsId == projects[i].id) {
                  projects[i].loghours = this.timesheet[k].loghours;
                  break;
                }
              }
              this.tracks[5].tasks.push(projects[i]);
            }
            else {
              if (data.projectStatusName == "Backlog") {
                var myallocations: any[] = [];
                if (projects[i].allocationRecord) {
                  myallocations = JSON.parse(projects[i].allocationRecord);
                }
                if (myallocations) {
                  if (myallocations.length == 1) {
                    if (!myallocations[0].id) {
                      myallocations = [];
                    }
                  }
                }
                if (myallocations == null) {
                  myallocations = [];
                }
                projects[i].allocationTable = myallocations;
                // this.projects.push(projects[i]);


                for (var k = 0; k < this.timesheet.length; k++) {
                  if (this.timesheet[k].imProjectsId == projects[i].id) {
                    projects[i].loghours = this.timesheet[k].loghours;
                    break;
                  }
                }
                this.tracks[0].tasks.push(projects[i]);
              } else if (
                data.projectStatusName == "Implementation" ||
                data.projectStatusName == "In-Progress" ||
                data.projectStatusName == "On Going" ||
                data.projectStatusName == "Rolling Out" ||
                data.projectStatusName == "Inception" ||
                data.projectStatusName == "Coding&DailyTesting" ||
                data.projectStatusName == "Ready For Release" ||
                data.projectStatusName == "Pending3rdParty" ||
                data.projectStatusName == "PendingCustomer" ||
                data.projectStatusName == "Not For Tracking"
              ) {
                var myallocations: any[] = [];
                if (projects[i].allocationRecord) {
                  myallocations = JSON.parse(projects[i].allocationRecord);
                }
                if (myallocations) {
                  if (myallocations.length == 1) {
                    if (!myallocations[0].id) {
                      myallocations = [];
                    }
                  }
                }
                if (myallocations == null) {
                  myallocations = [];
                }
                projects[i].allocationTable = myallocations;
                for (var k = 0; k < this.timesheet.length; k++) {
                  if (this.timesheet[k].imProjectsId == projects[i].id) {
                    projects[i].loghours = this.timesheet[k].loghours;
                    break;
                  }
                }
                this.tracks[2].tasks.push(projects[i]);
              } else if (
                data.projectStatusName == "Closed" ||
                data.projectStatusName == "Closing Out" ||
                data.projectStatusName == "Completed"
              ) {
                var myallocations: any[] = [];
                if (projects[i].allocationRecord) {
                  myallocations = JSON.parse(projects[i].allocationRecord);
                }
                if (myallocations) {
                  if (myallocations.length == 1) {
                    if (!myallocations[0].id) {
                      myallocations = [];
                    }
                  }
                }
                if (myallocations == null) {
                  myallocations = [];
                }
                projects[i].allocationTable = myallocations;

                for (var k = 0; k < this.timesheet.length; k++) {
                  if (this.timesheet[k].imProjectsId == projects[i].id) {
                    projects[i].loghours = this.timesheet[k].loghours;
                    break;
                  }
                }
                this.tracks[3].tasks.push(projects[i]);
              } else if (
                data.projectStatusName == "On Hold" ||
                data.projectStatusName == "Deferred"
              ) {
                var myallocations: any[] = [];
                if (projects[i].allocationRecord) {
                  myallocations = JSON.parse(projects[i].allocationRecord);
                }
                if (myallocations) {
                  if (myallocations.length == 1) {
                    if (!myallocations[0].id) {
                      myallocations = [];
                    }
                  }
                }
                if (myallocations == null) {
                  myallocations = [];
                }
                projects[i].allocationTable = myallocations;
                for (var k = 0; k < this.timesheet.length; k++) {
                  if (this.timesheet[k].imProjectsId == projects[i].id) {
                    projects[i].loghours = this.timesheet[k].loghours;
                    break;
                  }
                }
                this.tracks[4].tasks.push(projects[i]);
              } else {
                var myallocations: any[] = [];
                if (projects[i].allocationRecord) {
                  myallocations = JSON.parse(projects[i].allocationRecord);
                }
                if (myallocations) {
                  if (myallocations.length == 1) {
                    if (!myallocations[0].id) {
                      myallocations = [];
                    }
                  }
                }
                if (myallocations == null) {
                  myallocations = [];
                }
                projects[i].allocationTable = myallocations;
                for (var k = 0; k < this.timesheet.length; k++) {
                  if (this.timesheet[k].imProjectsId == projects[i].id) {
                    projects[i].loghours = this.timesheet[k].loghours;
                    break;
                  }
                }
                this.tracks[1].tasks.push(projects[i]);
              }
            }
          }
        }
        // console.log("track", this.tracks);
        this.loading = false;

        return this.tracks;
      });
  }

  createTask() {
    // $("#createtask").modal("show");
    this.sidenav.openNav();
    const id = parseInt(this.route.snapshot.paramMap.get("id"));

    this.selectedId = id;
  }
  closetasknav() {
    this.sidenav.closeNav();
  }
  createtaskBottom(project) {
    this.sidenav.openNav();
    // $("#createtask").modal("show");
    //  this.trackTitle=
    this.selectedTitle = project.title;
    this.trackTitle = project.title;
    this.selectedId = this.selectedProject.id;
  }
  subTaskAdd(title) {
    $("#taskAdd").modal("show");
    this.flag_add = false;
    this.subTask = title;
    this.editForm = this.fb.group({
      id: [],
      projectName: [""],
      projectNr: [""],
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
  sendUser($event) {
    this.myEmplyee = $event;
    $("#userAddSubTask").modal("hide");
  }
  saveSubTask() {
    var obj: any = this.editForm.value;
    //if (this.project.projectStatusId) {
    if (this.trackTitle != "Risk") {
      var status: IProjectStatusId[] = this.projectStatusId.filter(
        p => p.name == this.trackTitle
      );
      if (status) {
        if (status.length > 0) {
          obj.projectStatusId = status[0].id;
        }
      }

    }


    //}

    // var themes: IProjectTheme[] = this.projectTheme.filter(p => p.id == obj.projectTheme);
    // obj.projectTheme = themes[0];

    // var priority: IOpportunityPriorityId[] = this.opportunityPriorityId.filter(p => p.id == obj.opportunityPriorityId);
    // obj.opportunityPriorityId = priority[0];

    // var vertical: IProjectVertical[] = this.projectVertical.filter(p => p.id == obj.projectVertical);
    // obj.projectVertical = vertical[0];

    // var bucket: IProjectBucketId[] = this.projectBucketId.filter(p => p.id == obj.projectBucketId);
    // obj.projectBucketId = bucket[0];

    // var type: IProjectTypeId[] = this.projectTypeId.filter(p => p.id == obj.projectTypeId);
    // obj.projectTypeId = type[0];

    // var parentId: IImProjects[] = this.allProjects.filter(
    //   p => p.id == this.subTask.id
    // );

    //  this.commonService.getProject(this.subTask.id).subscribe((resp) => {

    //  console.log(resp);
    if (!obj.projectVertical) {
      obj.projectVertical = this.project.projectVertical;
    }
    obj.parentId = this.subTask.id;
    obj.projectNr = this.editForm.value.projectName;
    obj.projectPath = this.editForm.value.projectName;
    console.log("obj", obj);

    this.commonService.createImProjects(obj).subscribe((resp: any) => {
      this.commonService.saveUser(this.myEmplyee, resp);
      this.projectsAll();
      console.log("resp", resp);
      $("#taskAdd").modal("hide");
      this.editForm.reset();
    });
    // });
  }

  showSubTask(task) {
    var allSubTask: ImProjects[] = [];
    // console.log("id", this.allProjects);

    for (var i = 0; i < this.allProjects.length; i++) {
      // console.log("id", this.allProjects[i]);

      if (this.allProjects[i].parentId) {
        if (this.allProjects[i].parentId.id == task.id) {
          allSubTask.push(this.allProjects[i]);
        }
      }
    }
    return allSubTask;
  }
  editTask(project: any, title: string) {
    console.log("editTask", project);
    this.trackTitle = title;
    $("#taskAdd").modal("show");
    this.flag_add = true;
    this.project = project;
    this.commonService.getProject(project.id).subscribe((imProjects) => {
      this.editForm.patchValue({
        id: imProjects.id,
        projectName: imProjects.projectName,
        projectNr: imProjects.projectNr,
        projectPath: imProjects.projectPath,
        treeSortkey: imProjects.treeSortkey,
        maxChildSortkey: imProjects.maxChildSortkey,
        description: imProjects.description,
        billingTypeId: imProjects.billingTypeId,
        note: imProjects.note,
        requiresReportP: imProjects.requiresReportP,
        projectBudget: imProjects.projectBudget,
        projectRisk: imProjects.projectRisk,
        corporateSponsor: imProjects.corporateSponsor,
        percentCompleted: imProjects.percentCompleted,
        projectBudgetHours: imProjects.projectBudgetHours,
        costQuotesCache: imProjects.costQuotesCache,
        costInvoicesCache: imProjects.costInvoicesCache,
        costTimesheetPlannedCache: imProjects.costTimesheetPlannedCache,
        costPurchaseOrdersCache: imProjects.costPurchaseOrdersCache,
        costBillsCache: imProjects.costBillsCache,
        costTimesheetLoggedCache: imProjects.costTimesheetLoggedCache,
        endDate:
          imProjects.endDate != null
            ? new Date(imProjects.endDate.toString())
            : null,
        startDate:
          imProjects.startDate != null
            ? new Date(imProjects.startDate.toString())
            : null,
        templateP: imProjects.templateP,
        sortOrder: imProjects.sortOrder,
        reportedHoursCache: imProjects.reportedHoursCache,
        costExpensePlannedCache: imProjects.costExpensePlannedCache,
        costExpenseLoggedCache: imProjects.costExpenseLoggedCache,
        confirmDate:
          imProjects.confirmDate != null
            ? new Date(imProjects.confirmDate.toString())
            : null,
        costDeliveryNotesCache: imProjects.costDeliveryNotesCache,
        costCacheDirty:
          imProjects.costCacheDirty != null
            ? new Date(imProjects.costCacheDirty.toString())
            : null,
        milestoneP: imProjects.milestoneP,
        releaseItemP: imProjects.releaseItemP,
        presalesProbability: imProjects.presalesProbability,
        presalesValue: imProjects.presalesValue,
        reportedDaysCache: imProjects.reportedDaysCache,
        presalesValueCurrency: imProjects.presalesValueCurrency,
        opportunitySalesStageId: imProjects.opportunitySalesStageId,
        opportunityCampaignId: imProjects.opportunityCampaignId,
        scoreRevenue: imProjects.scoreRevenue,
        scoreStrategic: imProjects.scoreStrategic,
        scoreFinanceNpv: imProjects.scoreFinanceNpv,
        scoreCustomers: imProjects.scoreCustomers,
        scoreFinanceCost: imProjects.scoreFinanceCost,
        costBillsPlanned: imProjects.costBillsPlanned,
        costExpensesPlanned: imProjects.costExpensesPlanned,
        scoreRisk: imProjects.scoreRisk,
        scoreCapabilities: imProjects.scoreCapabilities,
        scoreEinanceRoi: imProjects.scoreEinanceRoi,
        projectUserwiseBoard: imProjects.projectUserwiseBoard,
        projectBringNextday: imProjects.projectBringNextday,
        projectBringSameboard: imProjects.projectBringSameboard,
        projectNewboardEverytime: imProjects.projectNewboardEverytime,
        projectUserwiseBoard2: imProjects.projectUserwiseBoard2,
        projectBringSameboard2: imProjects.projectBringSameboard2,
        projectNewboard2Everytime: imProjects.projectNewboard2Everytime,
        projectNewboard2Always: imProjects.projectNewboard2Always,
        projectReportWeekly: imProjects.projectReportWeekly,
        scoreGain: imProjects.scoreGain,
        scoreLoss: imProjects.scoreLoss,
        scoreDelivery: imProjects.scoreDelivery,
        scoreOperations: imProjects.scoreOperations,
        scoreWhy: imProjects.scoreWhy,
        javaServices: imProjects.javaServices,
        netServices: imProjects.netServices,
        collectionLink: imProjects.collectionLink,
        trainingLink: imProjects.trainingLink,
        collectionName: imProjects.collectionName,
        trainingName: imProjects.trainingName,
        trainingDoc: imProjects.trainingDoc,
        testingRichtext: imProjects.testingRichtext,
        templateCategory: imProjects.templateCategory,
        dType: imProjects.dType,
        dOption: imProjects.dOption,
        dFilter: imProjects.dFilter,
        dId: imProjects.dId,
        tType: imProjects.tType,
        tOption: imProjects.tOption,
        tFilter: imProjects.tFilter,
        tId: imProjects.tId,
        risktype: imProjects.risktype,
        riskimpact: imProjects.riskimpact,
        riskprobability: imProjects.riskprobability,
        projectInitiativeId: imProjects.projectInitiativeId
          ? imProjects.projectInitiativeId.id
          : null,
        projectBusinessgoalId: imProjects.projectBusinessgoalId
          ? imProjects.projectBusinessgoalId.id
          : null,
        projectSubgoalId: imProjects.projectSubgoalId
          ? imProjects.projectSubgoalId.id
          : null,
        projectMaingoalId: imProjects.projectMaingoalId
          ? imProjects.projectMaingoalId.id
          : null,
        projectBucketId: imProjects.projectBucketId
          ? imProjects.projectBucketId.id
          : null,
        projectCostCenterId: imProjects.projectCostCenterId
          ? imProjects.projectCostCenterId.id
          : null,
        opportunityPriorityId: imProjects.opportunityPriorityId
          ? imProjects.opportunityPriorityId.id
          : null,
        backlogPractice: imProjects.backlogPractice
          ? imProjects.backlogPractice.id
          : null,
        projectTheme: imProjects.projectTheme ? imProjects.projectTheme.id : null,
        projectClass: imProjects.projectClass ? imProjects.projectClass.id : null,
        projectVertical: imProjects.projectVertical
          ? imProjects.projectVertical.id
          : null,
        projectBoardId: imProjects.projectBoardId
          ? imProjects.projectBoardId.id
          : null,
        projectBoard2Id: imProjects.projectBoard2Id
          ? imProjects.projectBoard2Id.id
          : null,
        projectStatusId: imProjects.projectStatusId
          ? imProjects.projectStatusId.id
          : null,
        projectTypeId: imProjects.projectTypeId
          ? imProjects.projectTypeId.id
          : null,
        projectLeadId: imProjects.projectLeadId
          ? imProjects.projectLeadId.id
          : null,
        parentId: imProjects.parentId ? imProjects.parentId.id : null
      });
    });

  }
  editSubTask(imProjects: ImProjects) {
    $("#taskAdd").modal("show");
    this.flag_add = true;
    this.project = imProjects;
    this.editForm.patchValue({
      id: imProjects.id,
      projectName: imProjects.projectName,
      projectNr: imProjects.projectNr,
      projectPath: imProjects.projectPath,
      treeSortkey: imProjects.treeSortkey,
      maxChildSortkey: imProjects.maxChildSortkey,
      description: imProjects.description,
      billingTypeId: imProjects.billingTypeId,
      note: imProjects.note,
      requiresReportP: imProjects.requiresReportP,
      projectBudget: imProjects.projectBudget,
      projectRisk: imProjects.projectRisk,
      corporateSponsor: imProjects.corporateSponsor,
      percentCompleted: imProjects.percentCompleted,
      projectBudgetHours: imProjects.projectBudgetHours,
      costQuotesCache: imProjects.costQuotesCache,
      costInvoicesCache: imProjects.costInvoicesCache,
      costTimesheetPlannedCache: imProjects.costTimesheetPlannedCache,
      costPurchaseOrdersCache: imProjects.costPurchaseOrdersCache,
      costBillsCache: imProjects.costBillsCache,
      costTimesheetLoggedCache: imProjects.costTimesheetLoggedCache,
      endDate:
        imProjects.endDate != null
          ? new Date(imProjects.endDate.toString())
          : null,
      startDate:
        imProjects.startDate != null
          ? new Date(imProjects.startDate.toString())
          : null,
      templateP: imProjects.templateP,
      sortOrder: imProjects.sortOrder,
      reportedHoursCache: imProjects.reportedHoursCache,
      costExpensePlannedCache: imProjects.costExpensePlannedCache,
      costExpenseLoggedCache: imProjects.costExpenseLoggedCache,
      confirmDate:
        imProjects.confirmDate != null
          ? new Date(imProjects.confirmDate.toString())
          : null,
      costDeliveryNotesCache: imProjects.costDeliveryNotesCache,
      costCacheDirty:
        imProjects.costCacheDirty != null
          ? new Date(imProjects.costCacheDirty.toString())
          : null,
      milestoneP: imProjects.milestoneP,
      releaseItemP: imProjects.releaseItemP,
      presalesProbability: imProjects.presalesProbability,
      presalesValue: imProjects.presalesValue,
      reportedDaysCache: imProjects.reportedDaysCache,
      presalesValueCurrency: imProjects.presalesValueCurrency,
      opportunitySalesStageId: imProjects.opportunitySalesStageId,
      opportunityCampaignId: imProjects.opportunityCampaignId,
      scoreRevenue: imProjects.scoreRevenue,
      scoreStrategic: imProjects.scoreStrategic,
      scoreFinanceNpv: imProjects.scoreFinanceNpv,
      scoreCustomers: imProjects.scoreCustomers,
      scoreFinanceCost: imProjects.scoreFinanceCost,
      costBillsPlanned: imProjects.costBillsPlanned,
      costExpensesPlanned: imProjects.costExpensesPlanned,
      scoreRisk: imProjects.scoreRisk,
      scoreCapabilities: imProjects.scoreCapabilities,
      scoreEinanceRoi: imProjects.scoreEinanceRoi,
      projectUserwiseBoard: imProjects.projectUserwiseBoard,
      projectBringNextday: imProjects.projectBringNextday,
      projectBringSameboard: imProjects.projectBringSameboard,
      projectNewboardEverytime: imProjects.projectNewboardEverytime,
      projectUserwiseBoard2: imProjects.projectUserwiseBoard2,
      projectBringSameboard2: imProjects.projectBringSameboard2,
      projectNewboard2Everytime: imProjects.projectNewboard2Everytime,
      projectNewboard2Always: imProjects.projectNewboard2Always,
      projectReportWeekly: imProjects.projectReportWeekly,
      scoreGain: imProjects.scoreGain,
      scoreLoss: imProjects.scoreLoss,
      scoreDelivery: imProjects.scoreDelivery,
      scoreOperations: imProjects.scoreOperations,
      scoreWhy: imProjects.scoreWhy,
      javaServices: imProjects.javaServices,
      netServices: imProjects.netServices,
      collectionLink: imProjects.collectionLink,
      trainingLink: imProjects.trainingLink,
      collectionName: imProjects.collectionName,
      trainingName: imProjects.trainingName,
      trainingDoc: imProjects.trainingDoc,
      testingRichtext: imProjects.testingRichtext,
      templateCategory: imProjects.templateCategory,
      dType: imProjects.dType,
      dOption: imProjects.dOption,
      dFilter: imProjects.dFilter,
      dId: imProjects.dId,
      tType: imProjects.tType,
      tOption: imProjects.tOption,
      tFilter: imProjects.tFilter,
      tId: imProjects.tId,
      risktype: imProjects.risktype,
      riskimpact: imProjects.riskimpact,
      riskprobability: imProjects.riskprobability,
      projectInitiativeId: imProjects.projectInitiativeId
        ? imProjects.projectInitiativeId.id
        : null,
      projectBusinessgoalId: imProjects.projectBusinessgoalId
        ? imProjects.projectBusinessgoalId.id
        : null,
      projectSubgoalId: imProjects.projectSubgoalId
        ? imProjects.projectSubgoalId.id
        : null,
      projectMaingoalId: imProjects.projectMaingoalId
        ? imProjects.projectMaingoalId.id
        : null,
      projectBucketId: imProjects.projectBucketId
        ? imProjects.projectBucketId.id
        : null,
      projectCostCenterId: imProjects.projectCostCenterId
        ? imProjects.projectCostCenterId.id
        : null,
      opportunityPriorityId: imProjects.opportunityPriorityId
        ? imProjects.opportunityPriorityId.id
        : null,
      backlogPractice: imProjects.backlogPractice
        ? imProjects.backlogPractice.id
        : null,
      projectTheme: imProjects.projectTheme ? imProjects.projectTheme.id : null,
      projectClass: imProjects.projectClass ? imProjects.projectClass.id : null,
      projectVertical: imProjects.projectVertical
        ? imProjects.projectVertical.id
        : null,
      projectBoardId: imProjects.projectBoardId
        ? imProjects.projectBoardId.id
        : null,
      projectBoard2Id: imProjects.projectBoard2Id
        ? imProjects.projectBoard2Id.id
        : null,
      projectStatusId: imProjects.projectStatusId
        ? imProjects.projectStatusId.id
        : null,
      projectTypeId: imProjects.projectTypeId
        ? imProjects.projectTypeId.id
        : null,
      projectLeadId: imProjects.projectLeadId
        ? imProjects.projectLeadId.id
        : null,
      parentId: imProjects.parentId ? imProjects.parentId.id : null
    });
  }
  saveEditTask() {
    var obj: any = this.editForm.value;
    // this.commonService.getProject(this.project.id).subscribe(resp => {
    //   var tempProject = resp;
    //   if (obj.projectStatusId) {
    //     var status: IProjectStatusId[] = this.projectStatusId.filter(
    //       p => p.id == obj.projectStatusId
    //     );
    //     tempProject.projectStatusId = status[0];
    //   }

    //   var themes: IProjectTheme[] = this.projectTheme.filter(
    //     p => p.id == obj.projectTheme
    //   );
    //   tempProject.projectTheme = themes[0];

    //   var priority: IOpportunityPriorityId[] = this.opportunityPriorityId.filter(
    //     p => p.id == obj.opportunityPriorityId
    //   );
    //   tempProject.opportunityPriorityId = priority[0];

    //   var vertical: IProjectVertical[] = this.projectVertical.filter(
    //     p => p.id == obj.projectVertical
    //   );
    //   tempProject.projectVertical = vertical[0];

    //   var bucket: IProjectBucketId[] = this.projectBucketId.filter(
    //     p => p.id == obj.projectBucketId
    //   );
    //   tempProject.projectBucketId = bucket[0];

    //   var type: IProjectTypeId[] = this.projectTypeId.filter(
    //     p => p.id == obj.projectTypeId
    //   );
    //   tempProject.projectTypeId = type[0];
    //   tempProject.projectName = obj.projectName;
    //   tempProject.startDate = obj.startDate;
    //   tempProject.endDate = obj.endDate;
    //   tempProject.projectBudgetHours = obj.projectBudgetHours;
    //   tempProject.reportedHoursCache = obj.reportedHoursCache;
    //   tempProject.note = obj.note;
    //   tempProject.percentCompleted = obj.percentCompleted;

    // var parentId: IImProjects[] = this.projects.filter(
    //   p => p.id == obj.parentId
    // );
    //  this.project.parentId = parentId[0];
    // this.project.id = this.project.id;
    //  obj.parentid = obj.parentId;
    // obj.parentId.id = this.editForm.value.parentid;

    // obj.projectStatus = obj.projectStatusId;
    console.log("tempProject", JSON.stringify(obj));
    if (!obj.projectVertical) {
      obj.projectVertical = this.project.projectVertical;
    }
    // $("#taskAdd").modal("hide");
    this.commonService
      .updateImProjects(obj)
      .subscribe((resp: any) => {
        //this.projects[this.projects.indexOf(this.project)] = obj;
        this.commonService.saveUser(this.myEmplyee, this.project);

        console.log("resp", resp);
        this.projectsAll();
        $("#taskAdd").modal("hide");
      });
    // });
  }

  checkToggle() {
    this.checked = !this.checked;
  }
  taskRefresh($event) {
    const result = $event;
    if (result == true) {
      this.projectsAll();
      $("#createtask").modal("hide");
    }
  }
  checkboxChange(event) {
    this.isChecked = event.target.checked;

    this.projectsAll();
  }
  dateOnChange($event, task) {
    var obj: any = task;
    this.project = task;
    obj.endDate = $event;

    this.commonService.updateImProjects(obj).subscribe((resp: any) => {
      console.log("resp", resp);
      this.projectsAll();
    });
  }
  valuechange($event, task) {

    var obj: any = task;
    this.project = task;
    //obj.projectBudgetHours = $event.key;
    var data: IImTimesheet = new ImTimesheet();

    this.commonService.getProject(task.id).subscribe((project) => {
      data.imProjects = project;
      data.loghours = $event.target.value;
      if (!data.loghours) {
        data.loghours = 0;
      }
      // data.notes = this.dataItem.notes;
      data.logdate = moment(this.activeDate);
      data.logday = moment(this.activeDate).format("YYYY-MM-DD");
      data.imEmployee = this.activeEmp;
      this.commonService.createImTimesheet(data).subscribe(resp => {
        console.log("resp", resp);
        this.projectsAll();

      });

    });
  }
  // taskList() {
  //   $("#task").tab("show");
  // }
  // taskList(tag) {
  //   this.activetab = tag;
  //   console.log("project", this.selectedProject);

  //   if (tag == "inProgress") {
  //     this.router.navigate(["/task/inprogress", this.selectedProject.id, tag]);
  //   } else if (tag == "complete") {
  //     this.router.navigate(["/task/complete", this.selectedProject.id, tag]);
  //   } else if (tag == "onHold") {
  //     this.router.navigate(["/task/onHold", this.selectedProject.id, tag]);
  //   } else if (tag == "notStarted") {
  //     this.router.navigate(["/task/notStarted", this.selectedProject.id, tag]);
  //   } else if (tag == "backlog") {
  //     this.router.navigate(["/task/backlog", this.selectedProject.id, tag]);
  //   } else if (tag == "risk") {
  //     this.router.navigate(["/task/risk", this.selectedProject.id, tag]);
  //   } else if (tag == "backlog") {
  //     this.router.navigate(["/task/backlog", this.selectedProject.id, tag]);
  //   }
  // }
  isSelected(projectId) {
    // this.userModelflag.findIndex()
    return projectId == this.userModelflag;
  }
  openUserModal(project) {
    this.sidenav.isUserModalProjectId = project;

    // this.sidenav.populateAllocation();
    this.sidenav.allocations = JSON.parse(project.allocationRecord);
    this.userModelflag = project.id;
    this.selectedProjectId = project;
    $("#addduser").modal("show");

    // this.sidenav[projectId.toString()] = true;
  }
  userRefresh($event) {
    console.log("$event", $event);

    const result = $event;
    if (result == true) {
      // this.projectsAll();
      this.userModelflag = null;
      this.task();
      // if (this.isChecked) {
      //   this.activeUserProjects();
      // } else {
      //   this.allProjects();
      // }
      $("#useradd").modal("hide");
    }
  }

}
