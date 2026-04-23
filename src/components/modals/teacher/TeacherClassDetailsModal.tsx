import { Modal, Tag } from 'antd';
import { X } from 'lucide-react';
import { getImageUrl } from '../../../utils/getImageUrl';

interface TeacherClassDetailsModalProps {
    open: boolean;
    onCancel: () => void;
    data: any;
}

const TeacherClassDetailsModal = ({ open, onCancel, data }: TeacherClassDetailsModalProps) => {

    return (
        <Modal
            title={null}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={600}
            closeIcon={null}
            centered
            styles={{
                content: {
                    padding: '24px',
                    borderRadius: '16px',
                },
            }}
        >
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">Class Schedule Details</h2>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="border border-gray-100 rounded-xl overflow-hidden mb-6 shadow-sm">
                <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-100">
                        <tr>
                            <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600 w-1/3">Title</td>
                            <td className="px-5 py-3.5 text-gray-800 font-medium">{data?.title || '—'}</td>
                        </tr>
                        <tr>
                            <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">Description</td>
                            <td className="px-5 py-3.5 text-gray-800">
                                {data?.description || '—'}
                            </td>
                        </tr>
                        <tr>
                            <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">Target Group</td>
                            <td className="px-5 py-3.5 flex items-center gap-2">
                                <span className="text-gray-800">
                                    {data?.userGroup?.length > 0
                                        ? data?.userGroup?.map((group: any) => (
                                            <Tag key={group._id} color="blue">
                                                {group.name}
                                            </Tag>
                                        ))
                                        : 'No Group'}
                                </span>
                            </td>
                        </tr>
                        {data?.userGroupTrack && (
                            <tr>
                                <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">Target Track</td>
                                <td className="px-5 py-3.5 text-gray-800">{data?.userGroupTrack?.name || '—'}</td>
                            </tr>
                        )}
                        <tr>
                            <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">Date</td>
                            <td className="px-5 py-3.5 text-gray-800">{data?.date || '—'}</td>
                        </tr>
                        <tr>
                            <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">Time</td>
                            <td className="px-5 py-3.5 text-gray-800">{data?.time || '—'}</td>
                        </tr>
                        <tr>
                            <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">Location</td>
                            <td className="px-5 py-3.5 text-gray-800">{data?.virtualClass ? 'Virtual Class' : (data?.location || '—')}</td>
                        </tr>
                        <tr>
                            <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">Slide / Content URL</td>
                            <td className="px-5 py-3.5 text-gray-800">
                                {data?.slideUrl ? (
                                    <a href={data?.slideUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 hover:underline">
                                        View Link
                                    </a>
                                ) : (
                                    <span className="text-gray-400">Not provided</span>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">Lecture Material</td>
                            <td className="px-5 py-3.5 text-gray-800">
                                {data?.file ? (
                                    <a href={getImageUrl(data?.file)} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 hover:underline">
                                        View / Download
                                    </a>
                                ) : (
                                    <span className="text-gray-400">Not provided</span>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">Status</td>
                            <td className="px-5 py-3.5">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${data?.status === 'Active' ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-500'}`}>
                                    {data?.status || 'Active'}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Modal>
    );
};

export default TeacherClassDetailsModal;
