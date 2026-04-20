import { useState } from 'react';
import StudentDetailsModal from '../../../../components/modals/admin/StudentDetailsModal';

const StudentDetails = ({ students, refetch }: { students: any[], refetch: any }) => {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    const handleStudentClick = (student: any) => {
        setSelectedStudent(student);
        setIsDetailsModalOpen(true);
    };

    return (
        <>
            <div className="bg-white p-4 pb-5 rounded-lg shadow-sm mb-6 border border-gray-100 max-h-[345px] overflow-y-auto">
                <h2 className="text-xl font-semibold text-gray-700 mb-6">Student Details</h2>
                <div className="space-y-6">
                    {students?.length > 0 ? (
                        students?.map((student: any) => (
                            <div
                                key={student._id}
                                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                onClick={() => handleStudentClick(student)}
                            >
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={student.profile || 'https://res.cloudinary.com/ddqovbzxy/image/upload/v1736572642/avatar_ziy9mp.jpg'}
                                        alt={student.firstName}
                                        className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-sm">{`${student.firstName} ${student.lastName}`}</h3>
                                        <p className="text-[10px] text-gray-500 truncate max-w-[120px]">{student.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-semibold text-gray-600">Group</p>
                                    <p className="text-[10px] text-green-500 font-medium">
                                        {student.userGroup?.[0]?.name || 'N/A'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-semibold text-gray-600">Track</p>
                                    <p className="text-[10px] text-indigo-500 font-medium">
                                        {student.userGroupTrack?.name || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-400 text-sm">No students assigned</p>
                        </div>
                    )}
                </div>
            </div>

            <StudentDetailsModal
                open={isDetailsModalOpen}
                onCancel={() => setIsDetailsModalOpen(false)}
                student={selectedStudent}
                refetch={refetch}
            />
        </>
    );
};

export default StudentDetails;
