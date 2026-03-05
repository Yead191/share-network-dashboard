import { useState } from 'react';
import { Card, Empty } from 'antd';
import { Clock } from 'lucide-react';
import moment from 'moment';
import EventDetailsModal from '../../../../components/modals/mentor/EventDetailsModal';

interface UpcomingEventsProps {
    data: any[];
}

const UpcomingEvents = ({ data }: UpcomingEventsProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const handleOpenModal = (event: any) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    return (
        <Card
            className="shadow-sm border-none rounded-2xl overflow-hidden"
            title={<span className="text-xl font-bold">Upcoming Events</span>}
        >
            <div className="space-y-4">
                {data?.length === 0 ? (
                    <Empty description="No upcoming events" />
                ) : (
                    data.map((event, idx) => {
                        const eventDate = moment(event.date);
                        return (
                            <div
                                key={idx}
                                onClick={() => handleOpenModal(event)}
                                className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                            >
                                <div
                                    className={`flex-shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center ${idx === 0 ? 'bg-purple-600' : idx === 1 ? 'bg-emerald-500' : 'bg-blue-600'} text-white`}
                                >
                                    <span className="text-[10px] font-bold uppercase leading-none">
                                        {eventDate.format('MMM')}
                                    </span>
                                    <span className="text-xl font-black leading-none">{eventDate.format('DD')}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-gray-800 text-sm truncate pr-2">{event.title}</h4>
                                        <span className="text-purple-600 text-[10px] font-bold uppercase flex-shrink-0">
                                            {event.type}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center text-gray-400 text-[11px] font-medium">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {eventDate.format('hh:mm A')}
                                        </div>
                                        <div className="text-gray-400 text-[11px] font-medium truncate">
                                            {event.location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <EventDetailsModal open={isModalOpen} onCancel={() => setIsModalOpen(false)} data={selectedEvent} />
        </Card>
    );
};

export default UpcomingEvents;
