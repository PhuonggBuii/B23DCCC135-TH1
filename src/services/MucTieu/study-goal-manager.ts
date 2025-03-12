import { StudyGoal } from '../../models/muctieu/study-goal';

export class StudyGoalsManager {
    private goals: StudyGoal[] = [];

    addGoal(subject: string, targetHours: number, notes: string): void {
        const newGoal: StudyGoal = {
            id: this.generateId(),
            subject,
            targetHours,
            status: 'not completed',
            notes 
        };
        this.goals.push(newGoal);
    }

    addGoalFromInput(subject: string, targetHours: number, notes: string) {
        const newGoal: StudyGoal = {
            id: this.generateId(),
            subject: subject,
            targetHours: targetHours,
            status: 'not completed',
            notes: notes, 
        };
        this.goals.push(newGoal);
    }

    toggleGoalStatus(id: string): void {
        const goal = this.goals.find(g => g.id === id);
        if (goal) {
            goal.status = goal.status === 'completed' ? 'not completed' : 'completed';
        }
    }

    displayGoals(): void {
        this.goals.forEach(goal => {
            console.log(`Môn học: ${goal.subject}`);
            console.log(`Mục tiêu giờ học: ${goal.targetHours}`);
            console.log(`Trạng thái: ${goal.status}`);
            console.log(`Ghi chú: ${goal.notes}`); 
            console.log('-------------------');
        });
    }

    getGoals(): StudyGoal[] {
        return this.goals;
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}