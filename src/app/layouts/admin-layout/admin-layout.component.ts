import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { Answer } from 'src/app/entity/answer';
import { PollAdmin } from 'src/app/entity/pollAdmin';
import { Question } from 'src/app/entity/question';
import { QuestionWithOptions } from 'src/app/entity/questionWithOptions';
import { User } from 'src/app/entity/user';
import { AnswerService } from 'src/app/_services/answer.service';
import { PollService } from 'src/app/_services/poll.service';
import { QuestionService } from 'src/app/_services/question.service';
import { QuestionWithOptionsService } from 'src/app/_services/questionWithOptions.service';
import { StorageService } from 'src/app/_services/storage.service';
import { UserService } from 'src/app/_services/user.service';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

  result?: string;
  error: string = '';

  isUpdateUserEnabled: boolean = false;
  isUpdateSelfUserEnabled: boolean = false;
  isUpdatePollEnabled: boolean = false;
  isUpdateQuestionEnabled: boolean = false;
  isUpdateQuestionWithOptionsEnabled: boolean = false;
  isUpdateAnswerEnabled: boolean = false;
  isUserInfoEnabled: boolean = false;

  userMenu: boolean = true;
  pollMenu: boolean = false;
  questionMenu: boolean = false;
  questionWithOptionsMenu: boolean = false;
  answerMenu: boolean = false;

  updateUserId?: number;
  updatePollId?: number;
  updateQuestionId?: number;
  updateAnswerId?: number;

  users?: User[];
  polls?: PollAdmin[];
  questions?: Question[];
  questionsWithOptions?: QuestionWithOptions[];
  answers?: Answer[];
  user?: User;

  constructor(
    private pollService: PollService,
    private userServie: UserService,
    private questionService: QuestionService,
    private questionWithOptionsService: QuestionWithOptionsService,
    private answerService: AnswerService,
    private storageService: StorageService,
    private router: Router
  ) { }
  public openUpdateUser(userId: any): void {
    this.updateUserId = userId;
    this.isUpdateUserEnabled = true;
  }
  public openUpdateSelfUser(): void {
    this.isUpdateSelfUserEnabled = true;
  }
  public openUpdatePoll(pollId: any): void {
    this.updatePollId = pollId;
    this.isUpdatePollEnabled = true;
  }
  public openUpdateQuestion(questionId: any): void {
    this.updateQuestionId = questionId;
    this.isUpdateQuestionEnabled = true;
  }

  public openUpdateQuestionWithOptions(questionId: any): void {
    this.updateQuestionId = questionId;
    this.isUpdateQuestionWithOptionsEnabled = true;
  }
  public openUpdateAnswer(answerId: any): void {
    this.updateAnswerId = answerId;
    this.isUpdateAnswerEnabled = true;
  }

  public switchMenu(menu: string): void {
    this.userMenu = false;
    this.pollMenu = false;
    this.questionMenu = false;
    this.answerMenu = false;
    switch (menu) {
      case 'user':
        this.userMenu = true;
        this.getUsers();
        break;
      case 'poll':
        this.pollMenu = true;
        this.getPolls();
        break;
      case 'question':
        this.questionMenu = true;
        this.getQuestions();
        break;
      case 'questionWithOptions':
        this.questionWithOptionsMenu = true;
        this.getQuestionsWithOptions();
        break;
      case 'answer':
        this.answerMenu = true;
        this.getAnswers();
        break;
    }
  }
  ngOnInit(): void {
    this.getUsers();
  }
  //user
  public getUsers() {
    this.userServie.getUsers().subscribe(
      (response: User[]) => {
        this.error = '';
        this.users = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public findUserById(userIdForm: NgForm) {
    this.isUpdateUserEnabled = false;
    this.userServie.findUserById(userIdForm.controls['userId'].value).subscribe(
      (response: User) => {
        this.error = '';
        this.users = [response];
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public addUser(userForm: NgForm) {
    this.userServie.addUser(userForm.value).subscribe(
      (response: User) => {
        this.error = '';
        this.getUsers();
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }
  public updateUser(userForm: NgForm) {
    this.isUpdateUserEnabled = false;
    const user: User = {
      id: this.updateUserId,
      username: userForm.controls['username'].value,
      password: userForm.controls['password'].value,
      role: userForm.controls['role'].value
    }
    this.userServie.updateUser(user).subscribe(
      (response: User) => {
        this.error = '';
        this.getUsers();
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }
  public deleteUser(userId: any) {
    this.userServie.deleteUser(userId).subscribe(
      (response: void) => {
        this.error = '';
        this.getUsers();
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  //poll
  public getPolls() {
    this.pollService.getPolls().subscribe(
      (response: PollAdmin[]) => {
        this.error = '';
        this.polls = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public findPollById(pollIdForm: NgForm) {
    this.pollService.findPollById(pollIdForm.controls['pollId'].value).subscribe(
      (response: PollAdmin) => {
        this.error = '';
        this.polls = [response];
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public addPoll(pollForm: NgForm) {
    this.pollService.addPoll(pollForm.value).subscribe(
      (response: PollAdmin) => {
        this.error = '';
        this.getPolls();
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public updatePoll(pollForm: NgForm) {
    this.isUpdatePollEnabled = false;
    const poll: PollAdmin = {
      id: this.updatePollId,
      name: pollForm.controls['name'].value,
      ownerUserId: pollForm.controls['ownerUserId'].value,
      isDeleted: false
    }
    if (pollForm.controls['isDeleted'].value == "1") {
      poll.isDeleted = true;
    }
    this.pollService.updatePoll(poll).subscribe(
      (response: PollAdmin) => {
        this.error = '';
        this.getPolls();
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public deletePoll(pollId: any) {
    this.pollService.deletePoll(pollId).subscribe(
      (response: void) => {
        this.error = '';
        this.getPolls();
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }
  //questions with options
  public getQuestionsWithOptions() {
    this.questionWithOptionsService.getQuestions().subscribe(
      (response: QuestionWithOptions[]) => {
        this.error = '';
        this.questionsWithOptions = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public getQuestionsWithOptionsInPoll(questionForm: NgForm) {
    this.isUpdateQuestionEnabled = false;
    this.questionWithOptionsService.getQuestionsInPoll(questionForm.controls['pollId'].value).subscribe(
      (response: QuestionWithOptions[]) => {
        this.error = '';
        this.questionsWithOptions = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public findQuestionWithOptionsById(questionForm: NgForm) {
    this.isUpdateQuestionWithOptionsEnabled = false;
    this.questionWithOptionsService.findQuestionById(questionForm.controls['qId'].value).subscribe(
      (response: QuestionWithOptions) => {
        this.error = '';
        this.questionsWithOptions = [response];
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }
  public updateQuestionWithOptions(questionForm: NgForm) {
    this.isUpdateQuestionWithOptionsEnabled = false;
    const question: QuestionWithOptions = {
      id: this.updateQuestionId,
      pollId: questionForm.controls['pollId'].value,
      text: questionForm.controls['text'].value,
      rightAnswer: this.getRightAnswer('add'),
      options: this.getArrayOfOptions('upd')
    }
    this.removeOptions();
    this.questionWithOptionsService.updateQuestion(question).subscribe(
      (response: QuestionWithOptions) => {
        this.error = '';
        this.getQuestionsWithOptions();
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public addQuestionWithOptions(questionForm: NgForm) {
    const question: QuestionWithOptions = {
      pollId: questionForm.controls['pollId'].value,
      text: questionForm.controls['text'].value,
      rightAnswer: this.getRightAnswer('add'),
      options: this.getArrayOfOptions('add')
    }
    this.removeOptions();
    this.questionWithOptionsService.addQuestion(question).subscribe(
      (response: QuestionWithOptions) => {
        this.error = '';
        this.getQuestionsWithOptions();
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public deleteQuestionWithOptions(questionId: any) {
    this.questionWithOptionsService.deleteQuestion(questionId).subscribe(
      (response: void) => {
        this.error = '';
        this.getQuestionsWithOptions();
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public addOption(className: string) {
    const list = document.getElementsByClassName(className + ' hidden')[0];
    const plus = document.getElementsByClassName('plus ' + className)[0];
    let copy = <HTMLElement>list.cloneNode(true);
    copy.classList.remove('hidden');
    copy.id = UUID.UUID();
    copy.classList.add('copy');
    plus.before(copy);
  }


  public removeOption(el: Event) {
    const id: string = (<HTMLElement>el.target).parentElement!.id;
    const remove = document.getElementById(id);
    remove?.remove();
  }

  public getArrayOfOptions(className: string): string[] {
    const list = document.getElementsByClassName('list ' + className);
    const options: string[] = [];
    for (let i = 0; i < list.length; i++) {
      if (!list[i].classList.contains('hidden')) {
        options.push((<HTMLInputElement>list[i].getElementsByClassName('option')[0]).value)
      }
    }
    return options;
  }

  public getRightAnswer(className: string): string {
    let rightAnswer: string = '';
    const list = document.getElementsByClassName('list ' + className);
    for (let i = 0; i < list.length; i++) {
      if ((<HTMLInputElement>list[i].getElementsByClassName('radio')[0]).checked) {
        return (<HTMLInputElement>list[i].getElementsByClassName('option')[0]).value;
      }
    }
    return rightAnswer;
  }

  public removeOptions() {
    const copy = document.getElementsByClassName('copy');
    while (copy.length > 0) {
      copy[0].remove();
    }
  }

  //questions
  public getQuestions() {
    this.questionService.getQuestions().subscribe(
      (response: Question[]) => {
        this.error = '';
        this.questions = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public getQuestionsInPoll(questionForm: NgForm) {
    this.isUpdateQuestionEnabled = false;
    this.questionService.getQuestionsInPoll(questionForm.controls['pollId'].value).subscribe(
      (response: Question[]) => {
        this.error = '';
        this.questions = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public findQuestionById(questionForm: NgForm) {
    this.isUpdateQuestionEnabled = false;
    this.questionService.findQuestionById(questionForm.controls['qId'].value).subscribe(
      (response: Question) => {
        this.error = '';
        this.questions = [response];
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }
  public updateQuestion(questionForm: NgForm) {
    this.isUpdateQuestionEnabled = false;
    const question: Question = {
      id: this.updateQuestionId,
      text: questionForm.controls['text'].value,
      pollId: questionForm.controls['pollId'].value
    }
    this.questionService.updateQuestion(question).subscribe(
      (response: Question) => {
        this.error = '';
        this.getQuestions();
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public addQuestion(questionForm: NgForm) {
    this.questionService.addQuestion(questionForm.value).subscribe(
      (response: Question) => {
        this.error = '';
        this.getQuestions();
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public deleteQuestion(questionId: any) {
    this.questionService.deleteQuestion(questionId).subscribe(
      (response: void) => {
        this.error = '';
        this.getQuestions();
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }



  //answer
  public getAnswers() {
    this.answerService.getAnswers().subscribe(
      (response: Answer[]) => {
        this.error = '';
        this.answers = response
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public getAllAnswersByPollId(answerForm: NgForm) {
    this.isUpdateAnswerEnabled = false;
    this.answerService.getAllAnswersByPollId(answerForm.controls['pollId'].value).subscribe(
      (response: Answer[]) => {
        this.error = '';
        this.answers = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public findAnswerById(answerForm: NgForm) {
    this.isUpdateAnswerEnabled = false;
    this.answerService.findAnswerById(answerForm.controls['answerId'].value).subscribe(
      (response: Answer) => {
        this.error = '';
        this.answers = [response];
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }
  public findAnswersByPollIdAndUserId(answerForm: NgForm) {
    this.isUpdateAnswerEnabled = false;
    this.answerService.findAnswersByPollIdAndUserId(answerForm.controls['pollId'].value, answerForm.controls['userId'].value).subscribe(
      (response: Answer[]) => {
        this.error = '';
        this.answers = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }
  public addAnswer(answerForm: NgForm) {
    let withOptions: boolean = false;
    if (answerForm.controls['withOptions'].value) {
      withOptions = true;
    }
    const answer: Answer = {
      text: answerForm.controls['text'].value,
      pollId: answerForm.controls['pollId'].value,
      questionId: answerForm.controls['questionId'].value,
      userId: answerForm.controls['userId'].value,
      withOptions: withOptions,
    }
    this.answerService.addAnswer(answer).subscribe(
      (response: Answer) => {
        this.error = '';
        this.getAnswers();
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }
  public updateAnswer(answerForm: NgForm) {
    this.isUpdateAnswerEnabled = false;
    let withOptions: boolean = false;
    if (answerForm.controls['withOptions'].value) {
      withOptions = true;
    }
    const answer: Answer = {
      id: this.updateAnswerId,
      text: answerForm.controls['text'].value,
      pollId: answerForm.controls['pollId'].value,
      questionId: answerForm.controls['questionId'].value,
      userId: answerForm.controls['userId'].value,
      withOptions: withOptions,
    }
    this.answerService.updateAnswer(answer).subscribe(
      (response: Answer) => {
        this.error = '';
        this.getAnswers();
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public deleteAnswer(answerId: any) {
    this.answerService.deleteAnswer(answerId).subscribe(
      (response: void) => {
        this.error = '';
        this.getAnswers();
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }


  //self
  public getSelfUser() {
    this.isUserInfoEnabled = true;
    this.userServie.getSelfUser().subscribe(
      (response: User) => {
        this.error = '';
        this.user = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public updateSelfUser(userForm: NgForm) {
    this.isUpdateSelfUserEnabled = false;
    this.userServie.updateSelfUser(userForm.value).subscribe(
      (response: User) => {
        this.error = '';
        this.user = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    )
  }

  public logout() {
    this.storageService.logout();
    this.router.navigate(['/login']);
  }
}
