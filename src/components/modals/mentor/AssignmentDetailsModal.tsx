import { Modal, Tag, Button, Avatar } from 'antd';
import moment from 'moment';
import { FileText, Calendar, Clock, AlertCircle, User, Trophy, Users, Download, X } from 'lucide-react';
import { imageUrl } from '../../../redux/api/baseApi';

interface AssignmentDetailsModalProps {
    open: boolean;
    onCancel: () => void;
    data: any;
}

const AssignmentDetailsModal = ({ open, onCancel, data }: AssignmentDetailsModalProps) => {
    if (!data) return null;

    const teacherProfile = data.teacher?.profile ? `${imageUrl}${data.teacher.profile}` : null;
    const attachmentUrl = data.attachment ? `${imageUrl}${data.attachment}` : null;
    const userGroups = data.userGroup || [];

    return (
        <Modal
            title={null}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={700}
            closeIcon={null}
            centered
            className="premium-modal"
            styles={{
                content: {
                    padding: 0,
                    borderRadius: '24px',
                    overflow: 'hidden',
                },
            }}
        >
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-emerald-600 to-teal-700 px-8 py-10 text-white">
                <button
                    onClick={onCancel}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <Tag className="bg-white/20 border-white/30 text-white font-semibold px-3 py-0.5 rounded-full uppercase text-[10px] tracking-wider">
                            Assignment
                        </Tag>
                        <Tag className="bg-amber-400/20 border-amber-400/30 text-amber-300 font-semibold px-3 py-0.5 rounded-full uppercase text-[10px] tracking-wider">
                            Pending
                        </Tag>
                    </div>
                    <h2 className="text-3xl font-bold leading-tight">{data.title}</h2>
                    <div className="flex flex-wrap gap-6 text-emerald-100 text-sm mt-2">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="opacity-70" />
                            <span>Added on {moment(data.createdAt || Date.now()).format('MMM DD, YYYY')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="opacity-70" />
                            <span className="font-semibold text-white">
                                Due: {moment(data.dueDate).format('MMM DD, YYYY')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="px-8 py-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Author & Group Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Teacher / Author */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <User size={14} />
                            ASSIGNED BY
                        </h3>
                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-3">
                            <Avatar
                                size={48}
                                src={teacherProfile}
                                className="border-2 border-white shadow-sm"
                                icon={<User />}
                            />
                            <div>
                                <p className="font-bold text-gray-800 leading-none">
                                    {data.teacher?.firstName} {data.teacher?.lastName}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{data.teacher?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Target Groups */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Users size={14} />
                            TARGET GROUPS
                        </h3>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {userGroups.length > 0 ? (
                                userGroups.map((group: any) => (
                                    <span
                                        key={group._id}
                                        className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold border border-emerald-100"
                                    >
                                        {group.name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400 text-sm italic">No specific group assigned</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Score / Points Section */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                            <Trophy size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Points</p>
                            <p className="text-2xl font-black text-gray-800">{data.totalPoint || 0} pts</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                        <div className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-lg border border-amber-100">
                            <AlertCircle size={14} />
                            Active
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Description</h3>
                    <div className="text-gray-600 leading-relaxed text-lg bg-white p-6 rounded-2xl border border-gray-100 shadow-sm whitespace-pre-wrap">
                        {data.description || 'No description provided for this assignment.'}
                    </div>
                </div>

                {/* Attachments Section */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Resources / Attachments
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {attachmentUrl ? (
                            <Button
                                type="primary"
                                href={attachmentUrl}
                                target="_blank"
                                icon={<Download size={18} />}
                                className="h-14 flex-1 flex items-center justify-center gap-3 rounded-2xl bg-teal-600 hover:!bg-teal-700 border-none shadow-lg shadow-teal-100 font-bold text-base transition-all hover:-translate-y-1 active:scale-95"
                            >
                                Download Attachment
                            </Button>
                        ) : (
                            <div className="w-full py-6 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <FileText size={24} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No downloadable attachments available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AssignmentDetailsModal;
