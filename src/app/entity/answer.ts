export interface Answer {
    id?: number;
    text: string;
    pollId: number;
    questionId: number;
    userId?: number;
    withOptions: boolean;
}