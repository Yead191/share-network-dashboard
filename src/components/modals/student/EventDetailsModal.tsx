import { Modal } from 'antd';
import { LuCalendarDays, LuClock, LuMapPin } from 'react-icons/lu';
import { Event } from '../../../constants/student/events';
import { imageUrl } from '../../../redux/api/baseApi';


interface EventDetailsModalProps {
    isOpen: boolean;
    onCancel: () => void;
    event: Event | null;
}

export const EventDetailsModal = ({ isOpen, onCancel, event }: EventDetailsModalProps) => {
    if (!event) return null;
  

    return (
        <Modal
            open={isOpen}
            title={null}
            onCancel={onCancel}
            footer={null}
            width={700}
            centered
            className="event-details-modal overflow-hidden [&>.ant-modal-content]:p-0 [&>.ant-modal-content]:rounded-[24px]"
        >
            <div className="bg-white">
                
                        {/* <div className="h-[300px] w-full relative overflow-hidden rounded-tl-[24px] rounded-tr-[24px]">
                    <img
                        src={`${imageUrl}${event.image}`}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                </div> */}

                {/* Modal Content */}
                <div className="py-8">
                    <h2 className="text-[28px] font-bold text-[#1E293B] mb-6">{event.title}</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center gap-3 text-[#64748B]">
                            <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
                                <LuCalendarDays size={20} />
                            </div>
                            <span className="font-medium text-base">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#64748B]">
                            <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                                <LuClock size={20} />
                            </div>
                            <span className="font-medium text-base">
                                {event.startTime} - {event.endTime}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-[#64748B]">
                            <div className="w-10 h-10 rounded-full bg-[#F43F5E]/10 flex items-center justify-center text-[#F43F5E]">
                                <LuMapPin size={20} />
                            </div>
                            <span className="font-medium text-base">{event.location}</span>
                        </div>
                    </div>

                    <p className="text-[#64748B] text-lg leading-relaxed font-normal">{event.description}</p>
                </div>
            </div>

            <style>{`
                .event-details-modal .ant-modal-close {
                    background: white;
                    border-radius: 50%;
                    top: 20px;
                    right: 20px;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
            `}</style>
        </Modal>
    );
};
