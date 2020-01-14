import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImEmployee } from '../models/im-employee.model';
import { CommonService } from './common.service';
import { ProjectStatusId } from '../models/project-status-id.model';
import { ProjectTypeId, IProjectTypeId } from '../models/project-type-id.model';
import { ProjectVertical, IProjectVertical } from '../models/project-vertical.model';
import { ProjectTheme, IProjectTheme } from '../models/project-theme.model';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  // isUserModal: BehaviorSubject<number> = null;
  isUserModalProjectId: any;
  employee: ImEmployee[] = [];
  allocations: any[] = [];
  status: ProjectStatusId[] = []
  projectTypeId: ProjectTypeId[] = [];
  projectVertical: ProjectVertical[] = [];
  projectTheme: ProjectTheme[] = [];
  projectManagers: any[] = [];
  myEmployeeAddition: any[] = [];
  myEmployeeDeletion: any[] =  [];
  filterLeadId: any;
  filterFormvalue: any;
  activeEmp: any;
  constructor(private commonService: CommonService) {
    this.activeEmp = this.commonService.getEmployeDetails();

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
        for (var i = 0; i < projectManagers.length; i++) {
          if (projectManagers[i]) {
            if (projectManagers[i].id == this.activeEmp.id) {
              this.filterLeadId = projectManagers[i].id;
              this.filterFormvalue = projectManagers[i];
              break;
            }
          }
        }
      });

  }

  openNav() {
    if (window.matchMedia("(min-width: 400px)").matches) {
      document.getElementById("overlay").style.width = "100%";
      document.getElementById("mySidenav").style.width = "50%";
    } else {
      document.getElementById("mySidenav").style.width = "90%";
    }
    // document.getElementById("main").style.marginLeft = "250px";
    // document.body.style.backgroundColor = "rgba(0,0,0,0.8)";
  }
  closeNav() {
    document.getElementById("overlay").style.width = "0";
    document.getElementById("mySidenav").style.width = "0";
    // document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "#eaeef7";
  }
}
