import { Modal, Tag } from 'antd';
import { X } from 'lucide-react';

interface ClassScheduleDetailsModalProps {
    open: boolean;
    onCancel: () => void;
    data: any;
}

const ClassScheduleDetailsModal = ({ open, onCancel, data }: ClassScheduleDetailsModalProps) => {
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
                            <td className="px-5 py-3.5 text-gray-800 font-medium">{data?.title || 'Java Script'}</td>
                        </tr>
                        <tr>
                            <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">Description</td>
                            <td className="px-5 py-3.5 text-gray-800">
                                {data?.description || 'This is for beginners'}
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
                        <tr>
                            <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">Target Track</td>
                            <td className="px-5 py-3.5 text-gray-800">{data?.userGroupTrack?.name || 'Data'}</td>
                        </tr>
                        <tr>
                            <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">Date</td>
                            <td className="px-5 py-3.5 text-gray-800">{data?.date || '12 OCT, 2025'}</td>
                        </tr>
                        <tr>
                            <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">Time</td>
                            <td className="px-5 py-3.5 text-gray-800">{data?.time || '12:00 AM'}</td>
                        </tr>
                        <tr>
                            <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">Location</td>
                            <td className="px-5 py-3.5 text-gray-800">{data?.location || '12 Street, USA'}</td>
                        </tr>
                        <tr>
                            <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">Status</td>
                            <td className="px-5 py-3.5">
                                <span className="px-3 py-1 bg-green-50 text-green-500 rounded-full text-xs font-semibold">
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

export default ClassScheduleDetailsModal;
