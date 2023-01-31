import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/entity/user';
import { UserService } from 'src/app/_services/user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-layout',
  templateUrl: './registration-layout.component.html',
  styleUrls: ['./registration-layout.component.css']
})
export class RegistrationLayoutComponent implements OnInit {
  password?: string;
  passwordConfirm?: string;
  passwordError: string = 'Passwords dont match';
  message: string = '';
  buttonDisabled: boolean = false;
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  public registration(regForm: NgForm): any {
    const user: User = {
      username: regForm.controls['username'].value,
      password: regForm.controls['password'].value,
    };
    this.userService.registration(user).subscribe(
      (response: User) => {
        this.router.navigate(['/login']);
      },
      (error: HttpErrorResponse) => {
        this.message = error.error.message;
      }
    );
  }

  public checkPassword() {
    if (this.passwordConfirm != this.password) {
      this.buttonDisabled = true;
      this.message = this.passwordError;
    }
    else {
      this.buttonDisabled = false;
      this.message = '';
    }
  }
}
