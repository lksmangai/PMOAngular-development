import { Component, OnInit, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { sampleData } from "../../data";
import { CommonService } from "src/app/services/common.service";
import { Subscriber } from "rxjs";
import { all } from "q";
import { projection } from "@angular/core/src/render3";
import { Project } from "src/app/models/project";
import { ImProjects } from "src/app/models/im-projects.model";
import {
  ProjectStatusId,
  IProjectStatusId
} from "src/app/models/project-status-id.model";
import { IProjectAllocation } from "src/app/models/project-allocation.model";
import { routerNgProbeToken } from "@angular/router/src/router_module";
import { EventEmitter } from "events";
import { FormBuilder, FormGroup } from "@angular/forms";
import { IUser } from "src/app/models/user.model";
import { ImEmployee } from "src/app/models/im-employee.model";
import { IProjectTypeId } from "src/app/models/project-type-id.model";
import { IProjectVertical } from "src/app/models/project-vertical.model";
import { IProjectTheme } from "src/app/models/project-theme.model";
import * as moment from "moment";
import { SidenavService } from "src/app/services/sidenav.service";
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.css"]
})
export class ProjectsComponent implements OnInit {
  public loading = false;
  public opened = false;
  flag: boolean;
  deleteProject: any;
  selectedProjectId: any = null;
  selectedProject: any = null;
  projectdata: any[] = [];
  activeTag = "started";
  trackTitle: string;
  public viewtype = "card";
  projects: any[] = [];
  allocations: IProjectAllocation[] = [];
  status: IProjectStatusId[] = [];
  inProgressProjects: ImProjects[] = [];
  onHoldProjects: ImProjects[] = [];
  completedProjects: ImProjects[] = [];
  public tableValues: any[] = [];

  public selecteduser: number;
  activeUser: IUser;
  employee: ImEmployee[];
  activeEmp: ImEmployee;
  isChecked: boolean;
  formgroup: FormGroup;
  updateProject: ImProjects = null;
  flagUpdate: boolean;
  projectManagers: any[] = [];
  projectTheme: IProjectTheme[] = [];
  projectTypeId: IProjectTypeId[];
  projectVertical: IProjectVertical[];
  filterLeadId: any = null;
  filterTheme: any = null;
  filterVertical: any = null;
  filterType: any = null;
  filterStartDate: moment.Moment = null;
  filterEndDate: moment.Moment = null;
  filterForm: FormGroup;
  createprojectFlag: boolean;
  projectFlag: boolean;
  userModelflag: boolean;
  public defaultItem: { fullName: string; id: number } = {
    fullName: "Select user...",
    id: null
  };

  constructor(
    private router: Router,
    private sideNav: SidenavService,
    private commonService: CommonService,
    private formbuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.filterForm = this.formbuilder.group({
      filterLeadId: [],
      projectTheme: [],
      projectTypeId: [],
      projectVertical: [],
      startDate: [],
      endDate: []
    });
  }
  // all(tag) {
  //   $("#all").tab("show");

  // }
  openUserModal(project) {
    // this.flag = true;
    // console.log("f", this.flag);
    // console.log("pro", project);

    this.sideNav.isUserModalProjectId = project;
    if (project) {
      this.sideNav.allocations = project.allocationTable;
      // console.log(this.sideNav.allocations);
      this.userModelflag = project.id;
    }
    $("#addduser").modal("show");
    this.selectedProjectId = project;


  }
  isSelected(projectId) {
    // console.log("projectId", projectId);
    // console.log("userModelflag", this.userModelflag);

    // this.userModelflag.findIndex()
    // if (this.userModelflag) {
    //   return true;
    // }
    return projectId == this.userModelflag;
    // return true;
  }

  ngOnInit() {
    this.loading = true;

    $(document).ready(function () {
      $(".allow-focus").on("click", function (event) {
        event.stopPropagation();
      });
    });

    this.activeEmp = this.commonService.getEmployeDetails();
    this.activeUser = JSON.parse(sessionStorage.getItem("newUser"));
    $("#useradd").on("hidden.bs.modal", function (e) {
      $("#useradd .modal-body")
        .find("input:radio, input:checkbox")
        .prop("checked", false);
    });
    // if (this.filterLeadId == null) {
    //   this.filterLeadId = this.sideNav.filterLeadId;
    //   this.filterForm.value.filterLeadId = this.sideNav.filterFormvalue;
    // }
    this.employee = [];
    this.commonService.getAllImEmployees().subscribe((employee: ImEmployee[]) => {
      for (var i = 0; i < employee.length; i++) {
        if (employee[i].qnowUser.user.activated == true) {
          this.employee.push(employee[i]);
        }
      }
      this.employee.sort((a, b) => a.qnowUser.user.firstName.localeCompare(b.qnowUser.user.firstName))
    });
    this.commonService.projectsStatus().subscribe(projectStatus => {
      this.status = projectStatus;
      this.status.sort((a, b) => a.name.localeCompare(b.name))
      // console.log("status", this.status);

    });

    this.commonService
      .projectsType()
      .subscribe((projectType: IProjectTypeId[]) => {
        this.projectTypeId = projectType;
        this.projectTypeId.sort((a, b) => a.name.localeCompare(b.name))

      });

    this.commonService
      .projectsVerticals()
      .subscribe((projectsVerticals: IProjectVertical[]) => {
        this.projectVertical = projectsVerticals;
        this.projectVertical.sort((a, b) => a.name.localeCompare(b.name))

      });
    this.commonService
      .projectsTheme()
      .subscribe((projectsTheme: IProjectTheme[]) => {
        this.projectTheme = projectsTheme;
        this.projectTheme.sort((a, b) => a.name.localeCompare(b.name))

        //this.projectTheme.sort((a, b) => a.qnowUser.user.firstName.localeCompare(b.qnowUser.user.firstName))

      });

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
        if (this.filterLeadId == null) {
          for (var i = 0; i < projectManagers.length; i++) {
            if (projectManagers[i]) {
              if (projectManagers[i].id == this.activeEmp.id) {
                this.createprojectFlag = true;
                this.filterLeadId = projectManagers[i].id;

                this.filterForm.value.filterLeadId = projectManagers[i];
                break;
              }
            }
          }
        }
      });
    this.isChecked = false;
    if (!this.isChecked) {
      this.activeUserProjects();
    } else {
      this.allProjects();
    }

    this.defaultItem.fullName =
      this.activeEmp.qnowUser.user.firstName +
      " " +
      this.activeEmp.qnowUser.user.lastName;
    this.defaultItem.id = this.activeEmp.id;
  }
  activeUserProjects() {
    this.activeEmp = this.commonService.getEmployeDetails();
    this.commonService.getEmpProject(this.activeEmp.id).subscribe(projects => {
      this.tableValues = projects;
      this.myFilter();
    });
    // console.log("projects", this.tableValues);
  }

  allProjects() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });

    this.commonService.getAllMainProjects().subscribe((projects: any[]) => {
      this.tableValues = projects;
      this.myFilter();
      // setTimeout(function () {
      //   $(function () {
      //     $('[data-toggle="tooltip"]').tooltip();
      //   });
      // }, 500);
    });
    // console.log("projects", this.tableValues);
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
  myFilter() {
    this.projects = [];
    // console.log("", this.filterLeadId);
    for (var i = 0; i < this.tableValues.length; i++) {
      if (
        this.tableValues[i].projectStatusName != "Backlog" &&
        this.tableValues[i].projectStatusName != "Not For Tracking"
      ) {
        if (
          // moment(date1).format("YYYY-MM-DD")
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
          var myallocations: any[] = [];
          if (this.tableValues[i].allocationRecord) {
            myallocations = JSON.parse(this.tableValues[i].allocationRecord);
            // console.log("myallocations", myallocations);
          }
          if (myallocations == null) {
            myallocations = [];
          }
          this.tableValues[i].allocationTable = myallocations;
          this.projects.push(this.tableValues[i]);
        }
      }

    }
    this.inProgressProjects = [];

    this.inProgressProjects = this.projects.filter(data =>
      data.projectStatusName == "Implementation" ||
      data.projectStatusName == "Open" ||
      data.projectStatusName == "In-Progress" ||
      data.projectStatusName == "On Going" ||
      data.projectStatusName == "Rolling Out" ||
      data.projectStatusName == "Inception" ||
      data.projectStatusName == "Coding&DailyTesting" ||
      data.projectStatusName == "Ready For Release" ||
      data.projectStatusName == "Pending3rdParty" ||
      data.projectStatusName == "PendingCustomer" ||
      data.projectStatusName == "Not For Tracking"
    );
    // console.log("inProgresscont", this.inProgressProjects);
    this.onHoldProjects = [];
    this.onHoldProjects = this.projects.filter(data =>
      data.projectStatusName == null ||
      data.projectStatusName == "On Hold" ||
      data.projectStatusName == "Deferred"
    );
    // console.log("onHoldcount", this.onHoldProjects);

    this.completedProjects = [];
    this.completedProjects = this.projects.filter(data =>
      data.projectStatusName == "Closed" ||
      data.projectStatusName == "Closing Out" ||
      data.projectStatusName == "Completed"
    );
    // console.log("completecount", this.completedProjects);
    this.loading = false;

    this.tabOnClick(this.activeTag);
  }
  checkboxChange(event) {
    this.isChecked = event.target.checked;
    this.resetFilter();
    this.loading = true;

    if (!this.isChecked) {
      this.activeUserProjects();
    } else {
      this.allProjects();
    }
  }

  tabOnClick(tag) {
    this.activeTag = tag;
    $("#all").tab("show");
    this.projectdata = [];

    if (tag == "all") {
      this.projectdata = this.projects;
    }
    else if (tag == "started") {
      this.projectdata = this.inProgressProjects;

    } else if (tag == "onHold") {
      this.projectdata = this.onHoldProjects;
    }
    else if (tag == "complete") {
      this.projectdata = this.completedProjects;
    }
  }

  setviewtype(type) {
    this.viewtype = type;
  }

  createRisk(project) {
    $("#createtask").modal("show");
    this.trackTitle = "Risk";
    this.selectedProject = project;
  }

  task(project) {
    this.router.navigate(["/task", project.id]);
  }

  projectRefresh($event) {
    const result = $event;
    if (result == true) {
      if (this.isChecked) {
        this.allProjects();
      } else {
        this.activeUserProjects();
      }
      $("#createproject").modal("hide");
    }
  }
  userRefresh($event) {
    const result = $event;
    if (result == true) {
      this.userModelflag = null;
      if (this.isChecked) {
        this.allProjects();

      } else {
        this.activeUserProjects();

      }
      $("#useradd").modal("hide");
    }
  }
  applyFilter() {
    this.isChecked = true;

    if (this.filterForm.value) {
      if (this.filterForm.value.filterLeadId) {
        this.filterLeadId = this.filterForm.value.filterLeadId.id;
      } else {
        this.filterLeadId = null;
      }
      this.filterType = this.filterForm.value.projectTypeId;
      this.filterTheme = this.filterForm.value.projectTheme;
      this.filterVertical = this.filterForm.value.projectVertical;
      this.filterStartDate = this.filterForm.value.startDate;
      this.filterEndDate = this.filterForm.value.endDate;
      this.myFilter();
    }
    // console.log("filter", this.filterForm.value);
  }
  resetFilter() {
    this.loading = true;
    this.filterForm.reset();
    this.filterLeadId = null;
    this.filterType = null;
    this.filterTheme = null;
    this.filterVertical = null;
    this.filterStartDate = null;
    this.filterEndDate = null;
    // this.applyFilter();

    this.myFilter();
  }
  createProject() {
    // $("#createproject").modal("show");
    this.sideNav.openNav();

    this.updateProject = null;
    this.projectFlag = true;
  }
  editProject(project) {
    this.sideNav.openNav();
    this.updateProject = project;
    this.projectFlag = true;
    //   this.flagUpdate = true;
    //this.router.navigate(["./updateproject", project.id]);
    // $("#updateproject").modal("show");
  }
  // Side nav Panel
  closeproject() {
    this.sideNav.closeNav();
    this.projectFlag = false;
  }
  public confirmDeletion(dataItem: any) {
    this.opened = true;
    this.deleteProject = dataItem.id;
  }
  public close(status) {
    console.log(`Dialog result: ${status}`);
    if (status == "yes") {
      this.loading = true;
      this.commonService.deleteProject(this.deleteProject).subscribe((resp: any) => {
        // console.log("resp", resp);
        if (resp.msg == "record successfully deleted") {
          this.toastr.success("Project Deleted Successfully!");
          if (this.isChecked) {
            this.allProjects();
          } else {
            this.activeUserProjects();
          }
        }
        else {
          this.toastr.warning(resp.msg);

          this.loading = false;
        }
      },
        (error) => {
          alert(error.message);
          this.loading = false;
        });
    }
    this.opened = false;
  }
  cloneProject(project) {
    this.loading = true;

    this.commonService.cloneProject(project.id).subscribe((resp) => {
      console.log("resp", resp);
      if (this.isChecked) {
        this.allProjects();

      } else {
        this.activeUserProjects();

        // this.ngOnInit();
      }
    });
  }
}
