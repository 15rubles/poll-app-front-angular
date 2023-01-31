import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PollAdmin } from '../entity/pollAdmin';
import { Poll } from '../entity/poll';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PollService {

  private apiServerUrl = environment.apiBaseUrl;;

  constructor(private http: HttpClient) { }

  public getPolls(): Observable<PollAdmin[]> {
    return this.http.get<PollAdmin[]>(`${this.apiServerUrl}/poll/all`);
  }

  public findPollById(pollId: number): Observable<PollAdmin> {
    return this.http.get<PollAdmin>(`${this.apiServerUrl}/poll/${pollId}`);
  }

  public addPoll(poll: PollAdmin): Observable<PollAdmin> {
    return this.http.post<PollAdmin>(`${this.apiServerUrl}/poll/add`, poll);
  }
  public updatePoll(poll: PollAdmin): Observable<PollAdmin> {
    return this.http.put<PollAdmin>(`${this.apiServerUrl}/poll/update`, poll);
  }

  public deletePoll(pollId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/poll/delete${pollId}`);
  }
  //self
  public findSelfPolls(): Observable<Poll[]> {
    return this.http.get<Poll[]>(`${this.apiServerUrl}/poll/self/all`);
  }
  public findSelfPollById(pollId: number): Observable<Poll> {
    return this.http.get<Poll>(`${this.apiServerUrl}/poll/self/${pollId}`);
  }

  public addSelfPoll(poll: Poll): Observable<Poll> {
    return this.http.post<Poll>(`${this.apiServerUrl}/poll/self/add`, poll);
  }

  public deleteSelfPoll(pollId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/poll/self/delete/${pollId}`);
  }

  public updateSelfPoll(poll: Poll): Observable<Poll> {
    return this.http.put<Poll>(`${this.apiServerUrl}/poll/self/update`, poll);
  }

  public getAllowedPolls(): Observable<Poll[]> {
    return this.http.get<Poll[]>(`${this.apiServerUrl}/poll/self/allowed_polls`);
  }
}
