export interface QuestionWithOptions {
    id?: number;
    text: string;
    pollId?: number;
    rightAnswer?: string;
    options: string[];
}