import { Component, OnInit, Input, TemplateRef, OnChanges } from '@angular/core';
import { CommonService } from "src/app/services/common.service";
import { ActivatedRoute } from '@angular/router';
import { SidenavService } from 'src/app/services/sidenav.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IImProjects } from 'src/app/models/im-projects.model';
import { IProjectTypeId } from 'src/app/models/project-type-id.model';
declare var $: any;
import * as moment from "moment";
import { completed } from 'src/app/data';
import { IProjectAllocation } from 'src/app/models/project-allocation.model';
import { ImEmployee } from 'src/app/models/im-employee.model';
import { IOpportunityPriorityId } from 'src/app/models/opportunity-priority-id.model';
import { IImTimesheet, ImTimesheet } from 'src/app/models/im-timesheet.model';
import { PopupRef, PopupService } from '@progress/kendo-angular-popup';
import { State, process } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnChanges {
  public loading = false;

  loadingTaskListGrid = true;
  public opened = false;
  public state: State = {};

  public tableData: any[] = [];
  public completeData: any[] = completed;
  public checked: boolean = true;
  subTask: any[] = [];
  @Input() selectedProject: any;
  allocationCount: number;
  userModelflag: number;
  quickTaskForm: FormGroup;
  dataItem: any;
  activeDate: moment.Moment;
  tag: string;
  projects: any[] = [];
  activeEmp: any;
  timesheet: any[] = [];
  opportunityPriorityId: any[] = [];
  projectStatusId: any[] = [];
  opportunityPriorityTable: { id: number, name: string }[] = [];
  myEmplyee: ImEmployee[] = [];
  deleteProject: any;
  activetab: string;
  selectedProjectId: any = null;
  public gridData: GridDataResult;

  constructor(private formBuilder: FormBuilder,
    private popupService: PopupService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private sidenav: SidenavService,
    private toastr: ToastrService) {
    this.quickTaskForm = this.formBuilder.group({
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
      parentId: [],
      loghours: []
    });
  }

  ngOnInit() {
    this.activeDate = moment(new Date());
    this.activeEmp = this.commonService.getEmployeDetails();

    this.taskList("all");
    this.opportunityPriorityTable = [];

    this.commonService.projectsPriority().subscribe((projectsPriority: IOpportunityPriorityId[]) => {
      this.opportunityPriorityId = projectsPriority;

      for (var i = 0; i < projectsPriority.length; i++) {
        this.opportunityPriorityTable.push({ id: projectsPriority[i].id, name: projectsPriority[i].name })
      }
    });

    this.commonService.getTimesheetByEmpIdAndLogday(moment(this.activeDate).format("YYYY-MM-DD"), this.activeEmp.id).subscribe((timesheet) => {
      this.timesheet = timesheet;
    });

    this.projectStatusId = this.sidenav.status;
  }
  ngOnChanges() {
    if (this.selectedProject && this.activeEmp) {
      this.allProjects();
    }
  }
  allProjects() {
    this.commonService.getTimesheetByEmpIdAndLogday(moment(this.activeDate).format("YYYY-MM-DD"), this.activeEmp.id).subscribe((timesheet) => {
      this.timesheet = timesheet;
    });
    this.loadingTaskListGrid = true;

    this.commonService.getAllTaskByParentId(this.selectedProject.id).subscribe((projects) => {
      this.tableData = [];
      this.projects = projects;
      for (var i = 0; i < this.projects.length; i++) {
        if (this.projects[i].parentId == this.selectedProject.id || this.projects[i].milestneP) {
          if (!this.projects[i].risktype) {
            if (this.tag == "all" || this.projects[i].projectStatusName == null) {
              if (this.projects[i].task_record) {
                this.projects[i].subTask = JSON.parse(this.projects[i].task_record);
                if (this.projects[i].subTask) {
                  if (this.projects[i].subTask.length == 1) {
                    if (!this.projects[i].subTask[0].id) {
                      this.projects[i].subTask = [];
                    }
                  }
                }
                for (var l = 0; l < this.projects[i].subTask.length; l++) {
                  for (var k = 0; k < this.timesheet.length; k++) {

                    if (this.timesheet[k].imProjectsId == this.projects[i].subTask[l].id) {
                      this.projects[i].subTask[l].loghours = this.timesheet[k].loghours;
                      this.projects[i].subTask[l].timesheetId = this.timesheet[k].id;
                      break;
                    }
                  }
                }

                for (var j = 0; j < this.projects[i].subTask.length; j++) {
                  var myallocations: any[] = [];

                  if (this.projects[i].subTask[j].allocationrecord) {
                    myallocations = JSON.parse(this.projects[i].subTask[j].allocationrecord);
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
                  this.projects[i].subTask[j].allocationTable = myallocations;
                }
              }
              var myallocations: any[] = [];
              if (this.projects[i].allocationRecord) {
                myallocations = JSON.parse(this.projects[i].allocationRecord);
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

              this.projects[i].allocationTable = myallocations;
              for (var k = 0; k < this.timesheet.length; k++) {
                if (this.timesheet[k].imProjectsId == this.projects[i].id) {
                  this.projects[i].loghours = this.timesheet[k].loghours;
                  this.projects[i].timesheetId = this.timesheet[k].id;

                  break;
                }
              }
              this.projects[i].subTask.sort((a, b) => (a.startdate && b.startdate) ? -(a.startdate.localeCompare(b.startdate)) : 0);
              this.tableData.push(this.projects[i]);

            }
            else if (this.tag == "inProgress") {
              if (this.projects[i].projectStatusName == "Implementation" ||
                this.projects[i].projectStatusName == "In-Progress" ||
                this.projects[i].projectStatusName == "On Going" ||
                this.projects[i].projectStatusName == "Rolling Out" ||
                this.projects[i].projectStatusName == "Inception" ||
                this.projects[i].projectStatusName == "Coding&DailyTesting" ||
                this.projects[i].projectStatusName == "Ready For Release" ||
                this.projects[i].projectStatusName == "Pending3rdParty" ||
                this.projects[i].projectStatusName == "PendingCustomer" ||
                this.projects[i].projectStatusName == "Not For Tracking") {
                if (this.projects[i].task_record) {
                  this.projects[i].subTask = JSON.parse(this.projects[i].task_record);
                  if (this.projects[i].subTask) {
                    if (this.projects[i].subTask.length == 1) {
                      if (!this.projects[i].subTask[0].id) {
                        this.projects[i].subTask = [];
                      }
                    }
                  }
                  for (var l = 0; l < this.projects[i].subTask.length; l++) {
                    for (var k = 0; k < this.timesheet.length; k++) {

                      if (this.timesheet[k].imProjectsId == this.projects[i].subTask[l].id) {
                        this.projects[i].subTask[l].loghours = this.timesheet[k].loghours;
                        this.projects[i].subTask[l].timesheetId = this.timesheet[k].id;
                        break;
                      }
                    }
                  }

                  for (var j = 0; j < this.projects[i].subTask.length; j++) {
                    var myallocations: any[] = [];

                    if (this.projects[i].subTask[j].allocationrecord) {
                      myallocations = JSON.parse(this.projects[i].subTask[j].allocationrecord);
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
                    this.projects[i].subTask[j].allocationTable = myallocations;
                  }
                }
                var myallocations: any[] = [];
                if (this.projects[i].allocationRecord) {
                  myallocations = JSON.parse(this.projects[i].allocationRecord);
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

                this.projects[i].allocationTable = myallocations;
                for (var k = 0; k < this.timesheet.length; k++) {
                  if (this.timesheet[k].imProjectsId == this.projects[i].id) {
                    this.projects[i].loghours = this.timesheet[k].loghours;
                    this.projects[i].timesheetId = this.timesheet[k].id;

                    break;
                  }
                }
                this.projects[i].subTask.sort((a, b) => (a.startdate && b.startdate) ? -(a.startdate.localeCompare(b.startdate)) : 0);
                this.tableData.push(this.projects[i]);
              }

            }
            else if (this.tag == "complete") {
              if (
                this.projects[i].projectStatusName == "Closed" ||
                this.projects[i].projectStatusName == "Closing Out" ||
                this.projects[i].projectStatusName == "Completed"
              ) {
                if (this.projects[i].task_record) {
                  this.projects[i].subTask = JSON.parse(this.projects[i].task_record);
                  if (this.projects[i].subTask) {
                    if (this.projects[i].subTask.length == 1) {
                      if (!this.projects[i].subTask[0].id) {
                        this.projects[i].subTask = [];
                      }
                    }
                  }

                  for (var l = 0; l < this.projects[i].subTask.length; l++) {
                    for (var k = 0; k < this.timesheet.length; k++) {

                      if (this.timesheet[k].imProjectsId == this.projects[i].subTask[l].id) {
                        this.projects[i].subTask[l].loghours = this.timesheet[k].loghours;
                        this.projects[i].subTask[l].timesheetId = this.timesheet[k].id;
                        break;
                      }
                    }
                  }
                  for (var j = 0; j < this.projects[i].subTask.length; j++) {
                    var myallocations: any[] = [];

                    if (this.projects[i].subTask[j].allocationrecord) {
                      myallocations = JSON.parse(this.projects[i].subTask[j].allocationrecord);
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
                    this.projects[i].subTask[j].allocationTable = myallocations;
                  }
                }
                var myallocations: any[] = [];
                if (this.projects[i].allocationRecord) {
                  myallocations = JSON.parse(this.projects[i].allocationRecord);
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
                this.projects[i].allocationTable = myallocations;
                // this.projects.push(this.tableValues[i]);


                for (var k = 0; k < this.timesheet.length; k++) {
                  if (this.timesheet[k].imProjectsId == this.projects[i].id) {
                    this.projects[i].loghours = this.timesheet[k].loghours;
                    this.projects[i].timesheetId = this.timesheet[k].id;
                    break;
                  }
                }
                this.projects[i].subTask.sort((a, b) => (a.startdate && b.startdate) ? -(a.startdate.localeCompare(b.startdate)) : 0);
                this.tableData.push(this.projects[i]);
              }

            }
            else if (this.tag == "onHold") {
              if (this.projects[i].projectStatusName == "On Hold" ||
                this.projects[i].projectStatusName == "Deferred") {
                if (this.projects[i].task_record) {
                  this.projects[i].subTask = JSON.parse(this.projects[i].task_record);
                  if (this.projects[i].subTask) {
                    if (this.projects[i].subTask.length == 1) {
                      if (!this.projects[i].subTask[0].id) {
                        this.projects[i].subTask = [];
                      }
                    }
                  }
                  for (var l = 0; l < this.projects[i].subTask.length; l++) {
                    for (var k = 0; k < this.timesheet.length; k++) {

                      if (this.timesheet[k].imProjectsId == this.projects[i].subTask[l].id) {
                        this.projects[i].subTask[l].loghours = this.timesheet[k].loghours;
                        this.projects[i].subTask[l].timesheetId = this.timesheet[k].id;

                        break;
                      }
                    }
                  }
                  for (var j = 0; j < this.projects[i].subTask.length; j++) {
                    var myallocations: any[] = [];

                    if (this.projects[i].subTask[j].allocationrecord) {
                      myallocations = JSON.parse(this.projects[i].subTask[j].allocationrecord);
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
                    this.projects[i].subTask[j].allocationTable = myallocations;
                  }
                }
                var myallocations: any[] = [];
                if (this.projects[i].allocationRecord) {
                  myallocations = JSON.parse(this.projects[i].allocationRecord);
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
                this.projects[i].allocationTable = myallocations;

                for (var k = 0; k < this.timesheet.length; k++) {
                  if (this.timesheet[k].imProjectsId == this.projects[i].id) {
                    this.projects[i].loghours = this.timesheet[k].loghours;
                    this.projects[i].timesheetId = this.timesheet[k].id;
                    break;
                  }
                }

                this.projects[i].subTask.sort((a, b) => (a.startdate && b.startdate) ? -(a.startdate.localeCompare(b.startdate)) : 0);
                this.tableData.push(this.projects[i]);
              }
            }
            else if (this.tag == "notStarted") {
              if (this.projects[i].projectStatusName != "Closed" &&
                this.projects[i].projectStatusName != "Closing Out" &&
                this.projects[i].projectStatusName != "Completed" &&
                this.projects[i].projectStatusName != "On Hold" &&
                this.projects[i].projectStatusName != "Deferred" &&
                this.projects[i].projectStatusName != "Implementation" &&
                this.projects[i].projectStatusName != "In-Progress" &&
                this.projects[i].projectStatusName != "On Going" &&
                this.projects[i].projectStatusName != "Rolling Out" &&
                this.projects[i].projectStatusName != "Inception" &&
                this.projects[i].projectStatusName != "Coding&DailyTesting" &&
                this.projects[i].projectStatusName != "Ready For Release" &&
                this.projects[i].projectStatusName != "Pending3rdParty" &&
                this.projects[i].projectStatusName != "PendingCustomer" &&
                this.projects[i].projectStatusName != "Not For Tracking" &&
                this.projects[i].projectStatusName != "Backlog" &&
                this.projects[i].projectStatusName == null) {
                if (this.projects[i].task_record) {
                  this.projects[i].subTask = JSON.parse(this.projects[i].task_record);
                  if (this.projects[i].subTask) {
                    if (this.projects[i].subTask.length == 1) {
                      if (!this.projects[i].subTask[0].id) {
                        this.projects[i].subTask = [];
                      }
                    }
                  }

                  for (var l = 0; l < this.projects[i].subTask.length; l++) {
                    for (var k = 0; k < this.timesheet.length; k++) {

                      if (this.timesheet[k].imProjectsId == this.projects[i].subTask[l].id) {
                        this.projects[i].subTask[l].loghours = this.timesheet[k].loghours;
                        this.projects[i].subTask[l].timesheetId = this.timesheet[k].id;
                        break;
                      }
                    }
                  }
                  for (var j = 0; j < this.projects[i].subTask.length; j++) {
                    var myallocations: any[] = [];

                    if (this.projects[i].subTask[j].allocationrecord) {
                      myallocations = JSON.parse(this.projects[i].subTask[j].allocationrecord);
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
                    this.projects[i].subTask[j].allocationTable = myallocations;
                  }

                }
                var myallocations: any[] = [];
                if (this.projects[i].allocationRecord) {
                  myallocations = JSON.parse(this.projects[i].allocationRecord);
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
                this.projects[i].allocationTable = myallocations;

                for (var k = 0; k < this.timesheet.length; k++) {
                  if (this.timesheet[k].imProjectsId == this.projects[i].id) {
                    this.projects[i].loghours = this.timesheet[k].loghours;
                    this.projects[i].timesheetId = this.timesheet[k].id;
                    break;
                  }
                }
                this.projects[i].subTask.sort((a, b) => (a.startdate && b.startdate) ? -(a.startdate.localeCompare(b.startdate)) : 0);
                this.tableData.push(this.projects[i]);
              }

            }
            else if (this.tag == "backlog") {
              if (this.projects[i].projectStatusName == "Backlog") {
                if (this.projects[i].task_record) {
                  this.projects[i].subTask = JSON.parse(this.projects[i].task_record);

                  if (this.projects[i].subTask) {
                    if (this.projects[i].subTask.length == 1) {
                      if (!this.projects[i].subTask[0].id) {
                        this.projects[i].subTask = [];
                      }
                    }
                  }
                  for (var l = 0; l < this.projects[i].subTask.length; l++) {
                    for (var k = 0; k < this.timesheet.length; k++) {

                      if (this.timesheet[k].imProjectsId == this.projects[i].subTask[l].id) {
                        this.projects[i].subTask[l].loghours = this.timesheet[k].loghours;
                        this.projects[i].subTask[l].timesheetId = this.timesheet[k].id;

                        break;
                      }
                    }
                  }
                  for (var j = 0; j < this.projects[i].subTask.length; j++) {
                    var myallocations: any[] = [];

                    if (this.projects[i].subTask[j].allocationrecord) {

                      myallocations = JSON.parse(this.projects[i].subTask[j].allocationrecord);
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
                    this.projects[i].subTask[j].allocationTable = myallocations;
                  }
                }
                var myallocations: any[] = [];
                if (this.projects[i].allocationRecord) {
                  myallocations = JSON.parse(this.projects[i].allocationRecord);
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
                this.projects[i].allocationTable = myallocations;
                for (var k = 0; k < this.timesheet.length; k++) {
                  if (this.timesheet[k].imProjectsId == this.projects[i].id) {
                    this.projects[i].loghours = this.timesheet[k].loghours;
                    this.projects[i].timesheetId = this.timesheet[k].id;


                    break;
                  }
                }
                this.projects[i].subTask.sort((a, b) => (a.startdate && b.startdate) ? -(a.startdate.localeCompare(b.startdate)) : 0);
                this.tableData.push(this.projects[i]);
              }
            }
          }
          else if (this.tag == "risk") {
            var myallocations: any[] = [];
            if (this.projects[i].allocationRecord) {
              myallocations = JSON.parse(this.projects[i].allocationRecord);
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
            this.projects[i].allocationTable = myallocations;
            for (var k = 0; k < this.timesheet.length; k++) {
              if (this.timesheet[k].imProjectsId == this.projects[i].id) {
                this.projects[i].loghours = this.timesheet[k].loghours;
                this.projects[i].timesheetId = this.timesheet[k].id;
                break;
              }
            }


            if (this.projects[i].task_record) {
              this.projects[i].subTask = JSON.parse(this.projects[i].task_record);
              if (this.projects[i].subTask) {
                if (this.projects[i].subTask.length == 1) {
                  if (!this.projects[i].subTask[0].id) {
                    this.projects[i].subTask = [];
                  }
                }
              }
              for (var l = 0; l < this.projects[i].subTask.length; l++) {
                for (var k = 0; k < this.timesheet.length; k++) {

                  if (this.timesheet[k].imProjectsId == this.projects[i].subTask[l].id) {
                    this.projects[i].subTask[l].loghours = this.timesheet[k].loghours;
                    this.projects[i].subTask[l].timesheetId = this.timesheet[k].id;
                    break;
                  }
                }
              }
              for (var j = 0; j < this.projects[i].subTask.length; j++) {
                if (this.projects[i].subTask[j].allocationrecord) {
                  var myallocations: any[] = [];
                  myallocations = JSON.parse(this.projects[i].subTask[j].allocationrecord);
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
                this.projects[i].subTask[j].allocationTable = myallocations;
              }
            }
            this.projects[i].subTask.sort((a, b) => (a.startdate && b.startdate) ? -(a.startdate.localeCompare(b.startdate)) : 0);
            this.tableData.push(this.projects[i]);

          }
        }
        this.loadingTaskListGrid = false;
        this.loading = false;

      }
      this.gridData = process(this.tableData, this.state);

    });
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(this.tableData, this.state);
  }
  taskList(tag) {
    this.tag = tag;
    this.activetab = tag;

    this.allProjects();
  }
  isSelected(projectId) {
    // this.userModelflag.findIndex()
    return projectId == this.userModelflag;
  }
  openUserModal(project) {
    this.sidenav.allocations = [];
    this.sidenav.isUserModalProjectId = project;
    if (project) {
      if (project.allocationRecord) {
        this.sidenav.allocations = JSON.parse(project.allocationRecord);
      }
      if (project.allocationrecord) {
        this.sidenav.allocations = JSON.parse(project.allocationrecord);
      }
      this.userModelflag = project.id;
    }
    else {
      this.sidenav.allocations = [];
    }
    // this.selectedProjectId = project;
    // $("#addduser").modal("show");

  }
  saveQuickTask() {

    this.loadingTaskListGrid = true;
    var obj: any = this.quickTaskForm.value;
    obj.parentId = this.selectedProject.id;
    obj.projectStatusId = this.selectedProject.projectStatusId;
    if (this.selectedProject.projectStatusId) {
      if (this.selectedProject.projectStatusId.id) {
        obj.projectStatusId = this.selectedProject.projectStatusId.id;
      }
    }
    obj.projectVertical = this.selectedProject.projectVertical;
    if (this.selectedProject.projectVertical) {
      if (this.selectedProject.projectVertical.id) {
        obj.projectVertical = this.selectedProject.projectVertical.id;
      }
    }
    obj.projectNr = obj.projectName.substring(0, 250);
    obj.projectPath = obj.projectNr;
    this.commonService.createImProjects(obj).subscribe((resp: any) => {

      this.myEmplyee = this.sidenav.myEmployeeAddition;
      var found: boolean = false;
      for (var i = 0; i < this.myEmplyee.length; i++) {
        if (this.myEmplyee[i].id == this.activeEmp.id) {
          found = true;
          break;
        }
      }
      if (!found) {
        this.myEmplyee.push(this.activeEmp);
      }
      this.commonService.saveUser(this.myEmplyee, resp);
      console.log("resp", resp);
      if (obj.loghours) {
        var data: IImTimesheet = new ImTimesheet();
        data.imProjects = resp;
        data.loghours = obj.loghours;
        data.logdate = moment(this.activeDate);
        data.logday = moment(this.activeDate).format("YYYY-MM-DD");
        data.imEmployee = this.activeEmp;
        this.commonService.createImTimesheet(data).subscribe(TimeSheetResp => {
          console.log("resp", TimeSheetResp);
        });
      }
      this.toastr.success("Task created Successfully!");

      this.allProjects();
      this.quickTaskForm.reset();
    });

  }
  saveSubTask(id) {
    this.loadingTaskListGrid = true;

    var obj: any = this.quickTaskForm.value;

    obj.parentId = id;

    obj.projectNr = obj.projectName.substring(0, 250);
    obj.projectPath = obj.projectNr;
    // obj.startDate = this.activeDate;
    this.commonService.createImProjects(obj).subscribe((resp: any) => {

      this.myEmplyee = this.sidenav.myEmployeeAddition;
      var found: boolean = false;
      for (var i = 0; i < this.myEmplyee.length; i++) {
        if (this.myEmplyee[i].id == this.activeEmp.id) {
          found = true;
          break;
        }
      }
      if (!found) {
        this.myEmplyee.push(this.activeEmp);
      }
      this.commonService.saveUser(this.myEmplyee, resp);
      console.log("resp", resp);
      if (obj.loghours) {
        var data: IImTimesheet = new ImTimesheet();
        data.imProjects = resp;
        data.loghours = obj.loghours;
        // data.notes = this.dataItem.notes;
        data.logdate = moment(this.activeDate);
        data.logday = moment(this.activeDate).format("YYYY-MM-DD");
        data.imEmployee = this.activeEmp;
        this.commonService.createImTimesheet(data).subscribe(TimeSheetResp => {
          console.log("resp", TimeSheetResp);
        });
      }
      this.toastr.success("Sub Task created Successfully!");
      this.allProjects();
      this.quickTaskForm.reset();
    });
  }
  userRefresh($event) {
    const result = $event;
    if (result == true) {
      this.allProjects();
      this.userModelflag = null;
      $("#useradd").modal("hide");
    }
  }
  checkToggle() {
    this.checked = !this.checked;
  }
  public cellClickHandler({ sender, rowIndex, column, columnIndex, dataItem, isEdited }) {
    if (!isEdited && column.field != "reportedHoursCache") {
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));

    }
  }
  public cellCloseHandler(args: any) {
    const { formGroup, dataItem, column } = args;

    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    }
    else if (formGroup.dirty) {
      this.dataItem = formGroup.value;
      var validUser: boolean = false;
      if (column.field == "loghours") {
        this.commonService.allocationProjects(this.dataItem.id).subscribe((allocation) => {
          var setTimesheet: boolean = false;
          for (var i = 0; i < allocation.length; i++) {
            if (allocation[i].imEmployee == this.activeEmp.id) {
              dataItem.projectName = formGroup.value.projectName;
              dataItem.projectBudgetHours = formGroup.value.projectBudgetHours;
              dataItem.reportedHoursCache = formGroup.value.reportedHoursCache;
              dataItem.percentCompleted = formGroup.value.percentCompleted;
              dataItem.opportunityPriorityId = formGroup.value.opportunityPriorityId;
              dataItem.startDate = moment(formGroup.value.startDate);
              dataItem.endDate = moment(formGroup.value.endDate);
              dataItem.loghours = formGroup.value.loghours;

              this.commonService.updateImProjects(this.dataItem).subscribe((resp) => {
                console.log("resp", resp);
                if (column.field == "loghours") {

                  var data: IImTimesheet = new ImTimesheet();
                  data.imProjects = resp;
                  data.loghours = dataItem.loghours;
                  if (!data.loghours) {
                    data.loghours = 0;
                  }
                  // data.notes = this.dataItem.notes;
                  data.logdate = moment(this.activeDate);
                  data.logday = moment(this.activeDate).format("YYYY-MM-DD");
                  data.imEmployee = this.activeEmp;

                  if (!dataItem.timesheetId) {
                    this.commonService.createImTimesheet(data).subscribe(TimeSheetResp => {
                      console.log("resp", TimeSheetResp);
                      this.allProjects();

                    });
                  }
                  else {
                    data.id = dataItem.timesheetId;
                    this.commonService.putImTimesheet(data).subscribe((resp) => {
                      console.log("resp", resp);
                      this.allProjects();
                    });
                  }
                }
                else {
                  this.allProjects();
                }
              });
              setTimesheet = true;
              break;
            }


          }
          if (!setTimesheet) {
            alert("you have not allocated to enter timesheet");
          }
        });
      }
      else {
        validUser = true;
      }
      if (validUser) {
        dataItem.projectName = formGroup.value.projectName;
        dataItem.projectBudgetHours = formGroup.value.projectBudgetHours;
        dataItem.reportedHoursCache = formGroup.value.reportedHoursCache;
        dataItem.percentCompleted = formGroup.value.percentCompleted;
        dataItem.opportunityPriorityId = formGroup.value.opportunityPriorityId;
        dataItem.startDate = moment(formGroup.value.startDate);
        dataItem.endDate = moment(formGroup.value.endDate);
        dataItem.loghours = formGroup.value.loghours;

        this.commonService.updateImProjects(this.dataItem).subscribe((resp) => {

          console.log("resp", resp);
          if (column.field == "loghours") {

            var data: IImTimesheet = new ImTimesheet();
            data.imProjects = resp;
            data.loghours = dataItem.loghours;
            if (!data.loghours) {
              data.loghours = 0;
            }
            // data.notes = this.dataItem.notes;
            data.logdate = moment(this.activeDate);
            data.logday = moment(this.activeDate).format("YYYY-MM-DD");
            data.imEmployee = this.activeEmp;
            this.commonService.createImTimesheet(data).subscribe(TimeSheetResp => {
              console.log("resp", TimeSheetResp);
              this.allProjects();

            });
          }
          else {
            this.allProjects();
          }
        });
      }
    }
  }
  public cancelHandler({ sender, rowIndex }) {
    sender.closeRow(rowIndex);
  }
  public saveHandler({ sender, formGroup, rowIndex }) {
    if (formGroup.valid) {
      sender.closeRow(rowIndex);
    }
  }
  public removeHandler({ sender, dataItem }) {
    sender.cancelCell();
  }
  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      'id': new FormControl(dataItem.id),
      'projectName': new FormControl(dataItem.projectName),
      'projectBudgetHours': new FormControl(dataItem.projectBudgetHours),
      'reportedHoursCache': new FormControl(dataItem.reportedHoursCache),
      'percentCompleted': new FormControl(dataItem.percentCompleted),
      'opportunityPriorityId': new FormControl(dataItem.opportunityPriorityId),
      'startDate': new FormControl(dataItem.startDate),
      'endDate': new FormControl(dataItem.endDate),
      'loghours': new FormControl(dataItem.loghours),
      'milestoneP': new FormControl(dataItem.milestoneP)

    });
  }
  dateOnChange($event, row) {
    this.dataItem = row;
    this.dataItem.startDate = moment($event);
    this.commonService.updateImProjects(this.dataItem).subscribe((resp) => {
      console.log("resp", resp);
      // this.allProjects();
    });
  }

  endDateOnChange($event, row) {
    this.dataItem = row;
    this.dataItem.endDate = moment($event);
    this.commonService.updateImProjects(this.dataItem).subscribe((resp) => {
      console.log("resp", resp);
      // this.allProjects();
    });
  }
  public changePriority(value: any, row): void {
    this.dataItem = row;
    this.dataItem.opportunityPriorityId = value.id;
    this.commonService.updateImProjects(this.dataItem).subscribe((resp) => {
      console.log("resp", resp);
      // this.allProjects();
    });
  }
  public changeStatus(value: any, row): void {
    this.dataItem = row;
    this.dataItem.projectStatusId = value.id;
    this.commonService.updateImProjects(this.dataItem).subscribe((resp) => {
      console.log("resp", resp);
      // this.allProjects();
    });
  }

  updateMilestone(value, row) {
    this.dataItem = row;

    this.dataItem.milestoneP = value;
    this.commonService.updateImProjects(this.dataItem).subscribe((resp) => {
      console.log("resp", resp);
      // this.allProjects();
    });
  }

  public updateTask(): void {
    // grid.closeCell();
    // grid.cancelCell();
    //  var data: IImTimesheet = new ImTimesheet;
    this.commonService.updateImProjects(this.dataItem).subscribe((resp) => {
      console.log("resp", resp);
      this.allProjects();

    });

  }

  public subTaskcellClickHandler({ sender, rowIndex, column, columnIndex, dataItem, isEdited }) {

    if (!isEdited && column.field != "reportedhourscache") {
      sender.editCell(rowIndex, columnIndex, this.subTaskcreateFormGroup(dataItem));

    }
  }
  public subTaskcellCloseHandler(args: any) {
    const { formGroup, dataItem, column } = args;
    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    }

    else if (formGroup.dirty) {
      this.dataItem = formGroup.value;

      var validUser: boolean = false;
      if (column.field == "loghours") {
        this.commonService.allocationProjects(this.dataItem.id).subscribe((allocation) => {
          var setTimesheet: boolean = false;
          for (var i = 0; i < allocation.length; i++) {
            if (allocation[i].imEmployee == this.activeEmp.id) {

              dataItem.projectname = formGroup.value.projectname;
              dataItem.projectbudgethours = formGroup.value.projectbudgethours;
              dataItem.reportedhourscache = formGroup.value.reportedhourscache;
              dataItem.percentcompleted = formGroup.value.percentcompleted;
              dataItem.opportunitypriorityid = formGroup.value.opportunitypriorityid;
              dataItem.startdate = moment(formGroup.value.startdate);
              dataItem.enddate = moment(formGroup.value.enddate);
              dataItem.loghours = formGroup.value.loghours;


              this.dataItem.projectName = formGroup.value.projectname;
              this.dataItem.projectBudgetHours = formGroup.value.projectbudgethours;
              this.dataItem.reportedHoursCache = formGroup.value.reportedhourscache;
              this.dataItem.percentCompleted = formGroup.value.percentcompleted;
              this.dataItem.opportunityPriorityId = formGroup.value.opportunitypriorityid;
              this.dataItem.startDate = moment(formGroup.value.startdate);
              this.dataItem.endDate = moment(formGroup.value.enddate);

              delete this.dataItem.projectname;
              delete this.dataItem.projectbudgethours;
              delete this.dataItem.reportedhourscache;
              delete this.dataItem.percentcompleted;
              delete this.dataItem.opportunitypriorityid;
              delete this.dataItem.startdate;
              delete this.dataItem.enddate;

              this.commonService.updateImProjects(this.dataItem).subscribe((resp) => {
                console.log("resp", resp);
                if (column.field == "loghours") {

                  var data: IImTimesheet = new ImTimesheet();
                  data.imProjects = resp;
                  data.loghours = dataItem.loghours;
                  if (!data.loghours) {
                    data.loghours = 0;
                  }
                  // data.notes = this.dataItem.notes;
                  data.logdate = moment(this.activeDate);
                  data.logday = moment(this.activeDate).format("YYYY-MM-DD");
                  data.imEmployee = this.activeEmp;


                  if (!dataItem.timesheetId) {
                    this.commonService.createImTimesheet(data).subscribe(TimeSheetResp => {
                      console.log("resp", TimeSheetResp);
                      // this.allProjects();

                    });
                  }
                  else {
                    data.id = dataItem.timesheetId;
                    this.commonService.putImTimesheet(data).subscribe((resp) => {
                      console.log("resp", resp);
                      // this.allProjects();
                    });
                  }
                }
                else {
                  // this.allProjects();
                }
              });
              setTimesheet = true;
              break;
            }

          }
          if (!setTimesheet) {
            alert("you have not allocated to enter timesheet");
          }
        });
      }
      else {
        validUser = true;
      }
      if (validUser) {
        dataItem.projectname = formGroup.value.projectname;
        dataItem.projectbudgethours = formGroup.value.projectbudgethours;
        dataItem.reportedhourscache = formGroup.value.reportedhourscache;
        dataItem.percentcompleted = formGroup.value.percentcompleted;
        dataItem.opportunitypriorityid = formGroup.value.opportunitypriorityid;
        dataItem.startdate = moment(formGroup.value.startdate);
        dataItem.enddate = moment(formGroup.value.enddate);
        dataItem.loghours = formGroup.value.loghours;


        this.dataItem.projectName = formGroup.value.projectname;
        this.dataItem.projectBudgetHours = formGroup.value.projectbudgethours;
        this.dataItem.reportedHoursCache = formGroup.value.reportedhourscache;
        this.dataItem.percentCompleted = formGroup.value.percentcompleted;
        this.dataItem.opportunityPriorityId = formGroup.value.opportunitypriorityid;
        this.dataItem.startDate = moment(formGroup.value.startdate);
        this.dataItem.endDate = moment(formGroup.value.enddate);

        delete this.dataItem.projectname;
        delete this.dataItem.projectbudgethours;
        delete this.dataItem.reportedhourscache;
        delete this.dataItem.percentcompleted;
        delete this.dataItem.opportunitypriorityid;
        delete this.dataItem.startdate;
        delete this.dataItem.enddate;

        this.commonService.updateImProjects(this.dataItem).subscribe((resp) => {
          console.log("resp", resp);
          if (column.field == "loghours") {

            var data: IImTimesheet = new ImTimesheet();
            data.imProjects = resp;
            data.loghours = dataItem.loghours;
            if (!data.loghours) {
              data.loghours = 0;
            }
            // data.notes = this.dataItem.notes;
            data.logdate = moment(this.activeDate);
            data.logday = moment(this.activeDate).format("YYYY-MM-DD");
            data.imEmployee = this.activeEmp;
            this.commonService.createImTimesheet(data).subscribe(TimeSheetResp => {
              console.log("resp", TimeSheetResp);
              // this.allProjects();

            });
          }
          else {
            // this.allProjects();
          }
        });
      }
    }



  }
  public subTaskcancelHandler({ sender, rowIndex }) {
    sender.closeRow(rowIndex);
  }
  public subTasksaveHandler({ sender, formGroup, rowIndex }) {
    if (formGroup.valid) {
      sender.closeRow(rowIndex);
    }
  }
  public subTaskremoveHandler({ sender, dataItem }) {
    sender.cancelCell();
  }
  public subTaskcreateFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      'id': new FormControl(dataItem.id),
      'projectname': new FormControl(dataItem.projectname),
      'projectbudgethours': new FormControl(dataItem.projectbudgethours, Validators.min(0)),
      'reportedhourscache': new FormControl(dataItem.reportedhourscache),
      'percentcompleted': new FormControl(dataItem.percentcompleted),
      'opportunitypriorityid': new FormControl(dataItem.opportunitypriorityid),
      'startdate': new FormControl(dataItem.startdate),
      'enddate': new FormControl(dataItem.enddate),
      'loghours': new FormControl(dataItem.loghours),
      'milestonep': new FormControl(dataItem.milestonep)


    });
  }
  subTaskdateOnChange($event, row) {
    var myJson: any = {
      "id": 0, "projectName": "", "projectBudgetHours": 0, "reportedHoursCache": 0,
      "percentCompleted": 0, "opportunityPriorityId": 0, "startDate": moment(), "endDate": moment(), "milestneP": false
    };
    this.dataItem = myJson;
    this.dataItem.id = row.id;
    this.dataItem.projectName = row.projectname;
    this.dataItem.projectBudgetHours = row.projectbudgethours;
    this.dataItem.reportedHoursCache = row.reportedhourscache;
    this.dataItem.percentCompleted = row.percentcompleted;
    this.dataItem.opportunityPriorityId = row.opportunitypriorityid;
    this.dataItem.startDate = moment($event);
    this.dataItem.endDate = moment(row.enddate);
    this.dataItem.milestoneP = moment(row.milestonep);

    delete this.dataItem.projectname;
    delete this.dataItem.projectbudgethours;
    delete this.dataItem.reportedhourscache;
    delete this.dataItem.percentcompleted;
    delete this.dataItem.opportunitypriorityid;
    delete this.dataItem.startdate;
    delete this.dataItem.enddate;
    delete this.dataItem.milestonep;


    this.commonService.updateImProjects(this.dataItem).subscribe((resp) => {
      console.log("resp", resp);
      this.allProjects();
    });
  }

  subTaskendDateOnChange($event, row) {
    var myJson: any = {
      "id": 0, "projectName": "", "projectBudgetHours": 0, "reportedHoursCache": 0,
      "percentCompleted": 0, "opportunityPriorityId": 0, "startDate": moment(), "endDate": moment(), "milestoneP": false
    };

    this.dataItem = myJson;
    this.dataItem.id = row.id;
    this.dataItem.projectName = row.projectname;
    this.dataItem.projectBudgetHours = row.projectbudgethours;
    this.dataItem.reportedHoursCache = row.reportedhourscache;
    this.dataItem.percentCompleted = row.percentcompleted;
    this.dataItem.opportunityPriorityId = row.opportunitypriorityid;
    this.dataItem.startDate = moment(row.startdate);
    this.dataItem.endDate = moment($event);
    this.dataItem.milestoneP = row.milestonep;


    delete this.dataItem.projectname;
    delete this.dataItem.projectbudgethours;
    delete this.dataItem.reportedhourscache;
    delete this.dataItem.percentcompleted;
    delete this.dataItem.opportunitypriorityid;
    delete this.dataItem.startdate;
    delete this.dataItem.enddate;
    delete this.dataItem.milestonep;

    this.commonService.updateImProjects(this.dataItem).subscribe((resp) => {
      console.log("resp", resp);
      // this.allProjects();
    });
  }
  public subTaskChangePriority(value: any, row): void {
    // this.dataItem = row;
    // this.dataItem.opportunityPriorityId = value.id;
    var myJson: any = {
      "id": 0, "projectName": "", "projectBudgetHours": 0, "reportedHoursCache": 0,
      "percentCompleted": 0, "opportunityPriorityId": 0, "startDate": moment(), "endDate": moment(), "milestoneP": false
    };

    this.dataItem = myJson;
    this.dataItem.id = row.id;
    this.dataItem.projectName = row.projectname;
    this.dataItem.projectBudgetHours = row.projectbudgethours;
    this.dataItem.reportedHoursCache = row.reportedhourscache;
    this.dataItem.percentCompleted = row.percentcompleted;
    this.dataItem.opportunityPriorityId = value.id;
    this.dataItem.startDate = moment(row.startdate);
    this.dataItem.endDate = moment(row.enddate);
    this.dataItem.milestoneP = row.milestonep;



    delete this.dataItem.projectname;
    delete this.dataItem.projectbudgethours;
    delete this.dataItem.reportedhourscache;
    delete this.dataItem.percentcompleted;
    delete this.dataItem.opportunitypriorityid;
    delete this.dataItem.startdate;
    delete this.dataItem.enddate;
    delete this.dataItem.milestonep;


    this.commonService.updateImProjects(this.dataItem).subscribe((resp) => {
      console.log("resp", resp);
      // this.allProjects();
    });
  }
  public subtaskChangeStatus(value: any, row): void {
    // this.dataItem = row;
    // this.dataItem.opportunityPriorityId = value.id;
    var myJson: any = {
      "id": 0, "projectName": "", "projectBudgetHours": 0, "reportedHoursCache": 0,
      "percentCompleted": 0, "opportunityPriorityId": 0, "startDate": moment(), "endDate": moment(), "milestoneP": false
    };

    this.dataItem = myJson;
    this.dataItem.id = row.id;
    this.dataItem.projectName = row.projectname;
    this.dataItem.projectBudgetHours = row.projectbudgethours;
    this.dataItem.reportedHoursCache = row.reportedhourscache;
    this.dataItem.percentCompleted = row.percentcompleted;
    this.dataItem.opportunityPriorityId = row.opportunitypriorityid;
    this.dataItem.startDate = moment(row.startdate);
    this.dataItem.endDate = moment(row.enddate);
    this.dataItem.milestoneP = row.milestonep;
    this.dataItem.projectStatusId = value.id;



    delete this.dataItem.projectname;
    delete this.dataItem.projectbudgethours;
    delete this.dataItem.reportedhourscache;
    delete this.dataItem.percentcompleted;
    delete this.dataItem.opportunitypriorityid;
    delete this.dataItem.startdate;
    delete this.dataItem.enddate;
    delete this.dataItem.milestonep;


    this.commonService.updateImProjects(this.dataItem).subscribe((resp) => {
      console.log("resp", resp);
      // this.allProjects();
    });
  }


  updateSubtaskMilestone(value, row) {
    var myJson: any = {
      "id": 0, "projectName": "", "projectBudgetHours": 0, "reportedHoursCache": 0,
      "percentCompleted": 0, "opportunityPriorityId": 0, "startDate": moment(), "endDate": moment(), "milestoneP": false
    };

    this.dataItem = myJson;
    this.dataItem.id = row.id;
    this.dataItem.projectName = row.projectname;
    this.dataItem.projectBudgetHours = row.projectbudgethours;
    this.dataItem.reportedHoursCache = row.reportedhourscache;
    this.dataItem.percentCompleted = row.percentcompleted;
    this.dataItem.opportunityPriorityId = row.opportunitypriorityid;
    this.dataItem.startDate = moment(row.startdate);
    this.dataItem.endDate = moment(row.enddate);
    this.dataItem.milestoneP = value;

    delete this.dataItem.projectname;
    delete this.dataItem.projectbudgethours;
    delete this.dataItem.reportedhourscache;
    delete this.dataItem.percentcompleted;
    delete this.dataItem.opportunitypriorityid;
    delete this.dataItem.startdate;
    delete this.dataItem.enddate;
    delete this.dataItem.milestonep;


    this.commonService.updateImProjects(this.dataItem).subscribe((resp) => {
      console.log("resp", resp);
      // this.allProjects();
    });

  }
  // updateSubTask() {
  //   console.log("dataItem", this.dataItem)

  //   this.commonService.updateImProjects(this.dataItem).subscribe((resp) => {
  //     console.log("resp", resp);
  //     this.allProjects();

  //   });
  // }


  public confirmDeletion(dataItem: any) {
    this.opened = true;
    this.deleteProject = dataItem.id;
  }
  public close(status) {
    if (status == "yes") {
      this.loadingTaskListGrid = true;
      // return this.httpClient.get<repos[]>('https://api.github.com/users/' + this.userName + '/repos').subscribe((response) => {
      //       this.repos = response;
      //     },
      //     (error) => {
      //       this.errorMessage = error.message;
      //     }
      //   )
      this.commonService.deleteProject(this.deleteProject).subscribe((resp: any) => {
        if (resp.msg == "record successfully deleted") {
          this.toastr.success("Task deleted Successfully!");

          this.allProjects();
        } else {
          this.loadingTaskListGrid = false;
          this.toastr.warning(resp.msg);

        }
      },
        (error) => {
          alert(error.message)
          this.loadingTaskListGrid = false;
        });
    }
    this.opened = false;
  }
  cloneProject(project) {
    this.loadingTaskListGrid = true;

    this.commonService.cloneProject(project.id).subscribe((resp) => {
      console.log("resp", resp);
      this.toastr.success("Task cloned Successfully!");
      this.allProjects();
    });
  }
}
