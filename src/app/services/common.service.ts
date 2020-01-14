import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project';
import { Config } from '../models/config';
import { IUser, User } from '../models/user.model';
import { ImProjects } from '../models/im-projects.model';
import { ImEmployee } from '../models/im-employee.model';
import { IProjectAllocation, ProjectAllocation } from '../models/project-allocation.model';
import { ImTimesheet, IImTimesheet } from '../models/im-timesheet.model';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class CommonService implements OnInit {
  // public config: Config = new Config();
  envUrl = environment.url;
  employee: ImEmployee[];
  activeemp: ImEmployee;
  // activeUser: IUser;
  constructor(private http: HttpClient, private router: Router) {

  }
  ngOnInit() {
    // this.activeUser = JSON.parse(sessionStorage.getItem("user"));
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(this.envUrl + "api/register/", user);
  }

  login(user: IUser): Observable<IUser> {
    return this.http
      .post<IUser>(this.envUrl + "api/authenticate/", user)
      .retry(3) // optionally add the retry
      .catch((err: HttpErrorResponse) => {

        if (err.error instanceof Error) {
          console.error('An error occurred:', err.error.message);
        } else {

          console.error(`Backend returned code ${err.status}, body was: ${err.error}`);
        }
        return Observable.of<IUser>({ id: 0 });
      });
  }



  createImProjects(project: ImProjects): Observable<ImProjects> {
    return this.http.post<ImProjects>(this.envUrl + "api/save/", project);
  }//get all Improjects with full data
  getAllImProjects(): Observable<ImProjects[]> {
    return this.http.get<ImProjects[]>(this.envUrl + "api/im-projects/");
  }
  //get all project with less data
  getAllProjects(): Observable<ImProjects[]> {
    return this.http.get<ImProjects[]>(this.envUrl + "api/projects/");
  }
  //projects whose parentId==null
  getAllMainProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/mainprojects/");
  }
  //single ImProject by its id
  getProject(id: number): Observable<any> {
    return this.http.get<any>(this.envUrl + "api/im-projects/" + id);
  }
  //project by employee id
  getEmpProject(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/allocationEmployeesparentprojects/" + id);
  }
  //return project by parentId and empId
  getEmpParentProject(pid: number, eid: number): Observable<ImProjects[]> {
    return this.http.get<ImProjects[]>(this.envUrl + "api/allocationEmployeesprojectsparentsallocation/" + pid + "/" + eid);
  }

  //get child project by its parentId
  getchildProject(id: number): Observable<any> {
    return this.http.get<any>(this.envUrl + "api/childprojects/" + id);
  }
  //get all task list by parent project  Id
  getProjectByParentId(id: number): Observable<any> {
    return this.http.get<any>(this.envUrl + "api/ProjectDetailsTaskchildprojects/" + id);
  }


  getAllTaskByParentId(id: number): Observable<any> {
    return this.http.get<any>(this.envUrl + "api/ProjectDetailsTaskbyParent/" + id);
  }

  //get all task by empId
  getEmployeeTask(id: number): Observable<any> {
    return this.http.get<any>(this.envUrl + "api/allocationEmployeesparentprojectsnotnull/" + id);
  }

  //ProjectTask
  getProjectTask(): Observable<any> {
    return this.http.get<any>(this.envUrl + "api/ProjectTask/");
  }

  getProjectTaskByEmpId(id: number): Observable<any> {
    return this.http.get<any>(this.envUrl + "api/ProjectTaskEmployeesprojects/" + id);
  }
  // ("/childprojects/{parentid
  updateImProjects(project: any): Observable<ImProjects> {
    return this.http.put<ImProjects>(this.envUrl + "api/saveupdate/", project);
  }

  deleteProject(pid: number): Observable<any> {
    return this.http.delete<any>(this.envUrl + "api/im-projectsDeleteNew/" + pid);
  }
  cloneProject(pid: number): Observable<ImProjects> {
    return this.http.get<ImProjects>(this.envUrl + "api/im-projectsclone/" + pid);
  }
  //get all projects whose riskType!=null
  getAllRisk(): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/Risktypemainprojects/");
  }
  //get all projects whose riskType!=null by empId

  getEMployeeRisk(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/allocationEmployeesparentprojectsrisktype/" + id);
  }
  //get all projects whose riskType!=null by projectId

  getProjectRisk(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/childprojectsRisktype/" + id);
  }
  //get all projects whose milestone ==true by employeeID 
  getMilestoneByEmpId(id: number): Observable<any> {
    return this.http.get<any>(this.envUrl + "api/allocationEmployeesparentprojectsmilestone/" + id);
  }
  //get all milestones by projectid
  getMilestones(id: number): Observable<any> {
    return this.http.get<any>(this.envUrl + "api/childprojectsMilestone/" + id);
  }





  projectsType(): Observable<ImProjects[]> {
    return this.http.get<ImProjects[]>(this.envUrl + "api/project-type-ids");
  }
  projectsBuckets(): Observable<ImProjects[]> {
    return this.http.get<ImProjects[]>(this.envUrl + "api/project-bucket-ids");
  }
  projectsStatus(): Observable<ImProjects[]> {
    return this.http.get<ImProjects[]>(this.envUrl + "api/project-status-ids");
  }
  projectsVerticals(): Observable<ImProjects[]> {
    return this.http.get<ImProjects[]>(this.envUrl + "api/project-verticals");
  }
  projectsTheme(): Observable<ImProjects[]> {
    return this.http.get<ImProjects[]>(this.envUrl + "api/project-themes");
  }
  projectsPriority(): Observable<ImProjects[]> {
    return this.http.get<ImProjects[]>(this.envUrl + "api/opportunity-priority-ids");
  }
  projectsAllocation(): Observable<ProjectAllocation[]> {
    return this.http.get<ProjectAllocation[]>(this.envUrl + "api/project-allocations");
  }



  //get allocation by allocation id
  getprojectsAllocation(id: number): Observable<ProjectAllocation> {
    return this.http.get<ProjectAllocation>(this.envUrl + "api/project-allocations/" + id);
  }
  //return allocation by project id
  allocationProjects(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/allocationProjects/" + id);
  }
  // return allocation by empId
  allocationEmployee(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/allocationEmployees/" + id);
  }
  allocationTimesheetEmp(date: string, id: number): Observable<ImProjects[]> {
    return this.http.get<ImProjects[]>(this.envUrl + "api/timesheetDateEmployees/" + date + "/" + id);
  }

  allocation1Projects(): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/allocation/");
  }

  //get allocation by EmpId
  getAllocationByEmpId(eid: number): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/allocationDetailsTimesheetEmployees/" + eid);
  }
  //get allocation by EmpId and parentId
  getAllocationTimesheetByEmpIdParentId(pid: number, eid: number): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/allocationDetailsTimesheetEmployeesprojectsPPDparentid/" + pid + "/" + eid);
  }

  //get allocation by EmpId and parentId
  getAllocationByEmpIdParentId(pid: number, eid: number): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/allocationDetailsEmployeesprojectsPPDparentid/" + pid + "/" + eid);
  }

  getAllocationByEmpIdParentIdAndDate(pid: number, eid: number, logday: string): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/allocationDetailsTimesheetFilterppdparentid/" + logday + "/" + eid + "/" + pid);
  }
  //
  getAllocationTimesheetByEmpIdAndDate(eid: number, logday: string): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/allocationDetailsTimesheetDateEmployees/" + logday + "/" + eid);
  }

  createProjectsAllocation(allocation: any): Observable<IProjectAllocation> {
    return this.http.post<IProjectAllocation>(this.envUrl + "api/createProjectAllocation", allocation);
  }
  deleteProjectsAllocation(pid: number, eid: number): Observable<any> {
    return this.http.delete<any>(this.envUrl + "api/projectallocationDelete/" + pid + "/" + eid);
  }
  getAllImUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.envUrl + "api/usersNew");
  }
  getAllImEmployees(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.envUrl + "api/im-employees");
  }
  createImTimesheet(timesheet: IImTimesheet): Observable<ImTimesheet> {
    return this.http.post<IImTimesheet>(this.envUrl + "api/createim-timesheets", timesheet);
  }

  getAllImTimesheet(): Observable<ImTimesheet[]> {
    return this.http.get<ImTimesheet[]>(this.envUrl + "api/im-timesheets");
  }

  //get timesheet by empId and ProjId
  getTimesheet(eid: number, pid: number): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/timesheetEmployeeProjects/" + eid + "/" + pid);
  }

  //
  getTimesheetHoursByEmpId(eid: number): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/imTimesheetHours/" + eid);
  }


  // @GetMapping("/timesheetDateEmployees/{logday}/{imEmployeeId}")

  getTimesheetByEmpIdAndLogday(logday: any, eid: number): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/timesheetDateEmployees/" + logday + "/" + eid);
  }
  // get timesheet hours summation by empId
  getTimesheetbyEmpIdBetweenDays(eid: number, endday: any, startday: any): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/imTimesheetHoursimEmployeeId/" + eid + "/" + endday + "/" + startday);
  }
  //get timesheet hours 
  getTimesheetbyBetweenDays(endday: any, startday: any): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/imTimesheetHoursByDate/" + endday + "/" + startday);
  }
  putImTimesheet(timesheet: ImTimesheet): Observable<ImTimesheet[]> {
    return this.http.put<ImTimesheet[]>(this.envUrl + "api/im-timesheets", timesheet);
  }
  getAllProjectManagers(): Observable<any[]> {
    return this.http.get<any[]>(this.envUrl + "api/projectManagers");
  }

  saveUser(emp, project) {
    var user: ImEmployee[] = emp;
    //var allocation: IProjectAllocation;
    user.forEach(u => {
      var allocation = { "imEmployee": u.id, "imProjects": project.id };

      // allocation = new ProjectAllocation(null, 100, u, project);
      this.createProjectsAllocation(allocation).subscribe((resp) => {
        console.log(resp);
        // if (u.id == user[user.length - 1].id) {

        // }
        // $("#useradd").modal("hide");
        // $("#useradd2").modal("hide");
        // $("#useradd3").modal("hide");
        // $("#userAddtask").modal("hide");
        // $("#userAddSubTask").modal("hide");
      });
    });
  }
  activeEmp(userId) {
    this.getAllImEmployees().subscribe((employee: ImEmployee[]) => {
      this.employee = employee;
      for (var i = 0; i < this.employee.length; i++) {
        if (this.employee[i].qnowUser.user.id == userId)
          this.activeemp = this.employee[i];
      }
      console.log("", this.activeemp);

      // sessionStorage.setItem('employee', JSON.stringify(this.activeemp));
      sessionStorage.setItem('newEmployee', JSON.stringify(this.activeemp));
      this.router.navigate(['/dashboard']);

    });
  }

  getEmployeDetails() {
    return JSON.parse(sessionStorage.getItem('newEmployee'))
  }

  getUserDetails() {
    return JSON.parse(sessionStorage.getItem('newUser'));
  }
} 