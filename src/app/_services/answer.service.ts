import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Answer } from '../entity/answer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  private apiServerUrl = environment.apiBaseUrl;;

  constructor(private http: HttpClient) { }

  public getAnswers(): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiServerUrl}/answer/all`);
  }
  public getAllAnswersByPollId(pollId: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiServerUrl}/answer/poll/${pollId}`);
  }
  public findAnswerById(answerId: number): Observable<Answer> {
    return this.http.get<Answer>(`${this.apiServerUrl}/answer/${answerId}`);
  }
  public findAnswersByPollIdAndUserId(pollId: number, userId: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiServerUrl}/answer?pollId=${pollId}&userId=${userId}`);
  }
  public addAnswer(answer: Answer): Observable<Answer> {
    return this.http.post<Answer>(`${this.apiServerUrl}/answer/add`, answer);
  }
  public updateAnswer(answer: Answer): Observable<Answer> {
    return this.http.put<Answer>(`${this.apiServerUrl}/answer/update`, answer);
  }
  public deleteAnswer(answerId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/answer/delete/${answerId}`);
  }

  //self
  public getAllSelfAnswersByPollId(pollId: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiServerUrl}/answer/self/${pollId}`);
  }
  public findAnswersBySelfPollId(pollId: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiServerUrl}/answer/self?pollId=${pollId}`);
  }
  public addSelfAnswer(answer: Answer): Observable<Answer> {
    return this.http.post<Answer>(`${this.apiServerUrl}/answer/self/add`, answer);
  }
}
