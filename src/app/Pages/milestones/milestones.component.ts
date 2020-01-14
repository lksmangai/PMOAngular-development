import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/app/services/common.service";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { SidenavService } from "src/app/services/sidenav.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImEmployee } from 'src/app/models/im-employee.model';
import { IProjectAllocation } from 'src/app/models/project-allocation.model';
import { IProjectStatusId, ProjectStatusId } from 'src/app/models/project-status-id.model';

@Component({
  selector: "app-milestones",
  templateUrl: "./milestones.component.html",
  styleUrls: ["./milestones.component.css"]
})
export class MilestonesComponent implements OnInit {
  milestones: any[] = [];
  completeMilestone: any[] = [];
  pendingMilestone: any[] = [];
  currentWeekMilestone: any[] = [];
  nextWeekMilestone: any[] = [];
  futureMilestones: any[] = [];
  projectStatusId: ProjectStatusId[] = [];
  selectedProjectId: any;
  myEmplyee: ImEmployee[] = [];
  weekStart: any;
  weekEnd: any;
  weekStartSeven: any;
  weekEndSeven: any;
  activesevenDate: moment.Moment;
  active14Date: moment.Moment;
  activeDate: moment.Moment;
  userModelflag: number;

  myForm: FormGroup;

  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private sidenav: SidenavService,
    private formBuilder: FormBuilder
  ) {
    this.myForm = this.formBuilder.group({
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
    let id = parseInt(this.route.snapshot.paramMap.get("id"));
    this.selectedProjectId = id;
    this.activeDate = moment(new Date());
    this.activesevenDate = this.activeDate.add(7, "days");
    this.active14Date = this.activeDate.add(14, "days");
    this.weekStart = this.activeDate.clone().startOf('isoWeek');
    this.weekEnd = this.activeDate.clone().endOf('isoWeek');
    this.weekStartSeven = this.weekStart.add(7, "days")
    this.weekEndSeven = this.weekEnd.add(7, "days")
    this.commonService
      .projectsStatus()
      .subscribe((projectStatus: IProjectStatusId[]) => {
        this.projectStatusId = projectStatus;
      });
    this.allMilestone();

  }

  allMilestone() {
    this.commonService.getMilestones(this.selectedProjectId).subscribe((milestones: any[]) => {
      this.milestones = [];
      for (var i = 0; i < milestones.length; i++) {
        if (
          milestones[i].projectStatusName != "Backlog" &&
          milestones[i].projectStatusName != "Not For Tracking" &&
          !milestones[i].risktype
        ) {
          this.milestones.push(milestones[i]);
          if (
            milestones[i].projectStatusName == "Closed" ||
            milestones[i].projectStatusName == "Closing Out" ||
            milestones[i].projectStatusName == "Completed" ||
            milestones[i].percentCompleted == 100
          ) {
            this.completeMilestone.push(milestones[i]);
          } else if (
            this.compareLesser(milestones[i].startDate, this.activeDate) &&
            (milestones[i].percentCompleted == null ||
              milestones[i].percentCompleted == 0)
          ) {
            this.pendingMilestone.push(milestones[i]);
          } else if (
            this.compareGreater(milestones[i].endDate, this.weekStartSeven) &&
            this.compareLesser(milestones[i].endDate, this.weekEndSeven)
          ) {
            this.nextWeekMilestone.push(milestones[i]);
          } else if (
            ((this.compareGreater(milestones[i].endDate, this.weekStart) &&
              this.compareLesser(milestones[i].endDate, this.weekEnd))) || (milestones[i].percentCompleted)
          ) {
            this.currentWeekMilestone.push(milestones[i]);
          } else {
            this.futureMilestones.push(milestones[i]);
          }

        }
      }
    });
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

  saveMilestone() {
    var obj: any = this.myForm.value;
    console.log("values", this.myForm.value);
    obj.parentId = this.selectedProjectId;
    var status: IProjectStatusId[] = this.projectStatusId.filter(
      p => p.name == "In-Progress"
    );
    obj.projectStatusId = status[0].id;
    obj.milestoneP = true;
    // obj.projectName = obj.projectName;
    obj.projectNr = obj.projectName.substring(0, 250);
    obj.projectPath = obj.projectNr;
    // obj.startDate = this.activeDate;
    console.log("obj", obj);
    this.commonService.createImProjects(obj).subscribe((resp: any) => {
      console.log("resp", resp);
      this.allMilestone();

      this.myForm.reset();
      this.myEmplyee = this.sidenav.myEmployeeAddition;
      console.log("", this.myEmplyee);

      if (this.myEmplyee.length == 0) {
        this.commonService.allocationProjects(this.selectedProjectId).subscribe((allocation) => {
          for (var i = 0; i < allocation.length; i++) {
            this.commonService.getprojectsAllocation(allocation[i].id).subscribe((projectAllocation: IProjectAllocation) => {
              projectAllocation.imProjects = resp;
              projectAllocation.id = null;
              this.commonService.createProjectsAllocation(projectAllocation).subscribe((respAllocation) => {
              });
            });
          }
        });
      } else {
        console.log("emp", this.myEmplyee);

        this.commonService.saveUser(this.myEmplyee, resp);
        this.myEmplyee = [];
        this.sidenav.myEmployeeAddition = this.myEmplyee;
      }
    });

  }
  openUserModal(project) {
    this.sidenav.isUserModalProjectId = project;

    console.log("1", this.sidenav.isUserModalProjectId);
    if (project) {

      if (project.allocationRecord) {
        // this.sidenav.populateAllocation();
        this.sidenav.allocations = JSON.parse(project.allocationRecord);
      }
      if (project.allocationrecord) {
        this.sidenav.allocations = JSON.parse(project.allocationrecord);
      }
      this.userModelflag = project.id;

      // this.sidenav[projectId.toString()] = true;
    }
    else {
      this.sidenav.allocations = [];

    }
    console.log("side", this.sidenav.allocations);

  }
  openmile() {
    this.sidenav.openNav();
  }
  closemile() {
    this.sidenav.closeNav();
  }
}
