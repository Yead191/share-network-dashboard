import { Modal } from 'antd';

import dayjs from 'dayjs';

interface EventDetailsModalProps {
    isOpen: boolean;
    onCancel: () => void;
    event: any | null;
}

export const EventDetailsModal = ({ isOpen, onCancel, event }: EventDetailsModalProps) => {
    if (!event) return null;


    return (
        <Modal
            open={isOpen}
            title={null}
            onCancel={onCancel}
            footer={null}
            width={650}
            centered
            className="event-details-modal overflow-hidden [&>.ant-modal-content]:p-0 [&>.ant-modal-content]:rounded-[12px]"
        >
            <div className="bg-white p-8">
                <h2 className="text-2xl font-bold text-[#1E293B] mb-2">Event Details</h2>
                <div className="h-[1px] bg-gray-100 mb-6" />


                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Title</h3>
                    <p className="text-lg text-[#334155] font-medium">{event.title}</p>
                </div>

                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</h3>
                    <p className="text-[#64748B] text-base leading-relaxed">
                        {event.description}
                    </p>
                </div>

  <div className="grid grid-cols-2 gap-y-8 gap-x-4">
    {/* Event Date */}
    <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Event Date</h3>
        <div className="text-[#334155] text-base">
            {event.date ? dayjs(event.date).format('MM/DD/YYYY') : 'N/A'}
        </div>
    </div>

    <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Location</h3>
        <div className="text-[#334155] text-base">
            {event.location || 'N/A'}
        </div>
    </div>

    <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Type</h3>
        <div className="text-[#334155] capitalize text-base">
            {event.type}
        </div>
    </div>

    <div />


    <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Target Group</h3>
        <div className="text-[#334155] text-base">
            {event.targetGroup && event.targetGroup.name ? event.targetGroup.name : "All groups"}
        </div>
    </div>


    <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Target Track</h3>
        <div className="text-[#334155] text-base">
            {event.targetTrack && event.targetTrack.name ? event.targetTrack.name : "All tracks"}
        </div>
    </div>

    {/* <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Target User (Optional)</h3>
        <div className="text-[#334155] text-base">
            {event.studentAssigned && event.studentAssigned.length > 0 ? "Specific assigned users" : "All users"}
        </div>
    </div> */}
</div>
            </div>

            <style>{`
                .event-details-modal .ant-modal-close {
                    top: 24px;
                    right: 24px;
                }
                .event-details-modal .ant-modal-content {
                    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
                }
            `}</style>
        </Modal>
    );
};
