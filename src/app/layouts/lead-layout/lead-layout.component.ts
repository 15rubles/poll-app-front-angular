import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Answer } from 'src/app/entity/answer';
import { Poll } from 'src/app/entity/poll';
import { Question } from 'src/app/entity/question';
import { QuestionWithOptions } from 'src/app/entity/questionWithOptions';
import { User } from 'src/app/entity/user';
import { UserAnswer } from 'src/app/entity/userAnswer';
import { AnswerService } from 'src/app/_services/answer.service';
import { PollService } from 'src/app/_services/poll.service';
import { QuestionService } from 'src/app/_services/question.service';
import { QuestionWithOptionsService } from 'src/app/_services/questionWithOptions.service';
import { StorageService } from 'src/app/_services/storage.service';
import { UserService } from 'src/app/_services/user.service';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-lead-layout',
  templateUrl: './lead-layout.component.html',
  styleUrls: ['./lead-layout.component.css']
})
export class LeadLayoutComponent implements OnInit {

  result?: string;
  error?: string;

  allowedPolls?: Poll[];
  ownedPolls?: Poll[];
  ownedPollQuestions?: Question[];
  ownedPollQuestionsWithOptions?: QuestionWithOptions[];
  questionsForAnswers?: Question[];
  questionsWithOptionsForAnswers?: QuestionWithOptions[];
  rightAnswersQuantity?: number[];

  questions?: Question[];
  questionsWithOptions?: QuestionWithOptions[];
  options?: string[] = [''];
  answers?: UserAnswer[];
  answersByUsers?: Array<UserAnswer[]>
  user?: User;
  allUsers?: User[];

  pollId?: number;
  updatePollId?: number;
  updateQuestionId?: number;

  isPollUpdateEnabled: boolean = false;
  isUserUpdateEnable: boolean = false;
  isQuestionUpdateEnable: boolean = false;
  isQuestionWithOptionsUpdateEnable: boolean = false;
  isUserAllowedEnable: boolean = false;
  isUserMenuEnabled: boolean = false;
  isQuestionsEnabled: boolean = false;
  isAnswersEnabled: boolean = false;
  isUserInfoEnabled: boolean = false;
  constructor(
    private pollService: PollService,
    private userServie: UserService,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private storageService: StorageService,
    private questionWithOptionsService: QuestionWithOptionsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.findSelfPolls();
    this.getAllUsersSelf();
  }

  public openUserMenu(): void {
    this.isUserMenuEnabled = true;
    this.error = '';
    this.isAnswersEnabled = false;
  }

  public openLeadMenu(): void {
    this.isUserMenuEnabled = false;
    this.error = '';
    this.isAnswersEnabled = false;
  }
  public openUserUpdate(): void {
    this.isUserUpdateEnable = true;
  }
  public openUserAllowed(): void {
    this.isUserUpdateEnable = true;
  }
  public openQuestionUpdate(questionId: any): void {
    this.updateQuestionId = questionId;
    this.isQuestionWithOptionsUpdateEnable = false;
    this.isQuestionUpdateEnable = true;
  }
  public openQuestionWithOptionsUpdate(questionId: any): void {
    this.updateQuestionId = questionId;
    this.isQuestionUpdateEnable = false;
    this.isQuestionWithOptionsUpdateEnable = true;
  }

  public openPollUpdate(pollId: any): void {
    this.updatePollId = pollId;
    this.isPollUpdateEnabled = true;
  }

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

  public getAllUsersSelf() {
    this.userServie.getAllUsersSelf().subscribe(
      (response: User[]) => {
        this.error = '';
        this.allUsers = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }


  public updateUser(userForm: NgForm) {
    this.isUserUpdateEnable = false;
    this.userServie.updateSelfUser(userForm.value).subscribe(
      (response: User) => {
        this.error = '';
        this.result = JSON.stringify(response)
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    )
  }

  //polls
  public findSelfPolls() {
    this.pollService.findSelfPolls().subscribe(
      (response: Poll[]) => {
        this.error = '';
        this.ownedPolls = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    )
  }
  public findSelfPollById(pollIdForm: NgForm) {
    this.pollService.findSelfPollById(pollIdForm.controls['pollId'].value).subscribe(
      (response: Poll) => {
        this.error = '';
        this.result = JSON.stringify(response)
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    )
  }

  public addSelfPoll(pollForm: NgForm) {
    this.pollService.addSelfPoll(pollForm.value).subscribe(
      (response: Poll) => {
        this.error = '';
        this.findSelfPolls();
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    )
  }

  public deleteSelfPoll(pollId: any) {
    this.pollService.deleteSelfPoll(pollId).subscribe(
      (response: void) => {
        this.error = '';
        this.findSelfPolls();
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    )
  }

  public updateSelfPoll(pollNameForm: NgForm) {
    this.isPollUpdateEnabled = false;
    const poll: Poll = {
      id: this.updatePollId,
      name: pollNameForm.controls['name'].value,
    };
    this.pollService.updateSelfPoll(poll).subscribe(
      (response: Poll) => {
        this.error = '';
        this.findSelfPolls();
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    )
  }

  public updateUserAllowedPolls(allowedPollsForm: NgForm) {
    this.userServie.updateUserAllowedPolls(
      allowedPollsForm.controls['username'].value,
      allowedPollsForm.controls['pollId'].value,
      allowedPollsForm.controls['isAllowed'].value
    ).subscribe(
      (response: any) => {
        this.error = '';
        this.result = 'Updated';
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
        this.result = '';
      }
    )
  }
  //questions
  public getQuestionsInSelfPoll(pollId: any) {
    this.getQuestionsWithOptionsInSelfPoll(pollId);
    this.pollId = pollId;
    this.questionService.getQuestionsInSelfPoll(pollId).subscribe(
      (response: Question[]) => {
        this.error = '';
        this.ownedPollQuestions = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    )
  }
  public updateSelfQuestion(qForm: NgForm) {
    this.isQuestionUpdateEnable = false;
    const question: Question = {
      id: this.updateQuestionId,
      text: qForm.controls['text'].value,
    }
    this.questionService.updateSelfQuestion(question).subscribe(
      (response: Question) => {
        this.error = '';
        this.getQuestionsInSelfPoll(this.pollId);
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    )
  }
  public addQuestionToSelfPoll(qTextForm: NgForm) {
    const question: Question = {
      pollId: this.pollId,
      text: qTextForm.controls['text'].value,
      rightAnswer: qTextForm.controls['rightAnswer'].value,
    }
    this.questionService.addQuestionToSelfPoll(question).subscribe(
      (response: Question) => {
        this.error = '';
        this.getQuestionsInSelfPoll(this.pollId);
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    )
  }
  public deleteQuestionInSelfPoll(qId: any) {
    this.questionService.deleteQuestionInSelfPoll(qId).subscribe(
      (response: void) => {
        this.error = '';
        this.getQuestionsInSelfPoll(this.pollId);
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    )
  }

  //questionsWithOptions
  public getQuestionsWithOptionsInSelfPoll(pollId: any) {
    this.pollId = pollId;
    this.questionWithOptionsService.getQuestionsInSelfPoll(pollId).subscribe(
      (response: QuestionWithOptions[]) => {
        this.error = '';
        this.ownedPollQuestionsWithOptions = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    )
  }
  public updateSelfQuestionWithOptions(qForm: NgForm) {
    this.isQuestionWithOptionsUpdateEnable = false;
    const question: QuestionWithOptions = {
      id: this.updateQuestionId,
      text: qForm.controls['text'].value,
      rightAnswer: this.getRightAnswer('upd'),
      options: this.getArrayOfOptions('upd')
    }

    this.questionWithOptionsService.updateSelfQuestion(question).subscribe(
      (response: QuestionWithOptions) => {
        this.error = '';
        this.getQuestionsWithOptionsInSelfPoll(this.pollId);
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    )
  }
  public addQuestionWithOptionsToSelfPoll(qTextForm: NgForm) {

    const question: QuestionWithOptions = {
      pollId: this.pollId,
      text: qTextForm.controls['text'].value,
      rightAnswer: this.getRightAnswer('add'),
      options: this.getArrayOfOptions('add')
    }
    this.removeOptions();
    this.questionWithOptionsService.addQuestionToSelfPoll(question).subscribe(
      (response: QuestionWithOptions) => {
        this.error = '';
        this.getQuestionsWithOptionsInSelfPoll(this.pollId);

      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    )
  }
  public deleteQuestionWithOptionsInSelfPoll(qId: any) {
    this.questionWithOptionsService.deleteQuestionInSelfPoll(qId).subscribe(
      (response: void) => {
        this.error = '';
        this.getQuestionsWithOptionsInSelfPoll(this.pollId);
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

  public findAnswersBySelfPollId(pollId: any) {
    this.getQuestionsInSelfPoll(pollId);
    this.getQuestionsWithOptionsInSelfPoll(pollId);

    this.questionService.getQuestionsInSelfPoll(pollId).subscribe(
      (response: Question[]) => {
        this.error = '';
        this.questionsForAnswers = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
    this.questionWithOptionsService.getQuestionsInSelfPoll(pollId).subscribe(
      (response: QuestionWithOptions[]) => {
        this.error = '';
        this.questionsWithOptionsForAnswers = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
    this.isAnswersEnabled = true;
    this.answerService.findAnswersBySelfPollId(pollId).subscribe(
      (response: Answer[]) => {
        this.error = '';
        this.answers = [];

        response.forEach((item) => {
          let qText;
          const username = this.allUsers?.find(user => user.id == item.userId)?.username;
          let right: boolean = false;
          if (item.withOptions == true) {
            qText = this.questionsWithOptionsForAnswers?.find(question => question.id == item.questionId)?.text;
            let rightAnswer = this.questionsWithOptionsForAnswers?.find(question => question.id == item.questionId)?.rightAnswer;
            if (rightAnswer == item.text) {
              right = true;
            }
          }
          else {
            qText = this.questionsForAnswers?.find(question => question.id == item.questionId)?.text;
            let rightAnswer = this.questionsForAnswers?.find(question => question.id == item.questionId)?.rightAnswer;
            if (rightAnswer == item.text) {
              right = true;
            }
          }
          this.answers?.push({
            text: item.text,
            questionText: qText,
            username: username,
            right: right
          })
        });
        this.answers.sort(function (x, y) {
          if (x.username! < y.username!) {
            return 1;
          }
          if (x.username! > y.username!) {
            return -1;
          }
          return 0;
        })

        this.answersByUsers = [];
        if (this.answers.length > 0) {
          let usernameController = this.answers[0].username;
          while (this.answers.length > 0) {
            let answersArr: UserAnswer[] = [];
            while (this.answers.length > 0 && this.answers[0].username == usernameController) {
              answersArr.push(this.answers[0]);
              this.answers.splice(0, 1);
            }
            if (this.answers.length > 0) {
              usernameController = this.answers[0].username;
            }
            this.answersByUsers.push(answersArr);
          }
          this.rightAnswersQuantity = [];
          for (let i = 0; i < this.answersByUsers.length; i++) {
            let rightAnswersQuantity: number = 0;
            for (let j = 0; j < this.answersByUsers[i].length; j++) {
              if (this.answersByUsers[i][j].right) {
                rightAnswersQuantity = rightAnswersQuantity + 1;
              }
            }
            this.rightAnswersQuantity.push(rightAnswersQuantity);
          }

        }
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    )

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

  public addOptionAngular(className: string) {

    this.options = this.getArrayOfOptions(className);
    this.options.push('');
  }

  public removeOption(el: Event) {
    let input: string = (<HTMLInputElement>(<HTMLElement>el.target).parentElement!.getElementsByClassName('option')[0]).value;
    const index = this.options?.indexOf(input);
    if (index !== -1) {
      this.options?.splice(index!, 1);
    }
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

}

