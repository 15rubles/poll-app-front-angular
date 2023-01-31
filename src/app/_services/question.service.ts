import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../entity/question';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private apiServerUrl = environment.apiBaseUrl;;

  constructor(private http: HttpClient) { }

  public getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiServerUrl}/question/all`);
  }
  public getQuestionsInPoll(pollId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiServerUrl}/question/${pollId}/all`);
  }
  public findQuestionById(questionId: number): Observable<Question> {
    return this.http.get<Question>(`${this.apiServerUrl}/question/${questionId}`);
  }
  public updateQuestion(question: Question): Observable<Question> {
    return this.http.put<Question>(`${this.apiServerUrl}/question/update`, question);
  }
  public addQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(`${this.apiServerUrl}/question/add`, question);
  }
  public deleteQuestion(questionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/question/delete/${questionId}`);
  }
  //self
  public getQuestionsInSelfPoll(pollId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiServerUrl}/question/self/${pollId}/all`);
  }
  public updateSelfQuestion(question: Question): Observable<Question> {
    return this.http.put<Question>(`${this.apiServerUrl}/question/self/update`, question);
  }
  public addQuestionToSelfPoll(question: Question): Observable<Question> {
    return this.http.post<Question>(`${this.apiServerUrl}/question/self/add`, question);
  }
  public deleteQuestionInSelfPoll(questionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/question/self/delete/${questionId}`);
  }

  public getAllowedPollQuestions(pollId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiServerUrl}/question/self/allowed_polls/${pollId}`);
  }
}
