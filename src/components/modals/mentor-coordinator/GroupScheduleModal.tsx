import React from 'react';
import { Modal, Tag, Button, Divider } from 'antd';
import { X, Calendar, Clock, MapPin, Link, FileText, Layout, Info, Download } from 'lucide-react';
import { getImageUrl } from '../../../utils/getImageUrl';

interface GroupScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    schedule: any;
}

const GroupScheduleModal: React.FC<GroupScheduleModalProps> = ({ isOpen, onClose, schedule }) => {
    if (!schedule) return null;

    return (
        <Modal
            title={null}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={600}
            closeIcon={null}
            centered
            styles={{
                content: {
                    padding: '0',
                    borderRadius: '16px',
                    overflow: 'hidden',
                },
            }}
        >
            {/* Header */}
            <div className="bg-blue-600 p-6 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Calendar size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-0">Class Details</h2>
                        <p className="text-blue-100 text-xs mb-0 opacity-80">Reference ID: {schedule._id?.slice(-8).toUpperCase()}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="p-6">
                {/* Title and Description */}
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{schedule.title}</h3>
                    <p className="text-gray-500 leading-relaxed italic border-l-4 border-blue-100 pl-4">
                        {schedule.description || 'No description provided for this class.'}
                    </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <Clock size={16} className="text-blue-500" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-0">Date & Time</p>
                                <p className="text-sm font-semibold text-gray-700">{schedule.date} at {schedule.time}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <MapPin size={16} className="text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-0">Location</p>
                                <p className="text-sm font-semibold text-gray-700">{schedule.location || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <Layout size={16} className="text-purple-500" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-0">Target Group</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {Array.isArray(schedule.userGroup) ? (
                                        schedule.userGroup.map((g: any) => (
                                            <Tag key={g._id} color="purple" bordered={false} className="m-0 text-[10px] font-bold">
                                                {g.name}
                                            </Tag>
                                        ))
                                    ) : (
                                        <Tag color="purple" bordered={false} className="m-0 text-[10px] font-bold">
                                            {schedule.group || 'N/A'}
                                        </Tag>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <Info size={16} className="text-amber-500" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-0">Current Status</p>
                                <Tag color={schedule.status ? 'green' : 'default'} className="mt-1 font-bold">
                                    {schedule.status ? 'ACTIVE' : 'INACTIVE'}
                                </Tag>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider className="my-6" />

                {/* Materials Section */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
                        Class Materials
                    </h4>

                    <div className="grid grid-cols-1 gap-3">
                        {schedule.slideUrl ? (
                            <a
                                href={schedule.slideUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg group-hover:scale-110 transition-transform shadow-sm">
                                        <Link size={18} className="text-blue-600" />
                                    </div>
                                    <span className="font-bold text-blue-700">Presentation Slides</span>
                                </div>
                                <X size={14} className="text-blue-300 group-hover:text-blue-500 rotate-45" />
                            </a>
                        ) : (
                            <div className="flex items-center gap-3 p-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl grayscale opacity-60">
                                <Link size={18} className="text-gray-400" />
                                <span className="text-gray-500 text-sm">No slides provided</span>
                            </div>
                        )}

                        {schedule.file ? (
                            <a
                                href={getImageUrl(schedule.file)}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg group-hover:scale-110 transition-transform shadow-sm">
                                        <FileText size={18} className="text-indigo-600" />
                                    </div>
                                    <span className="font-bold text-indigo-700">Lecture Handouts</span>
                                </div>
                                <Download size={16} className="text-indigo-300 group-hover:text-indigo-500" />
                            </a>
                        ) : (
                            <div className="flex items-center gap-3 p-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl grayscale opacity-60">
                                <FileText size={18} className="text-gray-400" />
                                <span className="text-gray-500 text-sm">No handouts attached</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <Button
                        onClick={onClose}
                        className="px-8 h-12 rounded-xl font-bold bg-gray-800 text-white hover:!bg-gray-700 hover:!text-white border-none"
                    >
                        Close Details
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default GroupScheduleModal;
