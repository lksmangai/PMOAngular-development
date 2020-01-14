import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NavbarComponent } from "./navbar/navbar.component";
import { DashboardComponent } from "./Pages/dashboard/dashboard.component";
import { ArchwizardModule } from "angular-archwizard";
import { GridModule } from "@progress/kendo-angular-grid";
import { ProjectsComponent } from "./Pages/projects/projects.component";
import { CreateprojectComponent } from "./Pages/createproject/createproject.component";
import {
  DropDownListComponent,
  DropDownListModule,
  DropDownsModule
} from "@progress/kendo-angular-dropdowns";
import { EditorModule } from "@progress/kendo-angular-editor";
import { ToolBarModule } from "@progress/kendo-angular-toolbar";
import { UploadModule } from "@progress/kendo-angular-upload";
import { HttpClientModule } from "@angular/common/http";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { TaskComponent } from "./Pages/task/task.component";
import { CreatetaskComponent } from "./Pages/createtask/createtask.component";
import { LearningComponent } from "./Pages/learning/learning.component";
import { GanttchartComponent } from "./Pages/ganttchart/ganttchart.component";
import { from } from "rxjs";
import { AddusermodalComponent } from "./Pages/addusermodal/addusermodal.component";
import { timePipe } from "./pipe/time";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { initialPipe } from "./pipe/initial";
import { LoginComponent } from "./login/login.component";
import { SchedulerModule } from "@progress/kendo-angular-scheduler";
import { TimesheetComponent } from "./Pages/timesheet/timesheet.component";
import { FeedsComponent } from "./Pages/feeds/feeds.component";
import { UpdateprojectComponent } from "./Pages/updateproject/updateproject.component";
import { RiskmodalComponent } from "./Pages/riskmodal/riskmodal.component";
import { taskPipe } from "./pipe/task";
import { LoginLayoutComponent } from "./Pages/Layout/login-layout/login-layout.component";
import { HomeLayoutComponent } from "./Pages/Layout/home-layout/home-layout.component";
import { MettingNotesComponent } from "./Pages/metting-notes/metting-notes.component";
import { RiskPageComponent } from './Pages/risk-page/risk-page.component';
import { MilestonesComponent } from './Pages/milestones/milestones.component';
import { TaskListComponent } from './Pages/task-list/task-list.component';
import { TeamComponent } from './Pages/team/team.component';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { NgxLoadingModule } from "ngx-loading";
import { ToastrModule } from 'ngx-toastr';
import { TemploginComponent } from './templogin/templogin.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    ProjectsComponent,
    CreateprojectComponent,
    TaskComponent,
    CreatetaskComponent,
    LearningComponent,
    GanttchartComponent,
    AddusermodalComponent,
    LoginComponent,
    timePipe,
    initialPipe,
    TimesheetComponent,
    FeedsComponent,
    UpdateprojectComponent,
    RiskmodalComponent,
    taskPipe,
    LoginLayoutComponent,
    HomeLayoutComponent,
    MettingNotesComponent,
    RiskPageComponent,
    MilestonesComponent,
    TaskListComponent,
    TeamComponent,
    TemploginComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    InputsModule,
    BrowserAnimationsModule,
    ArchwizardModule,
    GridModule,
    // DropDownListComponent,
    DropDownListModule,
    EditorModule,
    ToolBarModule,
    UploadModule,
    HttpClientModule,
    DragDropModule,
    DateInputsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InputsModule,
    SchedulerModule,
    DropDownsModule,
    DialogsModule,
    ButtonsModule,
    NgxLoadingModule,
    ToastrModule.forRoot({
      timeOut: 2500,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
  ],

  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
