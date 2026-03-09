interface Goal {
    _id: string;
    title: string;
    description?: string;
    index?: number;
    isActive?: boolean;
}

const goalStyles = [
    { color: '#22C55E', bgColor: '#F0FDF4', borderColor: '#BBF7D0' },
    { color: '#3B82F6', bgColor: '#EFF6FF', borderColor: '#BFDBFE' },
    { color: '#8B5CF6', bgColor: '#F5F3FF', borderColor: '#DDD6FE' },
];

const GoalCards = ({ goals = [] }: { goals: Goal[] }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {goals.length === 0 ? (
                <p className="text-gray-400 col-span-3 text-center py-4">No goals assigned yet.</p>
            ) : (
                goals.map((goal, idx) => {
                    const style = goalStyles[idx % goalStyles.length];
                    return (
                        <div
                            key={goal._id}
                            className="p-5 rounded-2xl border relative shadow-sm"
                            style={{
                                backgroundColor: style.bgColor,
                                borderColor: style.borderColor,
                            }}
                        >
                            <h3
                                className="font-bold text-lg mb-2"
                                style={{ color: goal.isActive !== false ? style.color : '#9CA3AF' }}
                            >
                                Goal: {goal.index ?? idx + 1}
                            </h3>
                            <h4 className="text-gray-800 font-bold mb-1">{goal.title}</h4>
                            {goal.description && <p className="text-gray-500 text-sm">{goal.description}</p>}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default GoalCards;
