import { Card } from 'antd';
import { FileText } from 'lucide-react';
import moment from 'moment';

const ActiveAssignments = ({ data }: any) => {
    return (
        <Card
            className="shadow-sm border-none rounded-2xl overflow-hidden"
            title={<span className="text-xl font-bold">Active Assignments</span>}
        >
            <div className="space-y-4">
                {data?.map((assignment: any) => (
                    <div
                        key={assignment._id}
                        className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                                <FileText className="text-green-500 w-5 h-5" />
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-800">{assignment.title}</h4>

                                <p className="text-xs text-gray-400">
                                    Due: {moment(assignment.dueDate).format('DD MMM YYYY')}
                                </p>

                                <p className="text-xs text-gray-500">{assignment.description}</p>
                            </div>
                        </div>

                        <span className="text-sm font-bold text-amber-500">Pending</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default ActiveAssignments;
