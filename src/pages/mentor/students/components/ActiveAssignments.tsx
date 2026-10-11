import { useState } from 'react';
import { Card } from 'antd';
import { FileText } from 'lucide-react';
import moment from 'moment';
import AssignmentDetailsModal from '../../../../components/modals/mentor/AssignmentDetailsModal';

const ActiveAssignments = ({ data, studentId }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

    const handleOpenModal = (assignment: any) => {
        setSelectedAssignment(assignment);
        setIsModalOpen(true);
    };

    return (
        <Card
            className="shadow-sm border-none rounded-2xl overflow-hidden"
            title={<span className="text-xl font-bold">Active Assignments</span>}
        >
            <div className="space-y-4">
                {data && data.length > 0 ? (
                    data.map((assignment: any) => {
                        const submission = assignment.submitAssignment?.find(
                            (s: any) =>
                                (s.studentId?._id || s.studentId)?.toString() === studentId?.toString() &&
                                s.status === 'COMPLETED',
                        );
                        const isCompleted = !!submission;

                        return (
                            <div
                                key={assignment._id}
                                onClick={() => handleOpenModal(assignment)}
                                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                                        <FileText className="text-green-500 w-5 h-5" />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-800">{assignment.title}</h4>
                                            {assignment.studentAssigned && assignment.studentAssigned.length > 0 && (
                                                <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                                                    Individual
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-gray-400">
                                            Due: {moment(assignment.dueDate).format('DD MMM YYYY')}
                                        </p>

                                        <p className="text-xs text-gray-500 line-clamp-1">{assignment.description}</p>
                                    </div>
                                </div>

                                {isCompleted ? (
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                                        Completed
                                    </span>
                                ) : (
                                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                                        Pending
                                    </span>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8 text-gray-400 text-sm">
                        No active assignments found for this student
                    </div>
                )}
            </div>

            <AssignmentDetailsModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                data={selectedAssignment}
            />
        </Card>
    );
};

export default ActiveAssignments;
