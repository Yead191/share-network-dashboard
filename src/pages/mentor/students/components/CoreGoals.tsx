import { Card } from 'antd';
import { Target, Sparkles } from 'lucide-react';

const CoreGoals = ({ goals }: { goals: any[] }) => {
    return (
        <Card
            className="shadow-sm border border-gray-100 rounded-2xl h-full bg-white flex flex-col"
            title={
                <div className="flex items-center gap-2 py-1">
                    <Target size={18} className="text-indigo-500" />
                    <span className="text-base font-bold text-gray-800">Core Goals</span>
                </div>
            }
            styles={{
                body: {
                    padding: '16px',
                    flex: 1,
                    overflowY: 'auto',
                },
            }}
        >
            <div className="space-y-4">
                {goals && goals.length > 0 ? (
                    goals.slice(0, 3).map((goal: any, idx: number) => (
                        <div key={goal?._id || idx} className="flex gap-4 group">
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black border border-indigo-100 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500 transition-all duration-300">
                                    {idx + 1}
                                </div>
                                {idx < Math.min(goals.length, 3) - 1 && (
                                    <div className="w-px flex-1 bg-gray-100 my-1"></div>
                                )}
                            </div>
                            <div className="flex-1 pb-1">
                                <h4 className="text-sm font-bold text-gray-800 leading-none mb-1.5 group-hover:text-indigo-600 transition-colors">
                                    {goal?.title}
                                </h4>
                                <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                                    {goal?.description}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-6 text-center">
                        <Sparkles size={16} className="text-gray-300 mx-auto mb-2" />
                        <p className="text-xs text-gray-400 font-medium tracking-tight">Set some milestones</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default CoreGoals;
