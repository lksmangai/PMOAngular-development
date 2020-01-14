import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../models/user.model';
import { CommonService } from '../services/common.service';
import { ImEmployee } from '../models/im-employee.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  activeUser: IUser;
  employee: ImEmployee[];
  activeEmp: ImEmployee;
  constructor(private router: Router, private commonService: CommonService) {
    this.activeUser = JSON.parse(sessionStorage.getItem("newUser"));
  }

  ngOnInit() {
    this.commonService.getAllImEmployees().subscribe((employee: ImEmployee[]) => {
      this.employee = employee;
      for (var i = 0; i < this.employee.length; i++) {
        if (this.employee[i].qnowUser.user.id == this.activeUser.id)
          this.activeEmp = this.employee[i];
      }
    });
  }
  signOut() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
