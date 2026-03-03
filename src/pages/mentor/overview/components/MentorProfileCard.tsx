import { Avatar } from 'antd';
import { useProfileQuery } from '../../../../redux/apiSlices/authSlice';
import { imageUrl } from '../../../../redux/api/baseApi';
import { Link } from 'react-router-dom';

const MentorProfileCard = () => {
    const { data } = useProfileQuery({});

    const mentor = data?.data?.data ?? data?.data ?? data;
    console.log(mentor);
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
                            ? imageUrl + mentor?.assignedStudents[0]?.profile
                            : undefined
                    }
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
