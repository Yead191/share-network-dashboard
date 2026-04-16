import { Modal, Tag } from 'antd';
import moment from 'moment';
import { Calendar, Clock, MapPin, User, X, BookOpen, ExternalLink, Download } from 'lucide-react';
import { getImageUrl } from '../../../../utils/getImageUrl';
export default function ScheduleModal({ isModalOpen, setIsModalOpen, selectedSchedule }: { isModalOpen: boolean, setIsModalOpen: (open: boolean) => void, selectedSchedule: any }) {
    return (
        <Modal
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            closeIcon={null}
            centered
            width={500}
            styles={{
                content: {
                    padding: 0,
                    borderRadius: '20px',
                    overflow: 'hidden'
                }
            }}
        >
            <div className="relative p-6 pt-10">
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all z-10"
                >
                    <X size={18} />
                </button>

                {/* Header with Title and Date */}
                <div className="mb-6">
                    <Tag color={selectedSchedule?.virtualClass ? 'green' : 'blue'} className="mb-3 rounded-full border-none px-3 py-0.5 font-bold text-[10px] uppercase">
                        {selectedSchedule?.virtualClass ? 'Virtual Class' : 'On-Site Class'}
                    </Tag>
                    <h2 className="text-2xl font-black text-gray-800 leading-tight mb-2">
                        {selectedSchedule?.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-blue-500" />
                            {moment(selectedSchedule?.classDate).format('MMMM DD, YYYY')}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-blue-500" />
                            {moment(selectedSchedule?.classDate).format('hh:mm A')}
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-6">
                    {/* Description */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen size={16} className="text-gray-400" />
                            <h4 className="text-sm font-bold text-gray-700">Course Content</h4>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed bg-blue-50/30 p-4 rounded-xl border border-blue-50/50">
                            {selectedSchedule?.description}
                        </p>
                    </div>

                    {/* Location / Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <MapPin size={14} className="text-gray-400" />
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</h4>
                                </div>
                                <p className="text-sm text-gray-800 font-semibold pl-6">
                                    {selectedSchedule?.virtualClass ? 'Online / Zoom' : selectedSchedule?.location}
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <User size={14} className="text-gray-400" />
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Target Track</h4>
                                </div>
                                <p className="text-sm text-gray-800 font-semibold pl-6">
                                    {selectedSchedule?.userGroupTrack?.name || 'Full Stack'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Tag className="text-gray-400" />
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Group</h4>
                                </div>
                                <div className="flex flex-wrap gap-1 pl-6">
                                    {selectedSchedule?.userGroup?.map((group: any) => (
                                        <Tag key={group._id} className="m-0 rounded-full border-none bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0">
                                            {group.name}
                                        </Tag>
                                    )) || <span className="text-sm text-gray-400">N/A</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Learning Materials */}
                {(selectedSchedule?.slideUrl || selectedSchedule?.file) && (
                    <div className="pt-2">
                        <div className="flex items-center gap-2 mb-3">
                            <h4 className="text-sm font-bold text-gray-700">Learning Materials</h4>
                        </div>
                        <div className="flex flex-col gap-2">
                            {selectedSchedule?.slideUrl && (
                                <a
                                    href={selectedSchedule.slideUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-100/50 hover:bg-blue-50 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                            <ExternalLink size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-700">Slide / Slide Deck</p>
                                            <p className="text-[10px] text-gray-500">Click to visit slide</p>
                                        </div>
                                    </div>
                                    <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ExternalLink size={14} />
                                    </div>
                                </a>
                            )}
                            {selectedSchedule?.file && (
                                <a
                                    href={getImageUrl(selectedSchedule.file)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/50 hover:bg-indigo-50 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                            <Download size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-700">Lecture Material</p>
                                            <p className="text-[10px] text-gray-500">Click to download file</p>
                                        </div>
                                    </div>
                                    <div className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Download size={14} />
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    )
}
