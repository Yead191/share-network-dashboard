import StudentProfile from './components/StudentProfile';
import CoreGoals from './components/CoreGoals';
import CurriculumOverview from './components/CurriculumOverview';
import LearningMaterials from './components/LearningMaterials';
import UpcomingEvents from './components/UpcomingEvents';
import ActiveAssignments from './components/ActiveAssignments';
import { curriculum } from '../../../constants/mentor-data';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';
import {
    useGetActiveAssignmentsQuery,
    useGetStudentProfileQuery,
    useGetStudentUpcomingEventsQuery,
} from '../../../redux/apiSlices/mentor/studentApi';
import Spinner from '../../../components/shared/Spinner';
import { useGetMentorOverviewResourcesQuery } from '../../../redux/apiSlices/mentor/mentorOverviewApi';

const Students = () => {
    const { data: mentorProfile, isLoading: mentorLoading } = useProfileQuery({});
    const { data: studentProfile, isLoading: studentLoading } = useGetStudentProfileQuery(
        mentorProfile?.data?.assignedStudents[0]?._id,
    );
    const { data: resourcesData, isLoading: resourcesLoading } = useGetMentorOverviewResourcesQuery({
        targetedAudience: 'STUDENT',
    });

    const resources = resourcesData?.data?.resources || [];
    const student = studentProfile?.data || {};
    const { data: activeAssignmentsData, isLoading: activeAssignmentsLoading } = useGetActiveAssignmentsQuery({
        userGroup: student?.userGroup?.[0],
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
