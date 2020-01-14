import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { IUser } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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
      // console.log("usersss", users);

    });
  }

  setviewtype(type) {
    this.viewtype = type;
  }
  register() {
    var password = this.registerForm.value.password;
    this.registerForm.value.login = this.registerForm.value.email;
    if (password == this.registerForm.value.confirmPassword) {
      this.commonService.register(this.registerForm.value).subscribe((resp) => {
        console.log("resp", resp);
        this.viewtype = "login";
      });
    }
    else
      alert("The password and its confirm password do not match!");
  }
  signIn() {
    // this.commonService.login(this.loginForm.value).subscribe((resp: any) => {
    //   console.log("resp", resp);
    //   if (resp.id == 0) {
    //     this.toastr.error("Invalid Login Details!");
    //   }
    //   else {
    //     this.toastr.success("Login Successfully!");
    //     sessionStorage.setItem('newEmployee', JSON.stringify(resp.user));

    //     this.router.navigate(['/dashboard']);
    //   }
    // });






    // console.log("", this.loginForm.value.username);
    var count = 0;
    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i].login == this.loginForm.value.username && this.loginForm.value.password == "triarq") {
        var user = this.users[i];
        // console.log("user", user);

        sessionStorage.setItem("newUser", JSON.stringify(user));
        this.commonService.activeEmp(user.id);
        count = 1;
        // this.router.navigate(['/dashboard']);
      }
    }
    if (count == 1) {
      this.toastr.success("Login Successfully!");
    }
    else {
      this.toastr.error("Invalid Login Details!");
    }

  }
}
