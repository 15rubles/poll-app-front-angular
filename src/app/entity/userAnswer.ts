export interface UserAnswer {
    id?: number;
    text: string;
    pollId?: number;
    questionId?: number;
    userId?: number;
    questionText?: string;
    username?: string;
    right?: boolean;
}