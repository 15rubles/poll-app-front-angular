import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionWithOptions } from '../entity/questionWithOptions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionWithOptionsService {

  private apiServerUrl = environment.apiBaseUrl;;

  constructor(private http: HttpClient) { }

  public getQuestions(): Observable<QuestionWithOptions[]> {
    return this.http.get<QuestionWithOptions[]>(`${this.apiServerUrl}/questionWithOptions/all`);
  }
  public getQuestionsInPoll(pollId: number): Observable<QuestionWithOptions[]> {
    return this.http.get<QuestionWithOptions[]>(`${this.apiServerUrl}/questionWithOptions/${pollId}/all`);
  }
  public findQuestionById(questionId: number): Observable<QuestionWithOptions> {
    return this.http.get<QuestionWithOptions>(`${this.apiServerUrl}/questionWithOptions/${questionId}`);
  }
  public updateQuestion(question: QuestionWithOptions): Observable<QuestionWithOptions> {
    return this.http.put<QuestionWithOptions>(`${this.apiServerUrl}/questionWithOptions/update`, question);
  }
  public addQuestion(question: QuestionWithOptions): Observable<QuestionWithOptions> {
    return this.http.post<QuestionWithOptions>(`${this.apiServerUrl}/questionWithOptions/add`, question);
  }
  public deleteQuestion(questionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/questionWithOptions/delete/${questionId}`);
  }
  //self
  public getQuestionsInSelfPoll(pollId: number): Observable<QuestionWithOptions[]> {
    return this.http.get<QuestionWithOptions[]>(`${this.apiServerUrl}/questionWithOptions/self/${pollId}/all`);
  }
  public updateSelfQuestion(question: QuestionWithOptions): Observable<QuestionWithOptions> {
    return this.http.put<QuestionWithOptions>(`${this.apiServerUrl}/questionWithOptions/self/update`, question);
  }
  public addQuestionToSelfPoll(question: QuestionWithOptions): Observable<QuestionWithOptions> {
    return this.http.post<QuestionWithOptions>(`${this.apiServerUrl}/questionWithOptions/self/add`, question);
  }
  public deleteQuestionInSelfPoll(questionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/questionWithOptions/self/delete/${questionId}`);
  }

  public getAllowedPollQuestions(pollId: number): Observable<QuestionWithOptions[]> {
    return this.http.get<QuestionWithOptions[]>(`${this.apiServerUrl}/questionWithOptions/self/allowed_polls/${pollId}`);
  }
}
