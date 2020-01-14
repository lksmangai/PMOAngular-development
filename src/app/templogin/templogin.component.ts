import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { IUser } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-templogin',
  templateUrl: './templogin.component.html',
  styleUrls: ['./templogin.component.css']
})
export class TemploginComponent implements OnInit {
  registerForm: FormGroup;
  loginForm: FormGroup;
  users: IUser[] = [];
  loggedUser: IUser[] = []
  public viewtype = "login";
  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private commonService: CommonService, private router: Router) {
    this.registerForm = this.formBuilder.group({
      login: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[_.@A-Za-z0-9-]*$')]],
      email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]]
    });
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      rememberMe: [true]
    });

  }

  ngOnInit() {
    this.commonService.getAllImUsers().subscribe((users: IUser[]) => {
      this.users = users;
      this.signIn();
    },
    err => {
      this.router.navigate(['login']);
    });
  }

  setviewtype(type) {
    this.viewtype = type;
  }


  signIn() {
    var count = 0;
    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i].login == "mike@triarqhealth.com") {
        var user = this.users[i];
        sessionStorage.setItem("newUser", JSON.stringify(user));
        this.commonService.activeEmp(user.id);
        count = 1;
        
      }
    }
    if (count == 1) {
      this.toastr.success("Loading ...");
    }
    else {
      this.router.navigate(['login']);
    }

  }
}
