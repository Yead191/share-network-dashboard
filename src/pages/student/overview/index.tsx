import WelcomeBanner from './components/WelcomeBanner';
import MentorCard from './components/MentorCard';
import StatCard from './components/StatCard';
import EventCard from './components/EventCard';
import ActiveAssignmentCard from './components/ActiveAssignmentCard';
import { PiBookOpenTextLight, PiCalendarBlankLight, PiUsersLight, PiTargetLight } from 'react-icons/pi';
import HeaderTitle from '../../../components/shared/HeaderTitle';

import {
    useGetstudentOverviewQuery,
    useGetprofileQuery,
    useGetUpcomingSessionsQuery,
    useGetActiveAssignmentsQuery,
} from '../../../redux/apiSlices/students/overview.slice';
import Spinner from '../../../components/shared/Spinner';
import { EventDetailsModal } from '../../../components/modals/student/EventDetailsModal';
import { useState } from 'react';
import { getImageUrl } from '../../../utils/getImageUrl';

const StudentOverview = () => {
    const { data: overviewData, isLoading, error } = useGetstudentOverviewQuery(undefined);
    const { data: profileData } = useGetprofileQuery(undefined);
    const { data: eventsData } = useGetUpcomingSessionsQuery(undefined);
    const { data: assignmentsData } = useGetActiveAssignmentsQuery(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const studentName = profileData?.data?.firstName || profileData?.data?.name || 'Student';
    const userGroup = profileData?.data?.userGroup?.[0];
    const groupName = userGroup?.name || 'Skill Path';
    const groupDescription = userGroup?.description || 'Welcome to your coding journey!';
    const handleEventClick = (event: any) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <div className="p-10 text-center text-red-500">Failed to load data</div>;
    }

    const statsResponse = overviewData?.data;

    const stats = [
        {
            title: 'Assignments',
            count: statsResponse?.totalSubmittedAssignments ?? 0,
            icon: <PiBookOpenTextLight className="w-6 h-6 text-[#3BB77E]" />,
            iconBgColor: '#EBF9F1',
            link: '/student/assignment',
        },
        {
            title: 'Schedule',
            count: statsResponse?.totalClasses ?? 0,
            icon: <PiCalendarBlankLight className="w-6 h-6 text-[#84CC16]" />,
            iconBgColor: '#F7FEE7',
            link: '/student/schedule',
        },
        {
            title: 'Mentor',
            count: statsResponse?.totalMentors ?? 0,
            icon: <PiUsersLight className="w-6 h-6 text-[#F97316]" />,
            iconBgColor: '#FFF7ED',
            link: '/student/mentor',
        },
        {
            title: 'Goals',
            count: statsResponse?.totalWoops ?? 0,
            icon: <PiTargetLight className="w-6 h-6 text-[#8B5CF6]" />,
            iconBgColor: '#F5EEFB',
            link: '/student/goal',
        },
    ];

    const rawEvents = eventsData?.data?.data || eventsData?.data || [];

    const formattedEvents = Array.isArray(rawEvents)
        ? rawEvents.map((event: any) => ({
              ...event,
              id: event._id,
              title: event.title,
              date: event.date,
              color: '#3BB77E',
              month: new Date(event.date).toLocaleString('en-US', { month: 'short' }),
              day: new Date(event.date).getDate(),
              startTime: new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              endTime: 'End Time',
              location: event.location || 'Online',
          }))
        : [];
    const formattedAssignments =
        assignmentsData?.data?.map((a: any) => ({
            id: a._id,
            title: a.title,
            dueDate: new Date(a.dueDate).toLocaleDateString(),
            subject: 'COMPUTER',
            status: 'PENDING',
        })) || [];

    return (
        <section className="space-y-8 pb-10">
            <WelcomeBanner name={studentName} group={groupName} description={groupDescription} />

            <MentorCard
                mentor={{
                    profile: getImageUrl(profileData?.data?.mentorId?.profile),

                    firstName: profileData?.data?.mentorId?.firstName || '',
                    lastName: profileData?.data?.mentorId?.lastName || '',
                    name: profileData?.data?.mentorId?.firstName
                        ? `${profileData.data.mentorId.firstName} ${profileData.data.mentorId.lastName}`
                        : 'Mentor',
                    role: 'Mentor',
                    subtext: 'Guiding you towards success',
                    location: profileData?.data?.location || '',
                    specialization: profileData?.data?.specialization || '',
                    availability: profileData?.data?.availability || '',
                    email: profileData?.data?.mentorId?.email || '',
                }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats?.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div>
                <HeaderTitle title="Upcoming Events" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-3">
                    {formattedEvents.map((event: any) => (
                        <div key={event.id} onClick={() => handleEventClick(event)} className="cursor-pointer">
                            <EventCard event={event} />
                        </div>
                    ))}
                </div>

                <EventDetailsModal isOpen={isModalOpen} onCancel={() => setIsModalOpen(false)} event={selectedEvent} />
            </div>
            <div>
                <HeaderTitle title="Active Assignments" />
                <div className="space-y-4 pt-3">
                    {formattedAssignments.length > 0 ? (
                        formattedAssignments.map(
                            (assignment: any) =>
                                ['PENDING'].includes(assignment.status) && (
                                    <ActiveAssignmentCard key={assignment.id} assignment={assignment} />
                                ),
                        )
                    ) : (
                        <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-200 text-center text-[#888888]">
                            No active assignments at the moment.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default StudentOverview;
