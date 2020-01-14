import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { displayDate, sampleData } from 'src/app/events-utc';
import { SchedulerEvent } from '@progress/kendo-angular-scheduler';
import { CommonService } from 'src/app/services/common.service';
import { IProjectAllocation } from 'src/app/models/project-allocation.model';
import { IUser } from 'src/app/models/user.model';
import { IselectedUser, selectedUser } from 'src/app/models/selecteUser.model';
import { ImEmployee, IImEmployee } from 'src/app/models/im-employee.model';
import { ImProjects, IImProjects } from 'src/app/models/im-projects.model';
import { ImTimesheet, IImTimesheet } from 'src/app/models/im-timesheet.model';
import { dateFieldName } from '@telerik/kendo-intl';
import * as moment from 'moment';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GridComponent, DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { GroupDescriptor, process } from '@progress/kendo-data-query';
import { groupBy } from 'rxjs/internal/operators/groupBy';
import { IViewTimesheet, ViewTimesheet } from 'src/app/models/viewTimesheet.model';

import { State } from '@progress/kendo-data-query';
import { SidenavService } from 'src/app/services/sidenav.service';
declare var $: any;
declare var kendo: any;
// const createFormGroup = dataItem => new FormGroup({
//     'id': new FormControl(dataItem.id),
//     'projectId': new FormControl(dataItem.projectId),
//     'employeeId': new FormControl(dataItem.employeeId),
//     'ProjectName': new FormControl(dataItem.ProjectName),
//     'loghours': new FormControl(dataItem.loghours),
//     'notes': new FormControl(dataItem.notes)
// });
// const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);
@Component({
    selector: 'app-timesheet',
    templateUrl: './timesheet.component.html',
    styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {
    @ViewChild(GridComponent)

    public state: State = {};
    public loading = false;

    public groups: GroupDescriptor[] = [];
    public view: IViewTimesheet[];
    public formGroup: FormGroup;
    allocation: any[] = [];
    selecteduser: IselectedUser;
    user: IselectedUser[];
    employee: ImEmployee[];
    timesheet: any[];
    allProject: any[] = [];
    allProjects: any[] = [];
    activeDate: any;
    selectedproject: any;
    selectedProjects: ImProjects[];
    projectsAllocation: any[];
    fullName: any;
    dataItem: ViewTimesheet;
    days: any[] = [];
    formatedDate: any;
    public viewtype = "week";
    public events: SchedulerEvent[] = sampleData;
    myDate = new Date();
    activeUser: IUser;
    activeEmp: ImEmployee;
    utcDate: any;
    quickTaskForm: FormGroup;
    userModelflag: number;
    canBeEdited: boolean = true;
    myEmplyee: any;
    public defaultItem: { fullName: string, id: number } = { fullName: "Select User...", id: null };
    public defaultProject;

    constructor(private formBuilder: FormBuilder, private sidenav: SidenavService, private renderer: Renderer2, private elementRef: ElementRef, private commonService: CommonService) {
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
        this.loading = true;
        this.activeEmp = this.commonService.getEmployeDetails();
        this.selecteduser = null;
        this.activeDate = new Date();
        this.utcDate = moment(moment(this.activeDate).toDate());
        this.activeUser = JSON.parse(sessionStorage.getItem("newUser"));
        this.defaultItem.fullName = this.activeUser.firstName + ' ' + this.activeUser.lastName;
        this.defaultItem.id = this.activeEmp.id;
        this.commonService.getAllImEmployees().subscribe((employee: ImEmployee[]) => {
            this.employee = employee;
            this.user = [];
            for (var i = 0; i < this.employee.length; i++) {
                var fullname = this.employee[i].qnowUser.user;
                var newSelectedUser = new selectedUser(this.employee[i].id, fullname.firstName + ' ' + fullname.lastName);
                this.user.push(newSelectedUser);
                this.user.sort((a, b) => a.fullName.localeCompare(b.fullName))

                if (this.employee[i].id == this.activeEmp.id) {
                    this.selecteduser = newSelectedUser;
                }
            }
            // this.showUserProjects();

            if (this.selecteduser) {
                this.commonService.getEmpProject(this.selecteduser.id).subscribe((projects: any[]) => {

                    for (var i = 0; i < projects.length; i++) {
                        if (!projects[i].risktype) {
                            if (projects[i].projectStatusName == null ||
                                projects[i].projectStatusName == "Implementation" ||
                                projects[i].projectStatusName == "In-Progress" ||
                                projects[i].projectStatusName == "On Going" ||
                                projects[i].projectStatusName == "Rolling Out" ||
                                projects[i].projectStatusName == "Inception" ||
                                projects[i].projectStatusName == "Coding&DailyTesting" ||
                                projects[i].projectStatusName == "Ready For Release" ||
                                projects[i].projectStatusName == "Pending3rdParty" ||
                                projects[i].projectStatusName == "PendingCustomer" ||
                                projects[i].projectStatusName == "Not For tracking" ||
                                projects[i].projectStatusName == "Open") {

                                this.allProject.push(projects[i]);
                                this.allProjects.push(projects[i]);
                                this.allProject.sort((a, b) => a.projectName.localeCompare(b.projectName))

                                this.defaultProject = this.allProject[0];
                            }
                        }
                    }
                    this.selectedproject = this.defaultProject.id;
                    this.showProjects();
                });
            }

            this.getCurrentWeek();

        });


    }
    public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }) {
        if (!isEdited && this.canBeEdited) {
            sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
        }
    }

    public cellCloseHandler(args: any) {
        const { formGroup, dataItem } = args;
        if (!formGroup.valid) {
            // prevent closing the edited cell if there are invalid values.
            args.preventDefault();
        } else if (formGroup.dirty) {
            this.canBeEdited = false;
            this.dataItem = formGroup.value;

            if (formGroup.value.loghours) {
                dataItem.loghours = formGroup.value.loghours;
            }
            else {
                dataItem.loghours = 0;
            }
            dataItem.notes = formGroup.value.notes;
            var data: IImTimesheet = new ImTimesheet;

            for (var i = 0; i < this.user.length; i++) {
                if (this.employee[i].id == dataItem.employeeId) {
                    var emp: IImEmployee;
                    emp = this.employee[i];
                    data.imEmployee = emp;
                }
            }
            this.commonService.getProject(dataItem.projectId).subscribe((project: any) => {
                data.imProjects = project;
                if (this.dataItem.loghours) {
                    data.loghours = dataItem.loghours;
                }
                else {
                    data.loghours = 0;
                }
                data.notes = dataItem.notes;
                data.logdate = this.activeDate;
                data.logday = moment(this.activeDate).format("YYYY-MM-DD");
                if (!this.dataItem.id) {
                    this.commonService.createImTimesheet(data).subscribe((resp: ImTimesheet) => {
                        console.log("resp", resp);
                        //   alert("timesheet saved Succesfully")

                        this.getCurrentWeek();

                        dataItem.id = resp.id;
                        this.canBeEdited = true;
                    });
                }
                else {

                    data.id = dataItem.id;
                    this.commonService.putImTimesheet(data).subscribe((resp) => {
                        console.log("resp", resp);

                        this.getCurrentWeek();
                        this.canBeEdited = true;

                    });
                }

            });
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
    public gridData: GridDataResult;

    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.view, this.state);
    }
    // public saveChanges(grid: any): void {
    //     grid.closeCell();
    //     grid.cancelCell();
    //     var data: IImTimesheet = new ImTimesheet;
    //     for (var i = 0; i < this.user.length; i++) {
    //         if (this.employee[i].id == this.dataItem.employeeId) {
    //             var emp: IImEmployee;
    //             emp = this.employee[i];
    //             data.imEmployee = emp;
    //         }
    //     }
    //     this.commonService.getProject(this.dataItem.projectId).subscribe((project: any) => {
    //         console.log("project", project);
    //         data.imProjects = project;
    //         data.loghours = this.dataItem.loghours;
    //         data.notes = this.dataItem.notes;
    //         data.logdate = this.activeDate;
    //         data.logday = moment(this.activeDate).format("YYYY-MM-DD");
    //         console.log("logdate", data);
    //         if (!this.dataItem.id) {
    //             console.log("new", JSON.stringify(data));

    //             this.commonService.createImTimesheet(data).subscribe((resp: ImTimesheet) => {
    //                 console.log("resp", resp);
    //                 alert("timesheet saved Succesfully")

    //                 this.getCurrentWeek();

    //                 // console.log("id", resp.id);
    //                 // console.log("dataid1", this.dataItem.id);
    //                 this.dataItem.id = resp.id;
    //                 // console.log("dataid2", this.dataItem.id);
    //             });
    //         }
    //         else {
    //             console.log("update", JSON.stringify(data));

    //             data.id = this.dataItem.id;
    //             this.commonService.putImTimesheet(data).subscribe((resp) => {
    //                 alert("timesheet Updated Succesfully")

    //                 console.log("resp", resp);
    //                 this.getCurrentWeek();

    //             });
    //         }
    //     });
    // }

    public createFormGroup(dataItem: any): FormGroup {
        return this.formBuilder.group({
            'id': new FormControl(dataItem.id),
            'logdate': new FormControl(dataItem.logdate),
            'projectId': new FormControl(dataItem.projectId),
            'employeeId': new FormControl(dataItem.employeeId),
            'loghours': new FormControl(dataItem.loghours, [Validators.min(0), Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
            'notes': new FormControl(dataItem.notes)
        });
    }

    setviewtype(type) {
        this.viewtype = type;
    }
    changeWeek(howmany) {
        this.loading = true;
        this.activeDate = moment(this.activeDate).add(howmany, 'days');

        this.utcDate = moment(moment(this.activeDate).toDate());
        this.getCurrentWeek();

        if (this.selecteduser && this.selectedproject) {
            this.showProjects();


        } else if (this.selecteduser) {

            this.showUserProjects();

        }
    }
    selectedDate(date) {
        this.activeDate = date;
        this.utcDate = moment(moment(this.activeDate).toDate());

        if (this.selecteduser && this.selectedproject) {
            this.showProjects();


        } else if (this.selecteduser) {

            this.showUserProjects();

        }
    }
    computedDate(date) {

        if (this.selecteduser) {
            //this.activeDate = date;
            var currentDay: string = moment(date).format("YYYY-MM-DD");
            var total = 0;
            this.commonService.getAllocationTimesheetByEmpIdAndDate(this.selecteduser.id, currentDay).subscribe((dateallocation) => {
                for (var i = 0; i < dateallocation.length; i++) {
                    if (dateallocation[i].loghours) {
                        total += dateallocation[i].loghours;
                    }

                }
                return total;
            });
        } else {
            return 0;
        }

    }

    displayscheduler() {
        $(document).ready(function () {

            $("#scheduler").kendoScheduler({
                date: new Date("2019/6/13"),
                startTime: new Date("2019/6/13 07:00 AM"),
                height: 600,
                views: [
                    "day",
                    { type: "workWeek", selected: true },
                    "week",
                    "month",
                    "agenda",
                    { type: "timeline", eventHeight: 50 }
                ],
                timezone: "Etc/UTC",
                dataSource: {
                    batch: true,
                    transport: {
                        read: {
                            url: "https://demos.telerik.com/kendo-ui/service/tasks",
                            dataType: "jsonp"
                        },
                        update: {
                            url: "https://demos.telerik.com/kendo-ui/service/tasks/update",
                            dataType: "jsonp"
                        },
                        create: {
                            url: "https://demos.telerik.com/kendo-ui/service/tasks/create",
                            dataType: "jsonp"
                        },
                        destroy: {
                            url: "https://demos.telerik.com/kendo-ui/service/tasks/destroy",
                            dataType: "jsonp"
                        },
                        parameterMap: function (options, operation) {
                            if (operation !== "read" && options.models) {
                                return { models: kendo.stringify(options.models) };
                            }
                        }
                    },
                    schema: {
                        model: {
                            id: "taskId",
                            fields: {
                                taskId: { from: "TaskID", type: "number" },
                                title: { from: "Title", defaultValue: "No title", validation: { required: true } },
                                start: { type: "date", from: "Start" },
                                end: { type: "date", from: "End" },
                                startTimezone: { from: "StartTimezone" },
                                endTimezone: { from: "EndTimezone" },
                                description: { from: "Description" },
                                recurrenceId: { from: "RecurrenceID" },
                                recurrenceRule: { from: "RecurrenceRule" },
                                recurrenceException: { from: "RecurrenceException" },
                                ownerId: { from: "OwnerID", defaultValue: 1 },
                                isAllDay: { type: "boolean", from: "IsAllDay" }
                            }
                        }
                    },
                    filter: {
                        logic: "or",
                        filters: [
                            { field: "ownerId", operator: "eq", value: 1 },
                            { field: "ownerId", operator: "eq", value: 2 }
                        ]
                    }
                },
                resources: [
                    {
                        field: "ownerId",
                        title: "Owner",
                        dataSource: [
                            { text: "Alex", value: 1, color: "#f8a398" },
                            { text: "Bob", value: 2, color: "#51a0ed" },
                            { text: "Charlie", value: 3, color: "#56ca85" }
                        ]
                    }
                ]
            });

            $("#people :checkbox").change(function (e) {
                var checked = $.map($("#people :checked"), function (checkbox) {
                    return parseInt($(checkbox).val());
                });

                var scheduler = $("#scheduler").data("kendoScheduler");

                scheduler.dataSource.filter({
                    operator: function (task) {
                        return $.inArray(task.ownerId, checked) >= 0;
                    }
                });
            });

        });

    }

    public userSelection(value: any): void {
        this.loading = true;

        this.selecteduser = value;
        this.allProject = [];
        this.allProjects = [];

        this.commonService.getEmpProject(this.selecteduser.id).subscribe((projects: any[]) => {
            for (var i = 0; i < projects.length; i++) {
                if (!projects[i].risktype) {

                    if (projects[i].projectStatusName == null ||
                        projects[i].projectStatusName == "Implementation" ||
                        projects[i].projectStatusName == "In-Progress" ||
                        projects[i].projectStatusName == "On Going" ||
                        projects[i].projectStatusName == "Rolling Out" ||
                        projects[i].projectStatusName == "Inception" ||
                        projects[i].projectStatusName == "Coding&DailyTesting" ||
                        projects[i].projectStatusName == "Ready For Release" ||
                        projects[i].projectStatusName == "Pending3rdParty" ||
                        projects[i].projectStatusName == "PendingCustomer" ||
                        projects[i].projectStatusName == "Not For tracking") {

                        this.allProject.push(projects[i]);
                        this.allProjects.push(projects[i]);
                    }
                }
            }

            this.showUserProjects();
            this.getCurrentWeek();

        });
    }
    public projectSelection(value: any): void {
        this.loading = true;

        this.selectedproject = value;
        this.showProjects();
    }
    getCurrentWeek() {
        var weekStartDay = moment(this.activeDate).clone().startOf('isoWeek').format("YYYY-MM-DD");
        var weekEndDay = moment(this.activeDate).clone().endOf('isoWeek').format("YYYY-MM-DD");

        this.commonService.getTimesheetbyEmpIdBetweenDays(this.selecteduser.id, weekEndDay, weekStartDay).subscribe((resp) => {


            var activeDay = moment(this.activeDate).format("YYYY-MM-DD");
            this.days = [];
            var weekStart = moment(this.activeDate).clone().startOf('isoWeek');
            for (var i = 0; i <= 6; i++) {
                var dayOfWeek = moment(weekStart).add(i, 'days');
                if (moment(dayOfWeek).format("YYYY-MM-DD") == activeDay) {
                    this.activeDate = dayOfWeek;
                }
                var myJson = { "day": moment(), "hours": 0 };

                myJson.hours = 0;
                myJson.day = dayOfWeek;

                for (var j = 0; j < resp.length; j++) {

                    if (moment(dayOfWeek).format("YYYY-MM-DD") == resp[j].logday) {

                        myJson.hours = resp[j].sum;
                    }
                }

                this.days.push(myJson);

            }
        });

    }
    compareDates(date1: moment.Moment, date2: moment.Moment) {
        return (moment(date1).format("YYYY-MM-DD") == moment(moment(date2)).format("YYYY-MM-DD"))
    }

    showUserProjects() {
        if (this.selecteduser) {
            this.commonService.getAllocationByEmpId(this.selecteduser.id).subscribe((allocation) => {
                this.allocation = allocation;

                this.view = [];
                for (var i = 0; i < this.allocation.length; i++) {
                    if (this.allocation[i].projectStatusName == null ||
                        this.allocation[i].projectStatusName == "Implementation" ||
                        this.allocation[i].projectStatusName == "In-Progress" ||
                        this.allocation[i].projectStatusName == "On Going" ||
                        this.allocation[i].projectStatusName == "Rolling Out" ||
                        this.allocation[i].projectStatusName == "Inception" ||
                        this.allocation[i].projectStatusName == "Coding&DailyTesting" ||
                        this.allocation[i].projectStatusName == "Ready For Release" ||
                        this.allocation[i].projectStatusName == "Pending3rdParty" ||
                        this.allocation[i].projectStatusName == "PendingCustomer" ||
                        this.allocation[i].projectStatusName == "Not For tracking") {
                        if (this.compareDates(this.allocation[i].logday, this.activeDate) || this.allocation[i].logday == null) {
                            var index = this.view.findIndex((x) => {
                                return this.allocation[i].imProjectsId == x.projectId;
                                // return
                            });

                            if (index < 0) {

                                this.view.push(new ViewTimesheet(this.allocation[i].itdId, this.allocation[i].imProjectsId, this.allocation[i].imEmployeeId, this.allocation[i].projectName, this.allocation[i].loghours, this.allocation[i].notes));

                            }
                        }
                        else {

                            var tempView = new ViewTimesheet(0, this.allocation[i].imProjectsId, this.allocation[i].imEmployeeId, this.allocation[i].projectName, null, null);
                            var index = this.view.findIndex((x) => {
                                return tempView.projectId == x.projectId;
                            });

                            if (index < 0) {
                                this.view.push(tempView);
                            }

                        }
                    }
                }
                this.gridData = process(this.view, this.state);
                this.loading = false;

            });
        }

    }
    showProjects() {
        this.projectsAllocation = [];
        this.view = [];
        // console.log("id", this.selectedproject);
        var currentDay: string = moment(this.activeDate).format("YYYY-MM-DD");
        this.commonService.getAllocationByEmpIdParentIdAndDate(this.selectedproject, this.selecteduser.id, currentDay).subscribe((dateallocation) => {
            var viewByDate = [];
            console.log(dateallocation);
            for (var i = 0; i < dateallocation.length; i++) {
                if (dateallocation[i].projectStatusName == null ||
                    dateallocation[i].projectStatusName == "Implementation" ||
                    dateallocation[i].projectStatusName == "In-Progress" ||
                    dateallocation[i].projectStatusName == "On Going" ||
                    dateallocation[i].projectStatusName == "Rolling Out" ||
                    dateallocation[i].projectStatusName == "Inception" ||
                    dateallocation[i].projectStatusName == "Coding&DailyTesting" ||
                    dateallocation[i].projectStatusName == "Ready For Release" ||
                    dateallocation[i].projectStatusName == "Pending3rdParty" ||
                    dateallocation[i].projectStatusName == "PendingCustomer" ||
                    dateallocation[i].projectStatusName == "Not For tracking" ||
                    dateallocation[i].projectStatusName == "Open") {

                    var index = viewByDate.findIndex((x) => {
                        return dateallocation[i].imProjectsId == x.projectId;
                    });

                    if (index < 0) {
                        viewByDate.push(new ViewTimesheet(dateallocation[i].itdId,
                            dateallocation[i].imProjectsId,
                            dateallocation[i].imEmployeeId,
                            dateallocation[i].projectName,
                            dateallocation[i].loghours, dateallocation[i].notes)
                        );
                    }

                }
            }

            this.commonService.getAllocationByEmpIdParentId(this.selectedproject, this.selecteduser.id).subscribe((allocation) => {
                this.allocation = allocation;
                // console.log("", allocation);
                this.view = [];
                for (var i = 0; i < this.allocation.length; i++) {
                    if (this.allocation[i].projectStatusName == null ||
                        this.allocation[i].projectStatusName == "Implementation" ||
                        this.allocation[i].projectStatusName == "In-Progress" ||
                        this.allocation[i].projectStatusName == "On Going" ||
                        this.allocation[i].projectStatusName == "Rolling Out" ||
                        this.allocation[i].projectStatusName == "Inception" ||
                        this.allocation[i].projectStatusName == "Coding&DailyTesting" ||
                        this.allocation[i].projectStatusName == "Ready For Release" ||
                        this.allocation[i].projectStatusName == "Pending3rdParty" ||
                        this.allocation[i].projectStatusName == "PendingCustomer" ||
                        this.allocation[i].projectStatusName == "Not For tracking" ||
                        this.allocation[i].projectStatusName == "Open") {
                        //                        if (this.compareDates(this.allocation[i].logday, this.activeDate) || this.allocation[i].logday == null) {

                        var index = viewByDate.findIndex((x) => {
                            return this.allocation[i].imProjects == x.projectId;
                        });

                        if (index < 0) {
                            var indexView = this.view.findIndex((x) => {
                                return this.allocation[i].imProjects == x.projectId;
                            });
                            if (indexView < 0) {
                                this.view.push(new ViewTimesheet(0, this.allocation[i].imProjects, this.allocation[i].imEmployee, this.allocation[i].projectName, null, null));
                            }
                        } else {
                            var indexView = this.view.findIndex((x) => {
                                return this.allocation[i].imProjects == x.projectId;
                            });
                            if (indexView < 0) {
                                this.view.push(viewByDate[index]);
                            }
                        }

                    }
                }
                this.gridData = process(this.view, this.state);
                console.log("grid", this.gridData);
                this.loading = false;

            });
        });
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
    }
    saveQuickTask() {
        var obj: any = this.quickTaskForm.value;
        obj.parentId = this.selectedproject;
        this.commonService.getProject(this.selectedproject).subscribe((project) => {


            obj.projectStatusId = project.projectStatusId;
            if (project.projectStatusId) {
                if (project.projectStatusId.id) {
                    obj.projectStatusId = project.projectStatusId.id;
                }
            }
            obj.projectVertical = project.projectVertical;
            if (project.projectVertical) {
                if (project.projectVertical.id) {
                    obj.projectVertical = project.projectVertical.id;
                }
            }
            // obj.projectName = obj.projectName;
            obj.projectNr = obj.projectName.substring(0, 250);
            obj.projectPath = obj.projectNr;
            obj.startDate = this.activeDate;
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
                    if (!data.loghours) {
                        data.loghours = 0;
                    }
                    // data.notes = this.dataItem.notes;
                    data.logdate = moment(this.activeDate);
                    data.logday = moment(this.activeDate).format("YYYY-MM-DD");
                    data.imEmployee = this.activeEmp;
                    this.commonService.createImTimesheet(data).subscribe(TimeSheetResp => {
                        console.log("resp", TimeSheetResp);
                    });
                    this.quickTaskForm.reset();

                    this.showProjects();
                }
                else {
                    this.quickTaskForm.reset();

                    this.showProjects();
                }
            });

        });

    }
}
