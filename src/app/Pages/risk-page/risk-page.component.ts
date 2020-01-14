import { Component, OnInit } from '@angular/core';
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { products } from "src/app/data";
import { CommonService } from "src/app/services/common.service";
import { SidenavService } from "src/app/services/sidenav.service";
import * as moment from "moment";
import { FormGroup, FormBuilder } from '@angular/forms';
import { IProjectTheme } from 'src/app/models/project-theme.model';
import { IProjectTypeId } from 'src/app/models/project-type-id.model';
import { IProjectVertical } from 'src/app/models/project-vertical.model';
import { IProjectStatusId } from 'src/app/models/project-status-id.model';

@Component({
  selector: "app-risk-page",
  templateUrl: "./risk-page.component.html",
  styleUrls: ["./risk-page.component.css"]
})
export class RiskPageComponent implements OnInit {
  public gridView: GridDataResult;
  public items: any[] = products;
  public mySelection: number[] = [];
  public myPrevious: number[] = [];
  public pageSize = 10;
  public skip = 0;
  isChecked: boolean;
  activeEmp: any;
  risks: any[] = [];
  projectRisk: any[] = [];
  taskRisk: any[] = [];
  totalRiskCount: number = 0;
  openRiskCount: number = 0;
  closedRiskCount: number = 0;
  allRisk: any[] = [];
  projectManagers: any[] = [];
  projectTheme: IProjectTheme[] = [];
  projectTypeId: IProjectTypeId[];
  projectVertical: IProjectVertical[];
  status: IProjectStatusId[] = [];
  verticals: any[] = [];

  allRisks: any[] = [];
  activeUserRisks: any[] = [];
  tableValues: any[] = [];
  projects: any[] = [];

  filterLeadId: any = null;
  filterTheme: any = null;
  filterVertical: any = null;
  filterType: any = null;
  filterStartDate: moment.Moment = null;
  filterEndDate: moment.Moment = null;
  filterForm: FormGroup;
  updateProject: any;
  projectFlag: boolean = false;
  constructor(
    private commonService: CommonService,
    private sideNav: SidenavService,
    private formbuilder: FormBuilder
  ) {
    this.loadItems();

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
    this.isChecked = true;
    this.commonService
      .getEMployeeRisk(this.activeEmp.id)
      .subscribe((projects: any[]) => {
        this.allRisks = projects;
        this.displayMyProjects();
      });
    this.commonService.getAllRisk().subscribe((projects) => {
      this.activeUserRisks = projects;
      this.displayMyProjects();
    });
    this.status = this.sideNav.status;

    this.projectTypeId = this.sideNav.projectTypeId;

    this.projectVertical = this.sideNav.projectVertical;

    this.projectTheme = this.sideNav.projectTheme;

    this.projectManagers = this.sideNav.projectManagers;
    // this.employee = [];
    // this.commonService.getAllImEmployees().subscribe((employee: ImEmployee[]) => {
    //   for (var i = 0; i < employee.length; i++) {
    //     if (employee[i].qnowUser.user.activated == true) {
    //       this.employee.push(employee[i]);
    //     }
    //   }
    //   this.employee.sort((a, b) => a.qnowUser.user.firstName.localeCompare(b.qnowUser.user.firstName))
    // });
    this.commonService.projectsStatus().subscribe(projectStatus => {
      this.status = projectStatus;
      this.status.sort((a, b) => a.name.localeCompare(b.name))

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

    // if (this.filterLeadId == null) {
    //   this.filterLeadId = this.sideNav.filterLeadId;
    //   this.filterForm.value.filterLeadId = this.sideNav.filterFormvalue;
    // }
    // this.commonService
    //   .getAllProjectManagers()
    //   .subscribe((projectManagers: any[]) => {
    //     this.projectManagers = [];
    //     for (var j = 0; j < projectManagers.length; j++) {
    //       if (projectManagers[j]) {
    //         projectManagers[j].fullName = projectManagers[j].project_lead_first_name + " " + projectManagers[j].project_lead_last_name;
    //         this.projectManagers.push(projectManagers[j]);

    //       }
    //     }
    //     this.projectManagers.sort((a, b) => a.fullName.localeCompare(b.fullName))
    //   });
  }

  displayMyProjects() {
    this.totalRiskCount = 0;
    this.openRiskCount = 0;
    this.closedRiskCount = 0;
    if (!this.isChecked) {
      this.tableValues = this.allRisks;
    } else {
      this.tableValues = this.activeUserRisks;
    }
    this.myFilter();
    this.risk();
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();

    // Optionally, clear the selection when paging
    // this.mySelection = [];
  }

  private loadItems(): void {
    this.gridView = {
      data: this.items.slice(this.skip, this.skip + this.pageSize),
      total: this.items.length
    };
  }
  checkboxChange(event) {
    this.isChecked = event.target.checked;
    this.resetFilter();
    this.displayMyProjects();
  }

  risk() {
    this.taskRisk = [];
    this.projectRisk = [];
    var projects: any[] = [];
    var closedRisks: any[] = [];
    projects = this.projects;
    this.totalRiskCount = 0;
    this.openRiskCount = 0;
    this.closedRiskCount = 0;

    this.allRisks = [];
    this.verticals = [];

    console.log(projects);
    for (var i = 0; i < projects.length; i++) {
      if (projects[i].percentCompleted != 100 && projects[i].projectStatusName != "Closed" && projects[i].projectStatusName != "Completed") {
        if (!projects[i].projectVerticalName) {
          projects[i].projectVerticalName = "Blank";
        }
        var index = this.verticals.findIndex((x) => {
          return projects[i].projectVerticalName == x;
        });
        if (index < 0) {
          this.verticals.push(projects[i].projectVerticalName);
          index = this.verticals.length - 1;
          var myProjects = [];
          this.allRisks.push(myProjects);
        }
        this.allRisks[index].push(projects[i]);
        this.openRiskCount++;
      } else {
        closedRisks.push(projects[i]);
        this.closedRiskCount++;
      }
      this.totalRiskCount++;

    }
    this.verticals.push("Closed");
    this.allRisks.push(closedRisks);
    console.log(this.allRisks);
    console.log(this.verticals);
  }
  // allRisk() {
  //   this.taskRisk = [];
  //   this.projectRisk = [];
  //   this.commonService.getAllRisk().subscribe((projects: any[]) => {
  //     this.totalRiskCount = 0;
  //     for (var i = 0; i < projects.length; i++) {
  //       if (projects[i].parentid == null) {
  //         this.projectRisk.push(projects[i]);
  //       } else {
  //         this.taskRisk.push(projects[i]);
  //       }
  //       this.totalRiskCount++;

  //     }

  //   });
  // }
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
    for (var i = 0; i < this.tableValues.length; i++) {
      if (
        // this.tableValues[i].projectStatusName != "Backlog" &&
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
          }
          if (myallocations == null) {
            myallocations = [];
          }
          this.tableValues[i].allocationTable = myallocations;
          this.projects.push(this.tableValues[i]);
        }
      }
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
      this.displayMyProjects();
    }
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
  openrisk() {
    this.sideNav.openNav();
    this.updateProject = null;
  }
  closerisk() {
    this.sideNav.closeNav();
  }
  createProject() {
    // $("#createproject").modal("show");
    this.sideNav.openNav();

    this.updateProject = null;
    this.projectFlag = true;
  }
  editProject(project) {

    this.updateProject = project;
    this.projectFlag = true;
    this.sideNav.openNav();
    //   this.flagUpdate = true;
    //this.router.navigate(["./updateproject", project.id]);
    // $("#updateproject").modal("show");
  }
  // Side nav Panel
  closeproject() {
    this.sideNav.closeNav();
    this.projectFlag = false;
  }
  projectRefresh($event) {
    console.log("event", $event);
    const result = $event;
    if (result == true) {
      this.ngOnInit();
      console.log("Init", $event);
    }
  }

  doUpdate(currentItem, previousItem, statusName) {
    for (var i = 0; i < currentItem.length; i++) {
      var found = false;
      for (var j = 0; j < previousItem.length; j++) {
        if (currentItem[i] == previousItem[j]) {
          found = true;
          break;
        }
      }
      if (!found) {
        var myproect = this.projects.filter(p => p.id == currentItem[i]);

        if (myproect.length) {
          var reqStatusName = statusName;
          if (myproect[0].projectStatusName == "Closed") {
            if (statusName == "Closed" || statusName == "Completed") {
              reqStatusName = "In-Progress";
            } else {
              reqStatusName = "Closed";
            }
          }
          var status: IProjectStatusId[] = this.status.filter(
            p => p.name == reqStatusName
          );
          myproect[0].projectStatusId = status[0].id;
          this.commonService.updateImProjects(myproect[0]).subscribe((resp: any) => {
            //  this.projects[this.projects.indexOf(this.project)] = project;
            console.log("resp", resp);


          });
        }

      }
    }
  }
  onSelectedKeysChange(dataItem: any): void {
    var dataItemlen = dataItem.length;
    var previousItemlen = this.myPrevious.length;
    console.log(dataItem);
    console.log(this.myPrevious);
    if (dataItemlen > previousItemlen) {

      this.doUpdate(dataItem, this.myPrevious, "Closed");
    } else {
      if (dataItemlen < previousItemlen) {
        this.doUpdate(this.myPrevious, dataItem, "In-Progress");
      }
    }

    this.myPrevious = dataItem.slice(0);
    //this.projectRefresh(true);

  }
  public editClick({ dataItem, rowIndex, columnIndex }: any): void {
    console.log(dataItem);
    console.log(rowIndex);
    console.log(columnIndex);
    this.editProject(dataItem);

  }
}
