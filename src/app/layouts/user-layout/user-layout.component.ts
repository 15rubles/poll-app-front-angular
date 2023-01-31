import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Answer } from 'src/app/entity/answer';
import { Poll } from 'src/app/entity/poll';
import { Question } from 'src/app/entity/question';
import { User } from 'src/app/entity/user';
import { AnswerService } from 'src/app/_services/answer.service';
import { PollService } from 'src/app/_services/poll.service';
import { QuestionService } from 'src/app/_services/question.service';
import { StorageService } from 'src/app/_services/storage.service';
import { UserService } from 'src/app/_services/user.service';
import { UserAnswer } from 'src/app/entity/userAnswer';
import { QuestionWithOptions } from 'src/app/entity/questionWithOptions';
import { QuestionWithOptionsService } from 'src/app/_services/questionWithOptions.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnInit {

  result?: string;
  error?: string;
  allowedPolls?: Poll[];
  questions?: Question[];
  questionsWithOptions?: QuestionWithOptions[];
  questionsForAnswers?: Question[];
  questionsWithOptionsForAnswers?: QuestionWithOptions[];
  answers?: UserAnswer[];
  user?: User;
  isUpdateUserEnable: boolean = false;
  isQuestionsEnabled: boolean = false;
  isAnswersEnabled: boolean = false;
  isUserInfoEnabled: boolean = false;
  constructor(
    private pollService: PollService,
    private userServie: UserService,
    private questionService: QuestionService,
    private questionWithOptionsService: QuestionWithOptionsService,
    private answerService: AnswerService,
    private storageService: StorageService,
    private router: Router
  ) { }
  @ViewChildren('questionWithOptionsForm') questionsWithOptionsForms?: QueryList<ElementRef>;
  @ViewChildren('questionForm') questionsForms?: QueryList<ElementRef>;

  ngOnInit(): void {
    this.getAllowedPolls();
  }

  public openUpdateUser(): void {
    this.isUpdateUserEnable = true;
  }
  public getAllowedPolls() {
    this.pollService.getAllowedPolls().subscribe(
      (response: Poll[]) => {
        this.error = '';
        this.allowedPolls = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
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

  public getAllowedPollQuestions(pollId: any) {
    this.isQuestionsEnabled = true;
    this.questionService.getAllowedPollQuestions(pollId).subscribe(
      (response: Question[]) => {
        this.error = '';
        this.questions = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
    this.questionWithOptionsService.getAllowedPollQuestions(pollId).subscribe(
      (response: QuestionWithOptions[]) => {
        this.error = '';
        this.questionsWithOptions = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
  }

  public updateUser(userForm: NgForm) {
    this.isUpdateUserEnable = false;
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
  public getAllSelfAnswersByPollId(pollId: any) {
    this.questionService.getAllowedPollQuestions(pollId).subscribe(
      (response: Question[]) => {
        this.error = '';
        this.questionsForAnswers = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
    this.questionWithOptionsService.getAllowedPollQuestions(pollId).subscribe(
      (response: QuestionWithOptions[]) => {
        this.error = '';
        this.questionsWithOptionsForAnswers = response;
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    );
    this.isAnswersEnabled = true;
    this.answerService.getAllSelfAnswersByPollId(pollId).subscribe(
      (response: Answer[]) => {
        this.error = '';
        this.answers = [];

        response.forEach((item) => {
          let qText;
          if (item.withOptions == true) {
            qText = this.questionsWithOptionsForAnswers?.find(question => question.id == item.questionId)?.text;
          }
          else {
            qText = this.questionsForAnswers?.find(question => question.id == item.questionId)?.text;
          }
          this.answers?.push({
            text: item.text,
            questionText: qText
          })
        });
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    )
  }

  public addSelfAnswer(answer: Answer) {
    this.answerService.addSelfAnswer(answer).subscribe(
      (response: Answer) => {
        this.error = '';
      },
      (error: HttpErrorResponse) => {
        this.error = error.error.message;
      }
    )
  }

  public applyAllQuestionForms() {
    let questionsForms = this.questionsForms?.toArray();
    let questionsWithOptionsForms = this.questionsWithOptionsForms?.toArray();
    for (let i = 0; i < questionsWithOptionsForms!.length; i++) {
      let text: string = '';
      const list: Array<HTMLInputElement> = questionsWithOptionsForms![i].nativeElement.getElementsByClassName('answer');
      for (let i = 0; i < list!.length; i++) {
        if (list[i].checked) {
          text = list[i].value;
          break;
        }
      }
      const answer: Answer = {
        pollId: Number((<HTMLInputElement>questionsWithOptionsForms![i].nativeElement.getElementsByClassName('pollId')[0]).value),
        text: text,
        questionId: Number((<HTMLInputElement>questionsWithOptionsForms![i].nativeElement.getElementsByClassName('questionId')[0]).value),
        withOptions: true,
      }
      this.addSelfAnswer(answer);
    }
    for (let i = 0; i < questionsForms!.length; i++) {
      const answer: Answer = {
        pollId: Number((<HTMLInputElement>questionsForms![i].nativeElement.getElementsByClassName('pollId')[0]).value),
        text: (<HTMLInputElement>questionsForms![i].nativeElement.getElementsByClassName('answer')[0]).value,
        questionId: Number((<HTMLInputElement>questionsForms![i].nativeElement.getElementsByClassName('questionId')[0]).value),
        withOptions: false,
      }
      this.addSelfAnswer(answer);
    }
  }
  public logout() {
    this.storageService.logout();
    this.router.navigate(['/login']);
  }
}
