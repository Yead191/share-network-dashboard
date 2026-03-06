export const GoalCard = ({ goal }: { goal: any }) => {
    return (
        <div className="bg-gray-50 rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 leading-tight">{goal.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{goal.description}</p>
            </div>
        </div>
    );
};
