import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/entity/user';
import { HttpErrorResponse } from '@angular/common/http';
import { StorageService } from 'src/app/_services/storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css']
})
export class AuthLayoutComponent implements OnInit {

  isLoggedIn: boolean = false;
  error: string = '';
  role?: string;
  constructor(private userService: UserService, private router: Router, private storageService: StorageService) { }

  ngOnInit(): void {
    if (this.storageService.getUser()) {
      this.isLoggedIn = true;
      this.role = this.storageService.getUser().role;
    }
  }

  public login(loginForm: NgForm) {
    this.userService.login(loginForm.value).subscribe(
      data => {
        this.storageService.saveUser(data.body);
        this.isLoggedIn = true;
        switch (data.body.role) {
          case environment.ROLE_USER: {
            this.router.navigate(['/user'])
            break;
          }
          case environment.ROLE_LEAD: {
            this.router.navigate(['/lead'])
            break;
          }
          case environment.ROLE_ADMIN: {
            this.router.navigate(['/admin'])
            break;
          }
        }
      },
      err => {
        this.error = 'Authentication failure';
      }
    );
  }

}
