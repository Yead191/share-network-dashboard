import { useState } from 'react';
import { Button, Avatar, Spin } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import EditProfile from './components/EditProfile';
import { imageUrl } from '../../../redux/api/baseApi';
import { useProfileQuery as useGetProfileQuery } from '../../../redux/apiSlices/authSlice';
import Spinner from '../../../components/shared/Spinner';

export default function MentorCoordinatorProfile() {
    const { data, isLoading, refetch } = useGetProfileQuery({});

    const user = data?.data?.data ?? data?.data ?? data;
    console.log(user);
    const [isEditing, setIsEditing] = useState(false);

    if (isLoading) {
        return <Spinner />;
    }

    if (isEditing) {
        return (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-[#333333]">Edit Profile</h2>
                        <p className="text-gray-500 text-sm">Update your professional information and mentor profile</p>
                    </div>
                    <Button onClick={() => setIsEditing(false)}>Back to Profile</Button>
                </div>
                <EditProfile user={user} onCancel={() => setIsEditing(false)} refetch={refetch} />
            </div>
        );
    }

    const infoItem = (label: string, value: string | undefined) => (
        <div className="mb-4">
            <span className="text-gray-500 text-sm block mb-1">{label}</span>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-100 min-h-[48px] flex items-center">
                <span className="text-[#333333]">{value || 'N/A'}</span>
            </div>
        </div>
    );

    const displayName = user?.firstName + ' ' + user?.lastName || 'N/A';

    // Resolve profile image URL safely
    const profileSrc = user?.profile
        ? user.profile.startsWith('http')
            ? user?.profile
            : `${imageUrl}${user.profile}`
        : undefined;
    console.log('User Profile Data:', profileSrc);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[#333333]">Profile</h2>
                    <p className="text-gray-500 text-sm">Manage your professional information and mentor profile</p>
                </div>
                <Button
                    icon={<EditOutlined />}
                    onClick={() => setIsEditing(true)}
                    className="flex items-center h-10 px-6 rounded-md"
                >
                    Edit Profile
                </Button>
            </div>

            {/* Profile Summary */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 inline-flex items-center gap-5 mb-10 shadow-sm min-w-[320px]">
                <Avatar shape="square" size={80} src={profileSrc} className="rounded-lg shadow-sm" />
                <div>
                    <h3 className="text-lg font-bold text-[#333333]">{displayName}</h3>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                    <span className="text-green-600 font-semibold text-sm mt-1 block px-3 py-0.5 bg-green-50 rounded-full w-fit border border-green-100">
                        {user?.role}
                    </span>
                </div>
            </div>

            {/* About Me */}
            <div className="mb-10">
                <h3 className="text-lg font-bold text-[#333333] mb-4">About Me</h3>
                <div className="bg-white p-4 rounded-xl border border-gray-200 min-h-[100px] shadow-sm">
                    {user?.aboutMe || user?.about ? (
                        <p className="text-gray-700 leading-relaxed">{user?.aboutMe || user?.about}</p>
                    ) : (
                        <p className="text-gray-400 italic">No bio Available</p>
                    )}
                </div>
            </div>

            {/* Basic Info */}
            <div className="mb-10">
                <h3 className="text-lg font-bold text-[#333333] mb-4">Basic Information</h3>
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                        {infoItem('Full Name', displayName)}
                        {infoItem('Email', user?.email)}
                        {infoItem('Gender', user?.gender)}
                        {infoItem('Professional Title', user?.professionalTitle)}
                        {infoItem('Preferred Group', user?.preferredGroup || user?.preferedGroup)}
                        {infoItem('Phone', user?.contactNumber || user?.mobileNumber)}
                        {infoItem('LinkedIn', user?.linkedInProfile)}
                        {infoItem('GitHub', user?.githubProfile)}
                        {infoItem('address', user?.address)}
                    </div>
                </div>
            </div>
        </div>
    );
}
