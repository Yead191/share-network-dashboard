import StudentProfile from './components/StudentProfile';
import CoreGoals from './components/CoreGoals';
import LearningMaterials from './components/LearningMaterials';
import UpcomingEvents from './components/UpcomingEvents';
import ActiveAssignments from './components/ActiveAssignments';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';
import {
    useGetActiveAssignmentsQuery,
    useGetStudentProfileQuery,
    useGetStudentUpcomingEventsQuery,
} from '../../../redux/apiSlices/mentor/studentApi';
import Spinner from '../../../components/shared/Spinner';
import { useGetMentorOverviewResourcesQuery } from '../../../redux/apiSlices/mentor/mentorOverviewApi';
import { UserX } from 'lucide-react';

const Students = () => {
    const { data: mentorProfile, isLoading: mentorLoading } = useProfileQuery({});
    const { data: studentProfile, isLoading: studentLoading } = useGetStudentProfileQuery(
        mentorProfile?.data?.assignedStudents[0]?._id,
    );
    const { data: resourcesData, isLoading: resourcesLoading } = useGetMentorOverviewResourcesQuery({
        targetedAudience: 'STUDENT',
        targertGroup: studentProfile?.data?.userGroup?.[0]?._id,
    });

    const resources = resourcesData?.data?.resources || [];
    const student = studentProfile?.data || {};
    const { data: activeAssignmentsData, isLoading: activeAssignmentsLoading } = useGetActiveAssignmentsQuery({
        userGroup: student?.userGroup?.[0]?._id,
    });
    const { data: studentUpcomingEventsData, isLoading: studentUpcomingEventsLoading } =
        useGetStudentUpcomingEventsQuery({
            targetGroup: student?.userGroup?.[0]?._id,
        });
    const activeAssignments = activeAssignmentsData?.data || [];
    const studentUpcomingEvents = studentUpcomingEventsData?.data?.data || [];

    if (
        mentorLoading ||
        studentLoading ||
        resourcesLoading ||
        activeAssignmentsLoading ||
        studentUpcomingEventsLoading
    ) {
        return <Spinner />;
    }
    if (!student?._id) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserX className="w-14 h-14 text-gray-300" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-lg">
                        📋
                    </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-700 mb-2">No Student Assigned Yet</h2>
                <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-8">
                    You haven't been assigned a student yet. Once a student is assigned to your profile, their details,
                    goals, materials, and assignments will appear here.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-5 max-w-sm w-full text-left">
                    <p className="text-blue-700 text-sm font-semibold mb-1">Need help?</p>
                    <p className="text-blue-500 text-xs leading-relaxed mb-4">
                        If you believe a student should already be assigned to you, please reach out to the admin team
                        for assistance.
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className="">
            <div className="mx-auto grid grid-cols-1 lg:grid-cols-7 gap-4 mb-5">
                <div className="lg:col-span-2">
                    <StudentProfile student={student} />
                </div>
                <div className="lg:col-span-5 h-full">
                    <CoreGoals goals={student?.Goals} />
                </div>
            </div>
            <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <LearningMaterials resources={resources} />

                <UpcomingEvents data={studentUpcomingEvents} />

                <ActiveAssignments data={activeAssignments} />
            </div>
        </div>
    );
};

export default Students;
