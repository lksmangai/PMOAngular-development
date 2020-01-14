import { Component, OnInit } from '@angular/core';
import { IProjectBucketId } from 'src/app/models/project-bucket-id.model';
import { IProjectTypeId } from 'src/app/models/project-type-id.model';
import { IProjectVertical } from 'src/app/models/project-vertical.model';
import { IOpportunityPriorityId } from 'src/app/models/opportunity-priority-id.model';
import { IProjectStatusId } from 'src/app/models/project-status-id.model';
import { IProjectTheme } from 'src/app/models/project-theme.model';
import { ImProjects, IImProjects } from 'src/app/models/im-projects.model';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/models/user.model';
import { CommonService } from 'src/app/services/common.service';
import { ImEmployee } from 'src/app/models/im-employee.model';
import { IProjectAllocation, ProjectAllocation } from 'src/app/models/project-allocation.model';
declare var $: any;

@Component({
  selector: 'app-updateproject',
  templateUrl: './updateproject.component.html',
  styleUrls: ['./updateproject.component.css']
})
export class UpdateprojectComponent implements OnInit {

  selectedProject: ImProjects;
  editProject: IImProjects[];
  opportunityPriorityId: IOpportunityPriorityId[];
  projectStatusId: IProjectStatusId[];
  projectTheme: IProjectTheme[];
  projectTypeId: IProjectTypeId[];
  projectVertical: IProjectVertical[];
  projectBucketId: IProjectBucketId[];
  user: IUser[];
  public range = { start: null, end: null };
  uploadSaveUrl = 'saveUrl';
  uploadRemoveUrl = 'removeUrl';
  projects: ImProjects[] = [];
  myForm: FormGroup;
  editForm: FormGroup;
  myEmplyee: ImEmployee[] = [];

  projectNr = (new Date()).getFullYear() + "_" + Math.floor(1000 + Math.random() * 9000);

  constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private commonService: CommonService) {
    this.myForm = this.fb.group({
      id: [],
      projectName: [''],
      projectNr: [''],
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

    this.commonService.getAllImProjects().subscribe((projects: ImProjects[]) => {
      this.projects = projects;
    });
    this.commonService.projectsType().subscribe((projectType: IProjectTypeId[]) => {
      this.projectTypeId = projectType;
    });
    this.commonService.projectsBuckets().subscribe((projectBuckets: IProjectBucketId[]) => {
      this.projectBucketId = projectBuckets;
    });
    this.commonService.projectsStatus().subscribe((projectStatus: IProjectStatusId[]) => {
      this.projectStatusId = projectStatus;
    });
    this.commonService.projectsVerticals().subscribe((projectsVerticals: IProjectVertical[]) => {
      this.projectVertical = projectsVerticals;
    });
    this.commonService.projectsTheme().subscribe((projectsTheme: IProjectTheme[]) => {
      this.projectTheme = projectsTheme;
    });
    this.commonService.projectsPriority().subscribe((projectsPriority: IOpportunityPriorityId[]) => {
      this.opportunityPriorityId = projectsPriority;
    });
    this.commonService.getAllImUsers().subscribe((users) => {
      this.user = users;
    });

  }
  edit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'));
    var editProject: IImProjects[] = [];
    for (var i = 0; i < this.projects.length; i++) {
      var data: IImProjects = this.projects[i];
      if (data.id == id) {
        editProject.push(data)
        this.editProject = editProject;
        this.myForm.value.id = id;
        break;
      }
    }

    return editProject;
  }
  projectPage() {
    this.router.navigate(['./projects']);
  }
  sendUser($event) {
    this.myEmplyee = $event;
    $("#useradd").modal("hide");
  }
  projectSave(goTask) {
    var project: IImProjects = this.editProject[0];
    var keydProject: IImProjects = this.myForm.value;

    var themes: IProjectTheme[] = this.projectTheme.filter(p => p.id == keydProject.projectTheme);
    project.projectTheme = themes[0];



    var status: IProjectStatusId[] = this.projectStatusId.filter(p => p.id == keydProject.projectStatusId);
    project.projectStatusId = status[0];


    var priority: IOpportunityPriorityId[] = this.opportunityPriorityId.filter(p => p.id == keydProject.opportunityPriorityId);
    project.opportunityPriorityId = priority[0];


    var vertical: IProjectVertical[] = this.projectVertical.filter(p => p.id == keydProject.projectVertical);
    project.projectVertical = vertical[0];



    var bucket: IProjectBucketId[] = this.projectBucketId.filter(p => p.id == keydProject.projectBucketId);
    project.projectBucketId = bucket[0];



    var type: IProjectTypeId[] = this.projectTypeId.filter(p => p.id == keydProject.projectTypeId);
    project.projectTypeId = type[0];

    project.projectPath = this.myForm.value.projectName;
    project.id = this.myForm.value.id;
    project.projectNr = this.projectNr;

    this.commonService.updateImProjects(project).subscribe((resp: any) => {
      console.log("resp", resp);
      this.commonService.saveUser(this.myEmplyee, resp);

      this.selectedProject = resp;
      if (goTask) {
        this.router.navigate(["/task", resp.id]);
      } else {
        this.router.navigate(['/projects']);
      }
      this.myForm.reset();
    });
  }
}
