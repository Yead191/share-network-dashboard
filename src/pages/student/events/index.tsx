import { useState } from 'react';
import { LuClock, LuMapPin } from 'react-icons/lu';
import { EventDetailsModal } from '../../../components/modals/student/EventDetailsModal';
import { useGetEventStudentQuery } from '../../../redux/apiSlices/students/eventsSlice';
import Spinner from '../../../components/shared/Spinner';

export default function StudentEvents() {
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

    const { data, error, isLoading } = useGetEventStudentQuery(
        {},
        {
            refetchOnMountOrArgChange: true,
        },
    );

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = (event: any) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const events = data?.data?.data || [];

    return (
        <section className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event: any) => {
                    const dateObj = new Date(event.date);
                    const month = dateObj.toLocaleString('default', { month: 'short' });
                    const day = dateObj.getDate();
                    return (
                        <div
                            key={event._id}
                            onClick={() => handleViewDetails(event)}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-5 group"
                        >
                            {/* Date Box */}
                            <div
                                style={{ backgroundColor: '#3BB77E' }}
                                className="w-[80px] h-[80px] shrink-0 rounded-xl flex flex-col items-center justify-center text-white"
                            >
                                <span className="text-[14px] font-bold uppercase opacity-90">{month}</span>
                                <span className="text-[28px] font-bold leading-none">{day}</span>
                            </div>

                            {/* Event Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-[#1E293B] mb-2 group-hover:text-[#3BB77E] transition-colors truncate">
                                    {event.title}
                                </h3>

                                <div className="space-y-1.5 text-sm">
                                    <div className="flex items-center gap-2 text-[#64748B]">
                                        <LuClock className="text-[#8B5CF6] shrink-0" />
                                        <span className="truncate">{new Date(event.date).toLocaleTimeString()}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-[#64748B] font-medium">
                                        <LuMapPin className="text-[#F43F5E] shrink-0" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            <EventDetailsModal isOpen={isModalOpen} onCancel={() => setIsModalOpen(false)} event={selectedEvent} />

            {/* Loading */}
            {isLoading && <Spinner />}

            {/* Error */}
            {error && (
                <div className="text-center mt-6 text-red-500">Failed to load events. Please try again later.</div>
            )}
        </section>
    );
}
