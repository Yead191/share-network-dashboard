import { Modal } from 'antd';
import moment from 'moment';
import { FileText, Calendar, Clock, AlertCircle } from 'lucide-react';

interface AssignmentDetailsModalProps {
    open: boolean;
    onCancel: () => void;
    data: any;
}

const AssignmentDetailsModal = ({ open, onCancel, data }: AssignmentDetailsModalProps) => {
    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-xl font-bold">Assignment Details</span>
                </div>
            }
            open={open}
            onCancel={onCancel}
            footer={null}
            width={600}
            className="rounded-2xl overflow-hidden"
            centered
        >
            {data && (
                <div className="space-y-6 pt-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">{data.title}</h2>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Added: {moment(data.createdAt || Date.now()).format('DD MMM YYYY')}</span>
                                </div>
                                <div className="flex items-center gap-1 text-red-500 font-medium">
                                    <Clock className="w-4 h-4" />
                                    <span>Due: {moment(data.dueDate).format('DD MMM YYYY')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 border border-amber-200">
                                <AlertCircle className="w-4 h-4" />
                                Pending
                            </span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {data.description}
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default AssignmentDetailsModal;
