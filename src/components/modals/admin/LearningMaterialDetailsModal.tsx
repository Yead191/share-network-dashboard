import { Modal } from 'antd';
import { X } from 'lucide-react';
import { imageUrl } from '../../../redux/api/baseApi';

interface LearningMaterialDetailsModalProps {
    open: boolean;
    onCancel: () => void;
    data: any;
}

const LearningMaterialDetailsModal = ({ open, onCancel, data }: LearningMaterialDetailsModalProps) => {
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
                <h2 className="text-xl font-bold text-gray-800">Learning Materials Details</h2>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="border border-gray-100 rounded-xl overflow-hidden mb-6 shadow-sm">
                <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-100">
                        <tr>
                            <td className="px-5 py-4 bg-gray-50/50 font-medium text-gray-500 w-1/3 text-[13px]">
                                Title
                            </td>
                            <td className="px-5 py-4 text-gray-800 font-medium text-[13px]">
                                {data?.title || 'Java Script'}
                            </td>
                        </tr>
                        <tr>
                            <td className="px-5 py-4 bg-gray-50/50 font-medium text-gray-500 text-[13px]">
                                Description
                            </td>
                            <td className="px-5 py-4 text-gray-800 text-[13px] leading-relaxed">
                                {data?.description || 'This is for beginners'}
                            </td>
                        </tr>
                        <tr>
                            <td className="px-5 py-4 bg-gray-50/50 font-medium text-gray-500 text-[13px] flex items-center gap-2">
                                Date
                            </td>
                            <td className="px-5 py-4 text-gray-800 text-[13px]">{data?.date || '12 Oct, 2025'}</td>
                        </tr>
                        <tr>
                            <td className="px-5 py-4 bg-gray-50/50 font-medium text-gray-500 text-[13px]">Location</td>
                            <td className="px-5 py-4 text-gray-800 text-[13px]">
                                {data?.location || '12 Street, USA'}
                            </td>
                        </tr>
                        <tr>
                            <td className="px-5 py-4 bg-gray-50/50 font-medium text-gray-500 text-[13px]">Type</td>
                            <td className="px-5 py-4 text-gray-800 text-[13px]">{data?.typeLabel || 'Link'}</td>
                        </tr>
                        <tr>
                            <td className="px-5 py-4 bg-gray-50/50 font-medium text-gray-500 text-[13px]">
                                Content URL
                            </td>
                            <td className="px-5 py-4 text-gray-400 text-[13px] italic">
                                {data?.url || 'https://example'}
                            </td>
                        </tr>
                    <tr>
                        <td className="px-5 py-4 bg-gray-50/50 font-medium text-gray-500 text-[13px]">
                            PDF
                        </td>
                        <td className="px-5 py-4 text-gray-800 text-[13px]">
                            {data?.pdf ? (
                                <a
                                    href={`${imageUrl}${data.pdf}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    View PDF
                                </a>
                            ) : (
                                'No PDF available'
                            )}
                        </td>
                    </tr>
                        <tr>
                            <td className="px-5 py-4 bg-gray-50/50 font-medium text-gray-500 text-[13px]">
                                Target Audience
                            </td>
                            <td className="px-5 py-4 text-gray-800 text-[13px]">{data?.targetAudience || 'All'}</td>
                        </tr>
                        <tr>
                            <td className="px-5 py-4 bg-gray-50/50 font-medium text-gray-500 text-[13px]">
                                Target Group
                            </td>
                            <td className="px-5 py-4 text-gray-800 text-[13px]">{data?.targetGroup || 'Full Stack'}</td>
                        </tr>
                        <tr>
                            <td className="px-5 py-4 bg-gray-50/50 font-medium text-gray-500 text-[13px]">Status</td>
                            <td className="px-5 py-4">
                                <span className="px-3 py-1 bg-green-50 text-green-500 rounded-full text-xs font-semibold">
                                    Active
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={onCancel}
                    className="px-8 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors text-sm shadow-sm"
                >
                    Cancel
                </button>
            </div>
        </Modal>
    );
};

export default LearningMaterialDetailsModal;
