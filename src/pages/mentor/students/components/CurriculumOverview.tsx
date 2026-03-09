import { Card } from 'antd';

interface CurriculumItem {
    name: string;
    description?: string;
    color: string;
}

interface CurriculumOverviewProps {
    data: CurriculumItem[];
}

const CurriculumOverview = ({ data }: CurriculumOverviewProps) => {
    return (
        <Card
            className="shadow-sm border-none rounded-2xl overflow-hidden"
            title={<span className="text-xl font-bold">Curriculum Overview</span>}
        >
            <div className="space-y-6">
                {data.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No curriculum assigned yet.</p>
                ) : (
                    data.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            <div
                                className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                                style={{ backgroundColor: item.color }}
                            />
                            <div>
                                <span className="font-medium text-gray-700">{item.name}</span>
                                {item.description && (
                                    <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};

export default CurriculumOverview;
