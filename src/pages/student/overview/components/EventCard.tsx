import { MapPin, Clock } from 'lucide-react';
import { Event } from '../../../../constants/student/events';

interface EventCardProps {
    event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 group hover:border-primary/20 transition-all duration-300 cursor-pointer">
            {/* Date Block */}
            <div
                className="w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: event.color || '#3BB77E' }}
            >
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">{event.month}</span>
                <span className="text-2xl font-bold leading-none mt-0.5">{event.day}</span>
            </div>

            {/* Event Info */}
            <div className="flex-1">
                <h3 className="text-[17px] font-bold text-[#1E1E1E] leading-tight group-hover:text-primary transition-colors">
                    {event.title}
                </h3>
                <div className="flex flex-col gap-1.5 mt-2">
                    <div className="flex items-center gap-2 text-[#888888] text-xs">
                        <Clock className="w-3.5 h-3.5 text-primary opacity-70" />
                        <span>{event.startTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#888888] text-xs">
                        <MapPin className="w-3.5 h-3.5 text-red-400 opacity-70" />
                        <span>{event.location}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EventCard;
