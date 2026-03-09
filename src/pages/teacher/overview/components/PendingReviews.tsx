import { LuCheckSquare } from 'react-icons/lu';
import { useGetAssignmentQuery } from '../../../../redux/apiSlices/teacher/assignmentSlice';

const PendingReviews = () => {
    const { data, isLoading } = useGetAssignmentQuery({ status: 'PENDING', limit: 3 });
    const assignments = data?.data || [];

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 h-full">
            <h2 className="text-lg font-semibold text-gray-600 mb-4 font-heading">Pending Reviews</h2>
            <div className="space-y-4">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="p-4 rounded-2xl border border-gray-100 bg-gray-50 animate-pulse">
                            <div className="h-5 bg-gray-200 rounded w-40 mb-3" />
                            <div className="h-4 bg-gray-200 rounded w-24" />
                        </div>
                    ))
                ) : assignments.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No pending reviews.</p>
                ) : (
                    assignments.map((assignment: any) => (
                        <div
                            key={assignment._id}
                            className="p-4 rounded-2xl border border-gray-100 flex flex-col space-y-2 transition-all bg-[#EFEFEF]/40"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-gray-800 text-[16px]">{assignment.title}</h3>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                    {assignment.userGroup?.[0]?.name || 'General'}
                                </span>
                                <div className="flex items-center text-green-600 font-medium text-sm">
                                    <LuCheckSquare className="mr-2 text-lg" />
                                    <span>{assignment.submitAssignment?.length || 0} Submissions</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PendingReviews;
