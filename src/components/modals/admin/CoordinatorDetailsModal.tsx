import React from 'react';
import { Modal, Avatar, Divider, Tag } from 'antd';
import { X, Mail, Phone, MapPin, Building, GraduationCap, Link as LinkIcon, User } from 'lucide-react';
import dayjs from 'dayjs';
import { getImageUrl } from '../../../utils/getImageUrl';

interface CoordinatorDetailsModalProps {
    open: boolean;
    onCancel: () => void;
    coordinator: any | null;
}

const CoordinatorDetailsModal: React.FC<CoordinatorDetailsModalProps> = ({ open, onCancel, coordinator }) => {
    if (!coordinator) return null;

    const assignedMentors = coordinator.assignedMentors || [];
    const statusColor = coordinator.status === 'ACTIVE' || coordinator.status === 'Active' ? '#f6ffed' : '#fff7e6';
    const statusTextColor = coordinator.status === 'ACTIVE' || coordinator.status === 'Active' ? '#52c41a' : '#faad14';

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            closeIcon={null}
            width={700}
            className="custom-modal"
            centered
        >
            {/* Header Section */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4 items-center">
                    <Avatar
                        src={getImageUrl(coordinator.profile)}
                        size={80}
                        icon={<User className="text-gray-400 mt-2" size={40} />}
                        className="border-2 border-gray-100 bg-gray-50 flex items-center justify-center"
                    />
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                            {coordinator.firstName} {coordinator.lastName}
                            <Tag
                                className="rounded-full px-3 py-0.5 border-none font-medium text-sm m-0"
                                style={{ backgroundColor: statusColor, color: statusTextColor }}
                            >
                                {coordinator.status}
                            </Tag>
                        </h2>
                        <p className="text-gray-500 font-medium">{coordinator.professionalTitle || 'Coordinator'}</p>
                    </div>
                </div>
                <button
                    onClick={onCancel}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                >
                    <X size={20} />
                </button>
            </div>

            <Divider className="my-4" />

            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                {/* Contact Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">
                        Contact Information
                    </h3>
                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                            <Mail size={16} />
                        </div>
                        <span className="font-medium">{coordinator.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                            <Phone size={16} />
                        </div>
                        <span className="font-medium">{coordinator.contactNumber || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                            <MapPin size={16} />
                        </div>
                        <span className="font-medium">{coordinator.location || 'N/A'}</span>
                    </div>
                </div>

                {/* Professional Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">
                        Professional Details
                    </h3>
                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                            <GraduationCap size={16} />
                        </div>
                        <span className="font-medium">{coordinator.highestEducation || 'N/A'}</span>
                    </div>
                    {coordinator.linkedInProfile && (
                        <div className="flex items-center gap-3 text-gray-600">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                                <LinkIcon size={16} />
                            </div>
                            <a
                                href={coordinator.linkedInProfile}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-blue-500 hover:underline"
                            >
                                LinkedIn Profile
                            </a>
                        </div>
                    )}
                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                            <Building size={16} />
                        </div>
                        <span className="font-medium">
                            Joined: {dayjs(coordinator.createdAt).format('MMMM D, YYYY')}
                        </span>
                    </div>
                </div>
            </div>

            <Divider className="my-6" />

            {/* Assigned Mentors Section */}
            <div>
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
                    Assigned Mentors ({assignedMentors.length})
                </h3>

                {assignedMentors.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                        {assignedMentors.map((mentor: any) => (
                            <div
                                key={mentor._id}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                            >
                                <Avatar src={getImageUrl(mentor.profile)} icon={<User size={14} />} />
                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        {mentor.firstName} {mentor.lastName}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500 italic text-sm border border-gray-100">
                        No mentors assigned to this coordinator yet.
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default CoordinatorDetailsModal;
