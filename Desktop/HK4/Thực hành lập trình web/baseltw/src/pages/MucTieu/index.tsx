import React, { useState, useEffect } from 'react';
import { StudyGoalsManager } from '../../services/MucTieu/study-goal-manager';
import GoalList from '../../components/GoalList/GoalList';
import { StudyGoal } from '../../models/muctieu/study-goal';
import './style.css';

const App: React.FC = () => {
    const [studyManager, setStudyManager] = useState(new StudyGoalsManager());
    const [subject, setSubject] = useState('');
    const [targetHours, setTargetHours] = useState('');
    const [notes, setNotes] = useState('');
    const [goals, setGoals] = useState<StudyGoal[]>([]);
  
    useEffect(() => {
        const storedGoals = localStorage.getItem('studyGoals');
        if (storedGoals) {
            setGoals(JSON.parse(storedGoals));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('studyGoals', JSON.stringify(goals));
    }, [goals]);


    const handleAddGoal = () => {
        const parsedTargetHours = targetHours === '' ? 0 : parseInt(targetHours);
        studyManager.addGoalFromInput(subject, parsedTargetHours, notes);
        setGoals([...studyManager.getGoals()]);
        setSubject('');
        setTargetHours('');
        setNotes('');
    };

    const handleToggleStatus = (id: string) => {
        studyManager.toggleGoalStatus(id);
        setGoals([...studyManager.getGoals()]);
    };

    return (
        <div>
            <h1>Ứng Dụng Quản Lý Mục Tiêu Học Tập</h1>
            <div className="add-goal-container">
                <input
                    type="text"
                    placeholder="Môn học"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="add-goal-input"
                />
                <input
                    type="number"
                    placeholder="Số giờ"
                    value={targetHours}
                    onChange={(e) => setTargetHours(e.target.value)}
                    className="add-goal-input"
                />
                <input
                    type="text"
                    placeholder="Ghi chú"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="add-goal-input"
                />
                <button onClick={handleAddGoal} className="add-goal-button">
                    Thêm mục tiêu
                </button>
            </div>

            <GoalList goals={goals} onToggleStatus={handleToggleStatus} />
        </div>
    );
};

export default App;