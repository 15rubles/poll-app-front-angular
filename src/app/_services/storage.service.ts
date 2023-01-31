import { HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../entity/user';


@Injectable({
    providedIn: 'root'
})
export class StorageService implements OnInit {

    private USER_KEY = environment.USER_KEY;
    readonly unAuth: User = {
        username: environment.UNAUTHORIZED,
        password: environment.UNAUTHORIZED,
        role: environment.UNAUTHORIZED
    };
    constructor() { }
    ngOnInit(): void {
        window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(this.unAuth)); //TODO dont work from the first page load
    }

    clean(): void {
        window.sessionStorage.clear();
    }

    public saveUser(user: any): void {
        window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    public getUser(): any {
        const user = JSON.parse(window.sessionStorage.getItem(this.USER_KEY) || JSON.stringify(this.unAuth));
        return user;
    }

    public isLoggedIn(): boolean {
        const user = window.sessionStorage.getItem(this.USER_KEY);
        if (user) {
            return true;
        }

        return false;
    }

    public logout(): void {
        window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(this.unAuth));
    }
}