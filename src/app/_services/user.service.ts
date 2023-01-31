import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../entity/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiServerUrl = environment.apiBaseUrl;;

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiServerUrl}/user/all`);
  }

  public findUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiServerUrl}/user/find/${userId}`);
  }

  public addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/user/add`, user);
  }
  public updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiServerUrl}/user/update`, user);
  }

  public deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/user/delete/${userId}`);
  }

  //self
  public getSelfUser(): Observable<User> {
    return this.http.get<User>(`${this.apiServerUrl}/user/self`);
  }

  public getAllUsersSelf(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiServerUrl}/user/self/all_users`);
  }
  public updateUserAllowedPolls(username: string, pollId: number, isAllowed: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiServerUrl}/user/self/update_user_allowed_polls?&pollId=${pollId}&isAllowed=${isAllowed}`, username);
  }

  public updateSelfUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiServerUrl}/user/self/update`, user);
  }

  public registration(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/user/registration`, user, { withCredentials: false });
  }

  public login(user: User): Observable<any> {
    let body = new FormData();
    body.append('username', user.username);
    body.append('password', user.password);
    return this.http.post<any>(`${this.apiServerUrl}/login`, body, {
      observe: 'response',
    });
  }
}
