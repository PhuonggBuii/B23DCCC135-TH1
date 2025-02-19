import React from 'react';
import GoalItem from '../GoalItem/GoalItem';
import { StudyGoal } from '../../models/muctieu/study-goal';
import './GoalList.css'; 

interface GoalListProps {
    goals: StudyGoal[];
    onToggleStatus: (id: string) => void;
}

const GoalList: React.FC<GoalListProps> = ({ goals, onToggleStatus }) => {
    return (
        <div className="goal-list-container">
            <h2>Danh sách Mục tiêu Học Tập</h2>
            {goals.map(goal => (
                <GoalItem key={goal.id} goal={goal} onToggleStatus={onToggleStatus} />
            ))}
        </div>
    );
};

export default GoalList;