import { useState } from 'react';
import { LuClock3, LuMapPin, LuVideo, LuX, LuDownload, LuExternalLink, LuUsers, LuCalendar } from 'react-icons/lu';

import { useGetTeacherClassesQuery } from '../../../../redux/apiSlices/teacher/homeSlice';
import { useGetprofileQuery } from '../../../../redux/apiSlices/students/overview.slice';
import { getImageUrl } from '../../../../utils/getImageUrl';



const UpcomingClasses = () => {
    const [selectedClass, setSelectedClass] = useState<any | null>(null);

    const { data: profile } = useGetprofileQuery({});
    const { data, isLoading, isFetching } = useGetTeacherClassesQuery({
        page: 1,
        limit: 10,
        filterType: 'upcoming',
        userGroup: profile?.data?.userGroup?.[0]?._id,
        ...(profile?.data?.userGroupTrack?._id && {
            userGroupTrack: profile?.data?.userGroupTrack?._id,
        }),
    });

    const classes: any[] = data?.data || [];

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

    const formatTime = (dateStr: string) =>
        new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const getFileName = (filePath: string) => filePath?.split('/').pop() || 'Download File';

    return (
        <>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 h-full max-h-[610px] overflow-y-auto ">
                <h2 className="text-lg font-semibold text-gray-600 mb-4 font-heading">Upcoming Class</h2>

                <div className="space-y-4">
                    {isLoading || isFetching
                        ? Array.from({ length: 3 }).map((_, i) => <ClassSkeleton key={i} />)
                        : classes.map((item, index) => (
                            <div
                                key={item._id}
                                onClick={() => setSelectedClass(item)}
                                className={`p-5 rounded-2xl border border-gray-100 transition-all cursor-pointer hover:border-green-200 hover:shadow-md hover:-translate-y-0.5 ${index % 2 === 1 ? 'bg-[#0048FF05]' : 'bg-[#00FF5505]'
                                    }`}
                            >
                                {/* Title + Tags */}
                                <div className="flex justify-between items-start mb-3 gap-2">
                                    <h3 className="font-medium text-gray-800 text-[15px] leading-snug line-clamp-1">
                                        {item.title}
                                    </h3>
                                    <div className="flex gap-1.5 flex-shrink-0 flex-wrap justify-end">
                                        {item.userGroup.map((tag: any) => (
                                            <span
                                                key={tag._id}
                                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${tag.name === 'Skill Path'
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-blue-100 text-blue-600'
                                                    }`}
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                        {item.userGroupTrack && (
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-600 whitespace-nowrap">
                                                {item.userGroupTrack.name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Time + Location/Virtual */}
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center text-purple-500 font-medium gap-1.5">
                                        <LuClock3 />
                                        <span>{formatDate(item.classDate)}</span>
                                        <span className="text-gray-400 font-normal">·</span>
                                        <span>{formatTime(item.classDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                                        {item.virtualClass ? (
                                            <>
                                                <LuVideo className="text-blue-400" />
                                                <span>Virtual</span>
                                            </>
                                        ) : (
                                            <>
                                                <LuMapPin className="text-gray-400" />
                                                <span>{item.location}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Modal */}
            {selectedClass && (
                <ClassDetailModal
                    item={selectedClass}
                    onClose={() => setSelectedClass(null)}
                    formatDate={formatDate}
                    formatTime={formatTime}
                    getFileName={getFileName}
                />
            )}
        </>
    );
};

export default UpcomingClasses;

/* ─── Modal ─────────────────────────────────────────────── */
interface ModalProps {
    item: any;
    onClose: () => void;
    formatDate: (d: string) => string;
    formatTime: (d: string) => string;
    getFileName: (f: string) => string;
}

const ClassDetailModal = ({ item, onClose, formatDate, formatTime, getFileName }: ModalProps) => {
    const fileUrl = getImageUrl(item.file);
    const fileName = getFileName(item.file);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
                    <div className="flex-1 pr-3">
                        <h2 className="text-lg font-bold text-gray-800 leading-snug">{item.title}</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Class Details</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                    >
                        <LuX size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Description */}
                    {item.description && (
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
                        </div>
                    )}

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <InfoBlock icon={<LuCalendar className="text-purple-500" />} label="Date">
                            {formatDate(item.classDate)}
                        </InfoBlock>
                        <InfoBlock icon={<LuClock3 className="text-purple-500" />} label="Time">
                            {formatTime(item.classDate)}
                        </InfoBlock>
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-2 gap-4">
                        <InfoBlock
                            icon={item.virtualClass ? <LuVideo className="text-blue-500" /> : <LuMapPin className="text-red-400" />}
                            label={item.virtualClass ? 'Mode' : 'Location'}
                        >
                            {item.virtualClass ? 'Virtual Class' : item.location}
                        </InfoBlock>

                        {/* Track */}
                        {item.userGroupTrack && (
                            <InfoBlock icon={<LuUsers className="text-indigo-500" />} label="Track">
                                {item.userGroupTrack.name}
                            </InfoBlock>
                        )}
                    </div>

                    {/* Groups */}
                    {item.userGroup.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Groups</p>
                            <div className="flex flex-wrap gap-2">
                                {item.userGroup.map((g: any) => (
                                    <span
                                        key={g._id}
                                        className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-100"
                                    >
                                        {g.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                        {/* Download File */}
                        {item.file && (
                            <a
                                href={fileUrl}
                                download={fileName}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <LuDownload size={15} />
                                <span className="truncate max-w-[160px]" title={fileName}>
                                    {fileName}
                                </span>
                            </a>
                        )}

                        {/* Open Slide URL */}
                        {item.slideUrl && (
                            <a
                                href={item.slideUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <LuExternalLink size={15} />
                                Open Slide
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Info Block helper ──────────────────────────────────── */
const InfoBlock = ({
    icon,
    label,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}) => (
    <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-3">
        <span className="mt-0.5 flex-shrink-0">{icon}</span>
        <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-sm text-gray-700 font-medium mt-0.5">{children}</p>
        </div>
    </div>
);

/* ─── Skeleton ───────────────────────────────────────────── */
const ClassSkeleton = () => (
    <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50 animate-pulse">
        <div className="flex justify-between items-start mb-3">
            <div className="h-5 bg-gray-200 rounded w-40" />
            <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-full" />
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
            </div>
        </div>
        <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded-full" />
                <div className="h-4 bg-gray-200 rounded w-36" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
    </div>
);
