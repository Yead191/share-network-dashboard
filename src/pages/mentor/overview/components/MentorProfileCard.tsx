import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { getImageUrl } from '../../../../utils/getImageUrl';

const MentorProfileCard = ({ mentor }: { mentor: any }) => {
    const hasStudent = mentor?.assignedStudents?.length > 0;

    if (!hasStudent) {
        return (
            <div className="bg-white p-6 rounded-xl border border-dashed border-gray-200 flex items-center gap-6 mb-6">
                <div className="relative">
                    <Avatar
                        size={100}
                        icon={<UserOutlined />}
                        className="border-2 border-gray-100 shadow-sm bg-gray-50 text-gray-300"
                    />
                </div>

                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-500 mb-1">No Student Assigned Yet</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        You haven't been assigned a student yet. Please contact the admin to get a student assigned to
                        your profile.
                    </p>
                    <span className="inline-block mt-2 text-xs font-medium text-blue-500 bg-blue-50 px-3 py-1 rounded-full">
                        Contact Admin
                    </span>
                </div>
            </div>
        );
    }

    return (
        <Link
            to={'/mentor/students'}
            className="bg-white p-6 rounded-xl border border-gray-100 flex items-center gap-6 mb-6"
        >
            <div className="relative">
                <Avatar
                    size={100}
                    src={
                        mentor?.assignedStudents[0]?.profile
                            ? getImageUrl(mentor?.assignedStudents[0]?.profile)
                            : undefined
                    }
                    icon={<UserOutlined />}
                    className="border-2 border-white shadow-md"
                />
            </div>

            <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {mentor?.assignedStudents[0]?.firstName + ' ' + mentor?.assignedStudents[0]?.lastName}
                        </h2>
                        <span className="text-green-600 font-medium text-sm">STUDENT</span>
                    </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed max-w-4xl">
                    {mentor?.assignedStudents[0]?.about || 'No about information available'}
                </p>
            </div>
        </Link>
    );
};

export default MentorProfileCard;
