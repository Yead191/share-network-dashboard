import MentorOverviewHeader from './components/MentorOverviewHeader';
import MentorProfileCard from './components/MentorProfileCard';
import MentorStatsCards from './components/MentorStatsCards';
import StudentGoalsSnapshot from './components/StudentGoalsSnapshot';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';
import Spinner from '../../../components/shared/Spinner';
import MentorOverviewResources from './components/MentorOverviewResources';
import HeaderTitle from '../../../components/shared/HeaderTitle';
import EventCard from '../../student/overview/components/EventCard';
import { useGetUpcomingSessionsQuery } from '../../../redux/apiSlices/students/overview.slice';
import { EventDetailsModal } from '../../../components/modals/student/EventDetailsModal';
import { useState } from 'react';

function MentorOverview() {
    const { data, isLoading } = useProfileQuery({});
    const mentor = data?.data?.data ?? data?.data ?? data;
    const { data: eventsData } = useGetUpcomingSessionsQuery(undefined);
    const snapshots = mentor?.assignedStudents;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
const handleEventClick = (event: any) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };
const rawEvents = eventsData?.data?.data || eventsData?.data || [];

const formattedEvents = Array.isArray(rawEvents) ? rawEvents.map((event: any) => ({
    ...event,
    id: event._id,
    title: event.title,
    date: event.date,
    color: '#3BB77E',
    month: new Date(event.date).toLocaleString('en-US', { month: 'short' }),
    day: new Date(event.date).getDate(),
    startTime: new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    endTime: "End Time",
    location: event.location || 'Online',
})) : [];
    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="">
            <MentorOverviewHeader />
            <MentorProfileCard mentor={mentor} />
            <MentorStatsCards />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <StudentGoalsSnapshot snapshots={snapshots} />
                <MentorOverviewResources />
            </div>

            <div>
                <HeaderTitle title="Upcoming Events" />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-3">
                    {formattedEvents.map((event: any) => (
                        <div 
                            key={event.id} 
                            onClick={() => handleEventClick(event)} 
                            className="cursor-pointer"
                        >
                            <EventCard event={event} />
                        </div>
                    ))}
                
                <EventDetailsModal isOpen={isModalOpen} onCancel={() => setIsModalOpen(false)} event={selectedEvent} />
                </div>
            </div>
        </div>
        
    );
}

export default MentorOverview;
