import { Modal, Avatar, Divider } from 'antd';
import { imageUrl } from '../../../redux/api/baseApi';
import { User, Mail, Phone, MapPin, BookOpen, Briefcase, Sparkles, Users, GraduationCap, Target } from 'lucide-react';

interface StudentProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: any;
}

const StudentProfileModal = ({ isOpen, onClose, student }: StudentProfileModalProps) => {
    if (!student) return null;
    console.log(student);
    const infoItems = [
        { icon: <Mail className="w-4 h-4 text-primary" />, label: 'Email', value: student.email },
        { icon: <Phone className="w-4 h-4 text-primary" />, label: 'Mobile', value: student.mobileNumber },
        { icon: <MapPin className="w-4 h-4 text-primary" />, label: 'Address', value: student.address },
        {
            icon: <Briefcase className="w-4 h-4 text-primary" />,
            label: 'Professional Title',
            value: student.professionalTitle,
        },
        { icon: <BookOpen className="w-4 h-4 text-primary" />, label: 'Read Books', value: student.readBooks },

        // ✅ New Fields
        {
            icon: <Sparkles className="w-4 h-4 text-primary" />,
            label: 'Motivation',
            value: student.motivationLearning,
        },
        {
            icon: <Users className="w-4 h-4 text-primary" />,
            label: 'Groups',
            value: student.userGroup?.map((group: any) => group.name).join(', ') || 'No groups joined',
        },
        {
            icon: <Target className="w-4 h-4 text-primary" />,
            label: 'Track',
            value: student?.userGroupTrack?.name || 'Not assigned',
        },
        {
            icon: <GraduationCap className="w-4 h-4 text-primary" />,
            label: 'Highest Education',
            value: student?.highestEducation,
        },
    ];
    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            title={<span className="text-xl font-bold text-gray-800">Student Profile</span>}
            width={600}
            centered
            className="student-profile-modal"
        >
            <div className="flex flex-col items-center py-4">
                <div className="relative mb-6">
                    <Avatar
                        src={imageUrl + student.profile}
                        size={120}
                        className="border-4 border-white shadow-lg object-cover"
                        icon={<User />}
                    />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {student.firstName} {student.lastName}
                </h2>
                <p className="text-primary font-medium px-4 py-1 bg-primary/10 rounded-full mb-6">
                    {student.role || 'STUDENT'}
                </p>

                <Divider className="my-0 mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full px-4">
                    {infoItems.map((item, index) => (
                        <div key={index} className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-gray-500">
                                {item.icon}
                                <span className="text-xs font-semibold uppercase tracking-wider">{item.label}</span>
                            </div>
                            <p className="text-gray-800 font-medium pl-6 break-words">{item.value || 'Not provided'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
};

export default StudentProfileModal;
