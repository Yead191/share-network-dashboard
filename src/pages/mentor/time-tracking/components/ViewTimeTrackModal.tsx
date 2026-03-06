import { Modal } from 'antd';
import dayjs from 'dayjs';

interface ViewTimeTrackModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

const ViewTimeTrackModal = ({ isOpen, onClose, data }: ViewTimeTrackModalProps) => {
    if (!data) return null;

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            title={
                <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                    View Time Track
                </div>
            }
            width={600}
            centered
        >
            <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500 font-semibold mb-1">Student</p>
                        <p className="text-gray-800 font-medium">
                            {data.studentId ? `${data.studentId.firstName} ${data.studentId.lastName}` : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-semibold mb-1">Session Type</p>
                        <p className="text-gray-800 font-medium">{data.timeType}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-semibold mb-1">Start Time</p>
                        <p className="text-gray-800 font-medium">
                            {dayjs(data.startTime).format('MMM DD, YYYY hh:mm A')}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-semibold mb-1">End Time</p>
                        <p className="text-gray-800 font-medium">
                            {dayjs(data.endTime).format('MMM DD, YYYY hh:mm A')}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-semibold mb-1">Spent Hours</p>
                        <p className="text-gray-800 font-medium">{data.spentHours} hrs</p>
                    </div>
                </div>
                <div className="mt-2">
                    <p className="text-sm text-gray-500 font-semibold mb-2">Comments</p>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-gray-700 whitespace-pre-wrap">{data.comments || 'No comments provided.'}</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ViewTimeTrackModal;
