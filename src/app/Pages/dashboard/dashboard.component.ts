import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IProjectVertical } from 'src/app/models/project-vertical.model';
import { IProjectTypeId } from 'src/app/models/project-type-id.model';
import { IProjectTheme } from 'src/app/models/project-theme.model';
import { IProjectStatusId } from 'src/app/models/project-status-id.model';
import { SidenavService } from 'src/app/services/sidenav.service';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loadchildTaskGrid = false;
  loadingChildTaskProjectsGrid = false;
  loadingRiskGrid = false;
  tableValues: any[];
  projects: any[];
  userProjects: any[] = [];
  allMainProject: any[] = [];
  employeeRisk: any[] = [];
  allRisk: any[] = [];
  backlog: any[] = [];
  notStarted: any[] = [];
  onHold: any[] = [];
  complete: any[] = [];
  inProgress: any[] = [];
  milestone: any[] = [];

  tasks: any[] = [];
  allTasks: any[] = [];
  projectTask: any[] = [];
  userTasks: any[] = [];

  projectData: any[] = [];
  taskData: any[] = [];
  projectTaskData: any[] = [];
  projectTaskBottomData: any[] = [];
  inProgressTask: any[] = [];
  onHoldTask: any[] = [];
  pendingTask: any = [];
  completeTask: any[] = [];

  inProgressCount = 0;
  onHoldCount = 0;
  notStartedCount = 0;
  backlogCount = 0;
  completeCount = 0;

  riskData: any[] = [];
  totalRisk: any[] = [];
  projectRisk: any[] = [];
  taskRisk: any[] = [];
  allProjectsManegersDataSource: any[] = [];

  projectManagers: any[] = [];
  projectTheme: IProjectTheme[] = [];
  projectTypeId: IProjectTypeId[] = [];
  projectVertical: IProjectVertical[] = [];
  status: IProjectStatusId[] = [];
  filterLeadId: any = null;
  filterTheme: any = null;
  filterVertical: any = null;
  filterType: any = null;
  filterStartDate: moment.Moment = null;
  filterEndDate: moment.Moment = null;
  isChecked: boolean;
  activeEmp: any;
  activeDate: moment.Moment;
  activeTag: string;
  activeRiskTag: string;
  filterForm: FormGroup;
  constructor(private commonService: CommonService, private formbuilder: FormBuilder, private sideNav: SidenavService) {
    this.filterForm = this.formbuilder.group({
      filterLeadId: [],
      projectTheme: [],
      projectTypeId: [],
      projectVertical: [],
      startDate: [],
      endDate: []
    });
  }

  ngOnInit() {
    this.activeEmp = this.commonService.getEmployeDetails();
    this.activeDate = moment(new Date());
    this.isChecked = false;
    this.status = this.sideNav.status;

    this.projectTypeId = this.sideNav.projectTypeId;

    this.projectVertical = this.sideNav.projectVertical;

    this.projectTheme = this.sideNav.projectTheme;

    this.projectManagers = this.sideNav.projectManagers;
    this.allProjectsManegersDataSource = this.sideNav.projectManagers;
    // if (this.filterLeadId == null) {
    //   this.filterLeadId = this.sideNav.filterLeadId;
    //   this.filterForm.value.filterLeadId = this.sideNav.filterFormvalue;
    // }
    this.commonService
      .getAllProjectManagers()
      .subscribe((projectManagers: any[]) => {
        this.projectManagers = [];
        for (var j = 0; j < projectManagers.length; j++) {
          if (projectManagers[j]) {
            projectManagers[j].fullName = projectManagers[j].project_lead_first_name + " " + projectManagers[j].project_lead_last_name;
            this.projectManagers.push(projectManagers[j]);

          }
        }
        this.projectManagers.sort((a, b) => a.fullName.localeCompare(b.fullName))
        this.filterLeadId = null;
        // for (var i = 0; i < projectManagers.length; i++) {
        //   if (projectManagers[i]) {
        //     if (projectManagers[i].id == this.activeEmp.id) {
        //       this.filterLeadId = projectManagers[i].id;
        //       this.filterForm.value.filterLeadId = projectManagers[i];
        //       break;
        //     }
        //   }
        // }
      });

    this.commonService.getEmpProject(this.activeEmp.id).subscribe((projects) => {
      this.userProjects = projects;
      // console.log("proj", this.userProjects);

      this.displayMyProjects();
    });

    this.commonService.getAllMainProjects().subscribe((projects: any[]) => {
      this.allMainProject = projects;
      this.displayMyProjects();

    });
    this.commonService
      .getEMployeeRisk(this.activeEmp.id)
      .subscribe((projects: any[]) => {
        // this.projects = projects;
        this.employeeRisk = projects;
        this.displayMyProjects();

      });
    this.commonService.getAllRisk().subscribe((projects) => {
      this.allRisk = projects;
      this.displayMyProjects();
    });



    this.commonService.getMilestoneByEmpId(this.activeEmp.id).subscribe((milestones: any[]) => {
      this.milestone = milestones;

    });
    this.commonService.getEmployeeTask(this.activeEmp.id).subscribe((task: any[]) => {
      this.tasks = task;
    });

    this.commonService.getProjectTask().subscribe((tasks) => {
      this.projectTask = tasks;
      this.displayMyProjects();
    });

    this.commonService.getProjectTaskByEmpId(this.activeEmp.id).subscribe((tasks) => {
      this.userTasks = tasks;
      this.displayMyProjects();

    });
  }
  displayMyProjects() {
    this.totalRisk = [];
    this.projectRisk = [];
    this.taskRisk = [];
    if (!this.isChecked) {
      for (var i = 0; i < this.employeeRisk.length; i++) {
        if (this.employeeRisk[i].parentid == null) {
          this.projectRisk.push(this.employeeRisk[i]);
        } else {
          this.taskRisk.push(this.employeeRisk[i]);
        }
        this.totalRisk.push(this.employeeRisk[i]);
      }
      this.tableValues = this.userProjects;
      this.allTasks = this.userTasks;
    } else {
      for (var i = 0; i < this.allRisk.length; i++) {
        if (this.allRisk[i].parentid == null) {
          this.projectRisk.push(this.allRisk[i]);
        } else {
          this.taskRisk.push(this.allRisk[i]);
        }
        this.totalRisk.push(this.allRisk[i]);
      }
      this.tableValues = this.allMainProject;
      this.allTasks = this.projectTask;

    }
    this.myFilter();
    this.allProjects();
    this.getAllTask();
    // console.log("risk", this.totalRisk);

  }
  compareGreater(date1: moment.Moment, date2: moment.Moment) {
    if (date1 && date2) {
      return (
        moment(date1).format("YYYY-MM-DD") >= moment(date2).format("YYYY-MM-DD")
      );
    } else return false;
  }
  compareLesser(date1: moment.Moment, date2: moment.Moment) {
    if (date1 && date2) {
      return (
        moment(date1).format("YYYY-MM-DD") <= moment(date2).format("YYYY-MM-DD")
      );
    } else return false;
  }

  checkboxChange(event) {
    this.isChecked = event.target.checked;
    this.resetFilter();
    // this.displayMyProjects();
    if (this.activeRiskTag) {
      this.showRiskDetail(this.activeRiskTag);
    }
    if (this.activeTag) {
      this.showProjectTable(this.activeTag);

    }
  }
  myFilter() {
    this.projects = [];
    for (var i = 0; i < this.tableValues.length; i++) {
      if (
        //this.tableValues[i].projectStatusName != "Backlog" &&
        this.tableValues[i].projectStatusName != "Not For Tracking"
      ) {
        if (
          (this.tableValues[i].projectTheme == this.filterTheme ||
            this.filterTheme == null) &&
          (this.tableValues[i].projectVertical == this.filterVertical ||
            this.filterVertical == null) &&
          (this.tableValues[i].projectTypeId == this.filterType ||
            this.filterType == null) &&
          (this.tableValues[i].projectLeadId == this.filterLeadId ||
            this.filterLeadId == null) &&
          (this.compareGreater(
            this.tableValues[i].startDate,
            this.filterStartDate
          ) ||
            this.filterStartDate == null) &&
          (this.compareLesser(
            this.tableValues[i].endDate,
            this.filterEndDate
          ) ||
            this.filterEndDate == null)
        ) {
          this.projects.push(this.tableValues[i]);
        }
      }
    }
  }

  getAllTask() {
    this.inProgressTask = [];
    this.completeTask = [];
    this.onHoldTask = [];
    this.pendingTask = [];

    var projects: any[];
    projects = this.allTasks;
    for (var i = 0; i < projects.length; i++) {
      if (!projects[i].risktype && projects[i].projectStatusName != "Not For Tracking") {
        if (projects[i].projectStatusName == "Implementation" ||
          projects[i].projectStatusName == "In-Progress" ||
          projects[i].projectStatusName == "On Going" ||
          projects[i].projectStatusName == "Rolling Out" ||
          projects[i].projectStatusName == "Inception" ||
          projects[i].projectStatusName == "Coding&DailyTesting" ||
          projects[i].projectStatusName == "Ready For Release" ||
          projects[i].projectStatusName == "Pending3rdParty" ||
          projects[i].projectStatusName == "PendingCustomer") {
          this.inProgressTask.push(projects[i]);
          //     this.inProgressCount += projects[i].count;
        }
        else if (projects[i].projectStatusName == "On Hold" ||
          projects[i].projectStatusName == "Deferred") {
          this.onHoldTask.push(projects[i]);
          //   this.onHoldCount += projects[i].count;

        }
        else if (projects[i].projectStatusName == "Closed" ||
          projects[i].projectStatusName == "Closing Out" ||
          projects[i].projectStatusName == "Completed") {
          this.completeTask.push(projects[i]);
          //     this.completeCount += projects[i].count;
        }
        else if (projects[i].projectStatusName != "Closed" &&
          projects[i].projectStatusName != "Closing Out" &&
          projects[i].projectStatusName != "Completed" &&
          projects[i].projectStatusName != "On Hold" &&
          projects[i].projectStatusName != "Deferred" &&
          projects[i].projectStatusName != "Implementation" &&
          projects[i].projectStatusName != "In-Progress" &&
          projects[i].projectStatusName != "On Going" &&
          projects[i].projectStatusName != "Rolling Out" &&
          projects[i].projectStatusName != "Inception" &&
          projects[i].projectStatusName != "Coding&DailyTesting" &&
          projects[i].projectStatusName != "Ready For Release" &&
          projects[i].projectStatusName != "Pending3rdParty" &&
          projects[i].projectStatusName != "PendingCustomer" &&
          projects[i].projectStatusName != "Not For Tracking" &&
          projects[i].projectStatusName != "Backlog") {
          this.pendingTask.push(projects[i]);
          //this.notStartedCount += projects[i].count;

        }
        //     else if (projects[i].projectStatusName == "Backlog") {
        //       this.backlog.push(projects[i]);
        //     this.backlogCount += projects[i].count;
        //     }

      }
    }
    // console.log("ctaskss", this.completeTask);
    // console.log("protaskss", this.inProgressTask);
    // console.log("petaskss", this.pendingTask);
    // console.log("hotaskss", this.onHoldTask);

    // this.showTaskTable(this.activeTag);
  }
  allProjects() {
    this.backlog = [];
    this.notStarted = [];
    this.onHold = [];
    this.complete = [];
    this.inProgress = [];

    this.inProgressCount = 0;
    this.onHoldCount = 0;
    this.notStartedCount = 0;
    this.backlogCount = 0;
    this.completeCount = 0;

    var projects: any[];
    projects = this.projects;
    for (var i = 0; i < projects.length; i++) {
      if (!projects[i].risktype && projects[i].projectStatusName != "Not For Tracking") {
        if (projects[i].projectStatusName == "Implementation" ||
          projects[i].projectStatusName == "In-Progress" ||
          projects[i].projectStatusName == "On Going" ||
          projects[i].projectStatusName == "Rolling Out" ||
          projects[i].projectStatusName == "Inception" ||
          projects[i].projectStatusName == "Coding&DailyTesting" ||
          projects[i].projectStatusName == "Ready For Release" ||
          projects[i].projectStatusName == "Pending3rdParty" ||
          projects[i].projectStatusName == "PendingCustomer") {
          this.inProgress.push(projects[i]);
          this.inProgressCount += projects[i].count;
        }
        else if (projects[i].projectStatusName == "On Hold" ||
          projects[i].projectStatusName == "Deferred") {
          this.onHold.push(projects[i]);
          this.onHoldCount += projects[i].count;

        }
        else if (projects[i].projectStatusName == "Closed" ||
          projects[i].projectStatusName == "Closing Out" ||
          projects[i].projectStatusName == "Completed") {
          this.complete.push(projects[i]);
          this.completeCount += projects[i].count;
        }
        else if (projects[i].projectStatusName != "Closed" &&
          projects[i].projectStatusName != "Closing Out" &&
          projects[i].projectStatusName != "Completed" &&
          projects[i].projectStatusName != "On Hold" &&
          projects[i].projectStatusName != "Deferred" &&
          projects[i].projectStatusName != "Implementation" &&
          projects[i].projectStatusName != "In-Progress" &&
          projects[i].projectStatusName != "On Going" &&
          projects[i].projectStatusName != "Rolling Out" &&
          projects[i].projectStatusName != "Inception" &&
          projects[i].projectStatusName != "Coding&DailyTesting" &&
          projects[i].projectStatusName != "Ready For Release" &&
          projects[i].projectStatusName != "Pending3rdParty" &&
          projects[i].projectStatusName != "PendingCustomer" &&
          projects[i].projectStatusName != "Not For Tracking" &&
          projects[i].projectStatusName != "Backlog") {
          this.notStarted.push(projects[i]);
          this.notStartedCount += projects[i].count;

        }
        else if (projects[i].projectStatusName == "Backlog") {
          this.backlog.push(projects[i]);
          this.backlogCount += projects[i].count;
        }

      }
    }
    //   console.log("not", this.notStarted);
    //  this.showProjectTable(this.activeTag);
  }
  showProjectTable(tag) {
    if (tag) {
      $("#projectDetail").collapse("show");
      $("#childTaskDetail").collapse("hide");

    }
    if (this.activeTag == tag) {
      $("#projectDetail").collapse("hide");
    }
    this.activeTag = tag;
    this.projectData = [];
    if (tag == "backlog") {
      this.projectData = this.backlog;
    }
    else if (tag == "notStarted") {
      this.projectData = this.notStarted;
    }
    else if (tag == "inProgress") {
      this.projectData = this.inProgress;
    }
    else if (tag == "complete") {
      this.projectData = this.complete;
    }
    else if (tag == "onHold") {
      this.projectData = this.onHold;
    }
  }
  showTaskTable(tag) {
    if (tag) {
      $("#taskDetail").collapse("show");
    }
    if (this.activeTag == tag) {
      $("#taskDetail").collapse("hide");
    }
    this.activeTag = tag;
    this.taskData = [];
    if (tag == "backlog") {
      this.taskData = this.backlog;
    }
    else if (tag == "pending") {
      this.taskData = this.pendingTask;
    }
    else if (tag == "inProgress") {
      this.taskData = this.inProgressTask;
    }
    else if (tag == "complete") {
      this.taskData = this.completeTask;
    }
    else if (tag == "onHold") {
      this.taskData = this.onHoldTask;
    }
  }

  applyFilter() {
    this.isChecked = true;
    this.filterLeadId = this.filterForm.value.filterLeadId.id;
    this.filterType = this.filterForm.value.projectTypeId;
    this.filterTheme = this.filterForm.value.projectTheme;
    this.filterVertical = this.filterForm.value.projectVertical;
    this.filterStartDate = this.filterForm.value.startDate;
    this.filterEndDate = this.filterForm.value.endDate;
    this.displayMyProjects();
  }
  resetFilter() {
    this.filterForm.reset();
    this.filterLeadId = null;
    this.filterType = null;
    this.filterTheme = null;
    this.filterVertical = null;
    this.filterStartDate = null;
    this.filterEndDate = null;
    this.displayMyProjects();
  }
  public handleFilter(value) {
    this.projectManagers = this.allProjectsManegersDataSource.filter(
      s => s.fullName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  showTaskDetail(id) {
    this.commonService.getProjectByParentId(id).subscribe((tasks) => {
      this.projectTaskData = [];
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].task_record) {
          tasks[i].subTask = JSON.parse(tasks[i].task_record);
        }
        if (tasks[i].subTask) {
          if (tasks[i].subTask.length == 1) {
            if (!tasks[i].subTask[0].id) {
              tasks[i].subTask = [];
            }
          }
        }
        for (var j = 0; j < tasks[i].subTask.length; j++) {
          var myallocations: any[] = [];

          if (tasks[i].subTask[j].allocationrecord) {
            myallocations = JSON.parse(tasks[i].subTask[j].allocationrecord);
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
          tasks[i].subTask[j].allocationTable = myallocations;
        }

        var myallocations: any[] = [];
        if (tasks[i].allocationRecord) {
          myallocations = JSON.parse(tasks[i].allocationRecord);
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
        tasks[i].allocationTable = myallocations;
        this.projectTaskData.push(tasks[i]);
      }
      this.loadchildTaskGrid = false;
      // console.log("task", tasks);
    });
  }
  showTaskBottomDetail(id) {
    this.commonService.getProjectByParentId(id).subscribe((tasks) => {
      this.projectTaskBottomData = [];
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].task_record) {
          tasks[i].subTask = JSON.parse(tasks[i].task_record);
        }
        if (tasks[i].subTask) {
          if (tasks[i].subTask.length == 1) {
            if (!tasks[i].subTask[0].id) {
              tasks[i].subTask = [];
            }
          }
        }
        for (var j = 0; j < tasks[i].subTask.length; j++) {
          var myallocations: any[] = [];

          if (tasks[i].subTask[j].allocationrecord) {
            myallocations = JSON.parse(tasks[i].subTask[j].allocationrecord);
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
          tasks[i].subTask[j].allocationTable = myallocations;
        }

        var myallocations: any[] = [];
        if (tasks[i].allocationRecord) {
          myallocations = JSON.parse(tasks[i].allocationRecord);
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
        tasks[i].allocationTable = myallocations;
        this.projectTaskBottomData.push(tasks[i]);
      }
      // console.log("task", tasks);
      this.loadingChildTaskProjectsGrid = false;
    });
  }
  cellClickHandler(dataItem) {
    this.loadchildTaskGrid = true;
    this.showTaskDetail(dataItem.id)
    $("#childTaskDetail").collapse("show");

  }
  showChildTaskProjects(dataItem) {
    // console.log("event", dataItem);
    this.loadingChildTaskProjectsGrid = true;
    this.showTaskBottomDetail(dataItem.id);
    $("#showChildTaskProjects").collapse("show");
  }
  showRiskDetail(tag) {
    // console.log("hey");
    this.loadingRiskGrid = true;
    if (tag) {
      $("#riskDetail").collapse("show");

    }
    if (this.activeRiskTag == tag) {
      $("#riskDetail").collapse("hide");
    }
    this.activeRiskTag = tag;

    this.riskData = [];
    if (tag == "totalRisk") {
      this.riskData = this.totalRisk;
    }
    else if (tag == "projectRisk") {
      this.riskData = this.projectRisk;
    }
    else if (tag == "taskRisk") {
      this.riskData = this.taskRisk;
    }
    this.loadingRiskGrid = false;

  }
}
