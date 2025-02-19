export interface StudyGoal {
    id: string;
    subject: string;
    targetHours: number;
    status: 'completed' | 'not completed';
    notes: string;
}