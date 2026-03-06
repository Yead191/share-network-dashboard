import { Modal } from 'antd';
import moment from 'moment';
import { Calendar, Clock, MapPin, Users, Tag } from 'lucide-react';

interface EventDetailsModalProps {
    open: boolean;
    onCancel: () => void;
    data: any;
}

const EventDetailsModal = ({ open, onCancel, data }: EventDetailsModalProps) => {
    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-xl font-bold">Event Details</span>
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
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{data.title}</h2>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span className="font-medium text-gray-800">Date & Time:</span>
                                    <span>{moment(data.date).format('DD MMM YYYY, hh:mm A')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-red-500" />
                                    <span className="font-medium text-gray-800">Location:</span>
                                    <span>{data.location}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {data.type}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" /> Target Audience
                        </h3>
                        <div className="bg-white p-3 rounded-xl border border-gray-100 text-gray-600">
                            {data.targetGroup?.name || 'All Students'}
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

export default EventDetailsModal;
