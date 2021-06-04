import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Token} from "../../models/token.model";
import {User} from "../../models/user.model";
import {CreateUser} from "../../models/create-user.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    username: new FormControl(null, [Validators.required, Validators.minLength(4)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(5)]),
    first_name: new FormControl(null, [Validators.required, Validators.minLength(4)]),
    last_name: new FormControl(null, [Validators.required, Validators.minLength(4)]),

  });

  constructor(
    private router: Router,
    private userService: UserService,
    private tService: ToastrService) {
  }

  ngOnInit(): void {
  }

  onRegister(): void {
    // console.log('Username: ' + this.loginForm.value.username);
    // console.log('Password: ' + this.loginForm.value.password);
    if (this.registerForm?.valid) {

      const createUser = new CreateUser(
        this.registerForm.value.username,
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.first_name,
        this.registerForm.value.last_name
      );
      this.userService
        .register(createUser)
        .subscribe(
          (response: User) => {
            this.tService.success('', 'User is registered successfully');
          },
          err => {
            console.log(err);
            this.tService.warning('Error', 'Could not create user.');
          }
        );
    }
  }
}
