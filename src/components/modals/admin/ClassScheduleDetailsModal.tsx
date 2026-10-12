import { Modal, Tag, Avatar } from 'antd';
import {
    X,
    Calendar,
    Clock,
    MapPin,
    Video,
    BookOpen,
    ExternalLink,
    Download,
    Users,
    UserCheck,
    FileText,
} from 'lucide-react';
import { getImageUrl } from '../../../utils/getImageUrl';

interface ClassScheduleDetailsModalProps {
    open: boolean;
    onCancel: () => void;
    data: any;
}

const ClassScheduleDetailsModal = ({ open, onCancel, data }: ClassScheduleDetailsModalProps) => {
    const isVirtual = data?.virtualClass;
    const assignedStudents = data?.studentAssigned || data?.studentId || [];
    const hasStudents = Array.isArray(assignedStudents) && assignedStudents.length > 0;
    const hasGroup = Array.isArray(data?.userGroup) && data.userGroup.length > 0;

    return (
        <Modal
            title={null}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={620}
            closeIcon={null}
            centered
            styles={{
                content: {
                    padding: 0,
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                },
            }}
        >
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-7 py-6 text-white">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                    isVirtual
                                        ? 'bg-white/20 text-white border border-white/30'
                                        : 'bg-white/20 text-white'
                                }`}
                            >
                                {isVirtual ? 'Virtual Class' : 'In-Person Class'}
                            </span>
                            <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                    data?.status ? 'bg-white/25 text-white' : 'bg-red-400/20 text-red-200'
                                }`}
                            >
                                {data?.status ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-white leading-snug">
                            {data?.title || 'Class Schedule'}
                        </h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Modal Content */}
            <div className="p-7 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {/* Date & Time & Location Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                            <Calendar size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Date</p>
                            <p className="text-xs font-bold text-gray-800 truncate">{data?.date || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                            <Clock size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Time</p>
                            <p className="text-xs font-bold text-gray-800 truncate">{data?.time || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-green-50/60 border border-green-100 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                            {isVirtual ? <Video size={18} /> : <MapPin size={18} />}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-green-600">Location</p>
                            <p className="text-xs font-bold text-gray-800 truncate">
                                {data?.location || (isVirtual ? 'Virtual' : 'Campus')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                        <BookOpen size={14} className="text-emerald-500" />
                        Class Overview & Instructions
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 text-xs text-gray-700 leading-relaxed">
                        {data?.description || 'No description provided.'}
                    </div>
                </div>

                {/* Audience Targeting */}
                <div>
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                        <Users size={14} className="text-emerald-500" />
                        Target Audience
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3">
                        {/* Group / Track */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-gray-600">Cohort / Group:</span>
                            <div className="flex flex-wrap gap-1.5">
                                {hasGroup ? (
                                    data.userGroup.map((group: any) => (
                                        <Tag key={group._id} color="green" className="rounded-full font-semibold px-2.5">
                                            {group.name}
                                        </Tag>
                                    ))
                                ) : hasStudents ? (
                                    <Tag color="purple" className="rounded-full font-semibold px-2.5">
                                        Individual Student Schedule
                                    </Tag>
                                ) : (
                                    <Tag color="green" className="rounded-full font-semibold px-2.5">
                                        All Enrolled Students
                                    </Tag>
                                )}
                            </div>
                        </div>

                        {data?.userGroupTrack?.name && (
                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100/70">
                                <span className="text-xs font-semibold text-gray-600">Track:</span>
                                <Tag className="rounded-full bg-emerald-50 text-emerald-700 border-none px-2.5">
                                    {data.userGroupTrack.name}
                                </Tag>
                            </div>
                        )}

                        {/* Individual Students List */}
                        {hasStudents && (
                            <div className="pt-2 border-t border-gray-100/70 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                                        <UserCheck size={14} className="text-purple-600" />
                                        Assigned Individual Students:
                                    </span>
                                    <span className="text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                                        {assignedStudents.length} student{assignedStudents.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                                    {assignedStudents.map((st: any) => {
                                        const name =
                                            `${st?.firstName || ''} ${st?.lastName || ''}`.trim() ||
                                            st?.email ||
                                            st?._id ||
                                            'Student';
                                        return (
                                            <div
                                                key={st?._id || st}
                                                className="flex items-center justify-between p-2 rounded-xl bg-white border border-gray-100 text-xs"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Avatar size={24} className="bg-emerald-100 text-emerald-700 text-xs font-bold">
                                                        {name.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <span className="font-semibold text-gray-800">{name}</span>
                                                </div>
                                                {st?.email && (
                                                    <span className="text-[11px] text-gray-400">{st.email}</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Materials & Resources */}
                {(data?.slideUrl || data?.file) && (
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                            <FileText size={14} className="text-emerald-500" />
                            Class Materials & Resources
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {data?.slideUrl && (
                                <a
                                    href={data.slideUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/70 hover:bg-emerald-50 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                            <ExternalLink size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                                                Presentation Slides
                                            </p>
                                            <p className="text-[10px] text-gray-400">External link</p>
                                        </div>
                                    </div>
                                    <ExternalLink size={14} className="text-emerald-500 group-hover:text-emerald-600" />
                                </a>
                            )}

                            {data?.file && (
                                <a
                                    href={getImageUrl(data.file)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-100/70 hover:bg-teal-50 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                                            <Download size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
                                                Lecture Materials
                                            </p>
                                            <p className="text-[10px] text-gray-400">Click to view/download</p>
                                        </div>
                                    </div>
                                    <Download size={14} className="text-teal-500 group-hover:text-teal-600" />
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ClassScheduleDetailsModal;
