// components/WoopCard.tsx
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { Tooltip } from 'antd';
import { getImageUrl } from '../../../../utils/getImageUrl';

type WoopCardProps = {
    woop: any;
    onView: (woop: any) => void;
    onEdit?: (woop: any) => void;
    onDelete?: (id: string) => void;
    isDeleting?: boolean;
    readOnly?: boolean;
};

const WoopCard = ({ woop, onView, onEdit, onDelete, isDeleting, readOnly }: WoopCardProps) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7C3AED] to-purple-300" />

            <div className="flex justify-between items-start mb-6">
                <div className="flex -space-x-3">
                    {/* Mentor Avatar */}
                    <Tooltip title={`${woop?.mentorId?.firstName || ''} ${woop?.mentorId?.lastName || ''} (Mentor)`}>
                        <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-100 shadow-sm hover:scale-110 transition-transform">
                            <img
                                src={getImageUrl(woop?.mentorId?.profile) || 'https://ui-avatars.com/api/?name=Mentor&background=random'}
                                alt="Mentor"
                                className="w-full h-full object-cover"
                                onError={(e) => ((e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Mentor&background=random')}
                            />
                        </div>
                    </Tooltip>

                    {/* Student Avatar */}
                    <Tooltip title={`${woop?.studentId?.firstName || ''} ${woop?.studentId?.lastName || ''} (Student)`}>
                        <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-100 shadow-sm hover:scale-110 transition-transform">
                            <img
                                src={getImageUrl(woop?.studentId?.profile) || 'https://ui-avatars.com/api/?name=Student&background=random'}
                                alt="Student"
                                className="w-full h-full object-cover"
                                onError={(e) => ((e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Student&background=random')}
                            />
                        </div>
                    </Tooltip>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onView(woop)} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100" title="View">
                        <FiEye />
                    </button>
                    {!readOnly && onEdit && (
                        <button onClick={() => onEdit(woop)} className="w-8 h-8 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center hover:bg-purple-100" title="Edit">
                            <FiEdit2 />
                        </button>
                    )}
                    {!readOnly && onDelete && (
                        <button
                            onClick={() => onDelete(woop._id)}
                            disabled={isDeleting}
                            className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100"
                            title="Delete"
                        >
                            <FiTrash2 />
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4 flex-grow">
                <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100/50">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Wish</span>
                    <p className="text-gray-700 text-sm line-clamp-2">{woop.wish?.detail || 'Not specified'}</p>
                </div>
                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Outcome</span>
                    <p className="text-gray-700 text-sm line-clamp-2">{woop.outcome?.detail || 'Not specified'}</p>
                </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-medium text-gray-400">WOOP Card</span>
                <button onClick={() => onView(woop)} className="text-sm font-semibold text-[#7C3AED] hover:text-purple-800 flex items-center gap-1">
                    View Details <span aria-hidden="true">→</span>
                </button>
            </div>
        </div>
    );
};

export default WoopCard;