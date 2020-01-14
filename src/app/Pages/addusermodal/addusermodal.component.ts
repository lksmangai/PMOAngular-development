import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { IUser, User } from 'src/app/models/user.model';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { ImEmployee } from 'src/app/models/im-employee.model';
import { ImProjects } from 'src/app/models/im-projects.model';
import { Router, ActivatedRoute } from '@angular/router';
import { IProjectAllocation, ProjectAllocation } from 'src/app/models/project-allocation.model';
import { createComponentView } from '@angular/core/src/view/view';
import { SidenavService } from 'src/app/services/sidenav.service';
declare var $: any;

@Component({
  selector: 'app-addusermodal',
  templateUrl: './addusermodal.component.html',
  styleUrls: ['./addusermodal.component.css']
})
export class AddusermodalComponent implements OnInit, OnChanges {
  @Output() userRefresh = new EventEmitter<boolean>();
  @Output() sendUser = new EventEmitter<any>();

  @Input() selectedProjectId: any;
  @Input() createNew: any;

  projectId: number;

  employee: any[];
  selectedItems: any[] = [];
  originalItems: any[];
  project: ImProjects[];
  myEmplyee: ImEmployee[] = [];
  employeeDataSource: any[];
  selectedUser: ImEmployee[] = [];
  allocations: any[] = [];
  selectedEmp: number[] = [];
  public listItems = ["Full Member"];
  myForm: FormGroup;
  isChecked: boolean;
  deleteEmployee: IProjectAllocation[];
  unsubcriptionCount: number = 0;
  subcriptionCount: number = 0;
  // saveUsername: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private commonService: CommonService, private route: ActivatedRoute, private sidenav: SidenavService) {

    this.myForm = this.fb.group({
      employee: this.fb.array([])
    });
  }
  ngOnChanges() {
    console.log("hey");

    // console.log("proj", this.selectedProjectId);

    this.employee = this.sidenav.employee;
    if (this.sidenav.isUserModalProjectId) {
      this.projectId = this.sidenav.isUserModalProjectId.id;
    } else {
      this.projectId = null;
    }
    this.allocations = this.sidenav.allocations;
    // console.log("all", this.allocations);
    this.selectedItems = [];
    this.originalItems = [];
    for (var i = 0; i < this.employee.length; i++) {
      this.employee[i].fullName = this.employee[i].qnowUser.user.firstName + " " + this.employee[i].qnowUser.user.lastName;
      if (this.projectId && this.allocations) {
        for (var j = 0; j < this.allocations.length; j++) {
          if (this.allocations[j].im_employee_id == this.employee[i].id) {
            this.selectedItems.push(this.employee[i]);
            this.originalItems.push(this.employee[i]);
            break;
          }
        }
      }

    }
    // console.log("data", this.selectedItems);

  }
  ngOnInit() {
    console.log("hi");

    this.employee = this.sidenav.employee;
    if (this.sidenav.isUserModalProjectId) {
      this.projectId = this.sidenav.isUserModalProjectId.id;
    } else {
      this.projectId = null;
    }

    this.allocations = this.sidenav.allocations;
    // console.log("all", this.allocations);

    this.selectedItems = [];
    this.originalItems = [];
    for (var i = 0; i < this.employee.length; i++) {
      this.employee[i].fullName = this.employee[i].qnowUser.user.firstName + " " + this.employee[i].qnowUser.user.lastName;
      if (this.projectId && this.allocations) {
        for (var j = 0; j < this.allocations.length; j++) {
          if (this.allocations[j].im_employee_id == this.employee[i].id) {
            this.selectedItems.push(this.employee[i]);
            this.originalItems.push(this.employee[i]);
            break;
          }
        }
      }

    }
    // console.log("data", this.selectedItems);

    this.employeeDataSource = this.employee;
  }
  filterEmployee(keyword) {
    this.employee = this.employeeDataSource.filter(
      s =>
        s.fullName
          .toLowerCase()
          .indexOf(keyword.toLowerCase()) !== -1
    );
  }
  // compare(id: number) {
  //   // console.log("", this.sidenav.isUserModalProjectId);

  //   // console.log("", this.sidenav.isUserModalProjectId.id);
  //   if (!this.sidenav.isUserModalProjectId) { return false; }

  //   this.projectId = this.sidenav.isUserModalProjectId.id;

  //   this.allocations = this.sidenav.allocations;


  //   if (!this.projectId) {
  //     return false;
  //   }
  //   else {

  //     for (var i = 0; i < this.allocations.length; i++) {


  //       if (this.allocations[i].im_employee_id == id) {

  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }
  // checkboxChange(isChecked: boolean, obj) {
  //   const employee = <FormArray>this.myForm.controls.employee;
  //   if (isChecked) {
  //     employee.push(new FormControl(obj));
  //     this.myEmplyee.push(obj);
  //     this.addUser();
  //   } else {
  //     // employee.push(new FormControl(obj));
  //     // this.deleteEmployee.push(obj);
  //     // this.commonService.deleteProjectsAllocation().subscribe(() => {
  //     // this.students.splice(this.students.indexOf(this.student), 1);
  //     // });
  //     // console.log("unchecked", this.deleteEmployee)

  //   }
  // }
  doAddToArray(originalItems, selectedItems): any[] {
    var myArray: any[] = [];
    for (var i = 0; i < originalItems.length; i++) {
      var found = false;
      for (var j = 0; j < selectedItems.length; j++) {

        if (selectedItems[j].id == originalItems[i].id) {
          found = true;
          break;
        }

      }
      if (!found) {
        myArray.push(originalItems[i]);
      }
    }
    // console.log("array", myArray);
    return myArray;
  }
  addUser() {
    var allocation: IProjectAllocation;
    var projects: ImProjects;
    this.sidenav.myEmployeeAddition = this.doAddToArray(this.selectedItems, this.originalItems);
    // console.log("arrayhere1", this.sidenav.myEmployeeAddition)
    this.sidenav.myEmployeeDeletion = this.doAddToArray(this.originalItems, this.selectedItems);
    // console.log("arrayhere2", this.sidenav.myEmployeeDeletion)

    //  projects = this.projects;
    this.myEmplyee = this.sidenav.myEmployeeAddition;
    this.deleteEmployee = this.sidenav.myEmployeeDeletion;
    if (this.sidenav.isUserModalProjectId) {
      this.projectId = this.sidenav.isUserModalProjectId.id;
      // console.log("", this.projectId);
      if (this.projectId) {
        if (this.deleteEmployee) {
          var deleteUser: ImEmployee[] = this.deleteEmployee;
          deleteUser.forEach(u => {
            //   var allocation = { "imEmployee": u.id, "imProjects": this.projectId };
            this.commonService.deleteProjectsAllocation(this.projectId, u.id).subscribe((resp) => {
              console.log(resp);
              if (u.id == deleteUser[deleteUser.length - 1].id) {
                this.deleteEmployee = [];
                this.sidenav.myEmployeeDeletion = this.deleteEmployee;
                this.sidenav.closeNav();
                this.userRefresh.emit(true);
              }
            });
          });
        }
        if (this.myEmplyee) {
          var user: ImEmployee[] = this.myEmplyee;
          user.forEach(u => {
            var allocation = { "imEmployee": u.id, "imProjects": this.projectId };
            this.commonService.createProjectsAllocation(allocation).subscribe((resp) => {
              console.log(resp);
              if (u.id == user[user.length - 1].id) {
                this.myEmplyee = [];
                this.sidenav.myEmployeeAddition = this.myEmplyee;
                this.sidenav.closeNav();
                this.userRefresh.emit(true);
              }
            });
          });
        }
      }
    }
  }

  closeModal() {
    this.sidenav.closeNav();

    // if (this.createNew) {
    //   this.sidenav.myEmployeeAddition=this.doAddToArray(this.selectedItems,this.originalItems );
    //   // console.log("arrayhere1", this.sidenav.myEmployeeAddition)
    //    this.sidenav.myEmployeeDeletion=this.doAddToArray(this.originalItems,this.selectedItems );

    //   //  projects = this.projects;
    //   this.myEmplyee=this.sidenav.myEmployeeAddition;

    //   this.sendUser.emit(this.myEmplyee);
    // } else {
    //   this.createNew = false;
    //   // $("#useradd").modal("hide");
    //   // $("#useradd2").modal("hide");
    //   // $("#useradd3").modal("hide");
    //   // $("#userAddtask").modal("hide");
    //   // $("#userAddSubTask").modal("hide");
    // }
    // // this.router.navigate(['./projects'])
    // this.projects = null;

  }
}
