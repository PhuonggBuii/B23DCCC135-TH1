import React from 'react';
import { StudyGoal } from '../../models/muctieu/study-goal';

interface GoalItemProps {
    goal: StudyGoal;
    onToggleStatus: (id: string) => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, onToggleStatus }) => {
    return (
        <div className="goal-item-container">
            <h3>{goal.subject}</h3>
            <p>Mục tiêu: {goal.targetHours} giờ</p>
            <p>
                Trạng thái: {goal.status === 'completed' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
            </p>
            <p>Ghi chú: {goal.notes}</p>
            <button onClick={() => onToggleStatus(goal.id)}>
                {goal.status === 'completed' ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
            </button>
        </div>
    );
};

export default GoalItem;