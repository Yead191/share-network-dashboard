import { Card } from 'antd';
import { Target } from 'lucide-react';

interface Goal {
    _id: string;
    title: string;
    description?: string;
    index?: number;
    isActive?: boolean;
}

const goalColors = [
    { text: 'text-blue-500', bg: 'bg-blue-50' },
    { text: 'text-purple-500', bg: 'bg-purple-50' },
    { text: 'text-green-500', bg: 'bg-green-50' },
];

const CoreGoals = ({ goals = [] }: { goals: Goal[] }) => {
    return (
        <Card
            className="shadow-sm border-none rounded-2xl overflow-hidden"
            title={<span className="text-xl font-bold">Core Goals</span>}
        >
            <div className="space-y-6">
                {goals.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No goals assigned yet.</p>
                ) : (
                    goals.map((goal, idx) => {
                        const color = goalColors[idx % goalColors.length];
                        return (
                            <div key={goal._id} className="flex gap-4">
                                <div
                                    className={`w-12 h-12 rounded-2xl ${color.bg} flex items-center justify-center flex-shrink-0`}
                                >
                                    <Target className={`${color.text} w-6 h-6`} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">{goal.title}</h4>
                                    {goal.description && (
                                        <p className="text-gray-500 leading-relaxed">{goal.description}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </Card>
    );
};

export default CoreGoals;
