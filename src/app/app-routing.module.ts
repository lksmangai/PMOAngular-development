import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./Pages/dashboard/dashboard.component";
import { ProjectsComponent } from "./Pages/projects/projects.component";
import { CreateprojectComponent } from "./Pages/createproject/createproject.component";
import { TaskComponent } from "./Pages/task/task.component";
import { CreatetaskComponent } from "./Pages/createtask/createtask.component";
import { GanttchartComponent } from "./Pages/ganttchart/ganttchart.component";
import { TimesheetComponent } from "./Pages/timesheet/timesheet.component";
import { LearningComponent } from "./Pages/learning/learning.component";
import { AddusermodalComponent } from "./Pages/addusermodal/addusermodal.component";
import { FeedsComponent } from "./Pages/feeds/feeds.component";
import { UpdateprojectComponent } from "./Pages/updateproject/updateproject.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./guard/auth.guard";
import { LoginLayoutComponent } from "./Pages/Layout/login-layout/login-layout.component";
import { HomeLayoutComponent } from "./Pages/Layout/home-layout/home-layout.component";
import { MettingNotesComponent } from "./Pages/metting-notes/metting-notes.component";
import { RiskPageComponent } from "./Pages/risk-page/risk-page.component";
import { MilestonesComponent } from "./Pages/milestones/milestones.component";
import { TeamComponent } from "./Pages/team/team.component";
import { TemploginComponent } from './templogin/templogin.component';

const routes: Routes = [
  { path: "", component: LoginComponent },
  {
    path: "",
    component: LoginLayoutComponent,
    children: [
      {
        path: "login",
        component: LoginComponent
      }
    ]
  },
  { path: 'autologin', component: TemploginComponent},
  {
    path: "",
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        component: DashboardComponent
      },
      {
        path: "projects",
        component: ProjectsComponent
      },
      {
        path: "createproject",
        component: CreateprojectComponent
      },
      {
        path: "updateproject/:id",
        component: UpdateprojectComponent
      },
      {
        path: "task",
        component: TaskComponent,
      },
      {
        path: "createtask/:id",
        component: CreatetaskComponent
      },
      {
        path: "createtask/:title/:id",
        component: CreatetaskComponent
      },
      {
        path: "createtask",
        component: CreatetaskComponent
      },
      {
        path: "ganttchart",
        component: GanttchartComponent
      },
      {
        path: "timesheet",
        component: TimesheetComponent
      },
      {
        path: "learn",
        component: LearningComponent
      },
      {
        path: "addUser/:id",
        component: AddusermodalComponent
      },
      {
        path: "feeds",
        component: FeedsComponent
      },
      {
        path: "task/:id",
        component: TaskComponent
      },
      {
        path: "mettingnotes",
        component: MettingNotesComponent
      },
      {
        path: "riskpage",
        component: RiskPageComponent
      },
      {
        path: "milestones/:id",
        component: MilestonesComponent
      },
      {
        path: "team",
        component: TeamComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
