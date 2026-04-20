import StatsCards from './components/StatsCards';
import StudentDetails from './components/StudentDetails';
import RecentActivity from './components/RecentActivity';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';
import Spinner from '../../../components/shared/Spinner';
import MentorTable from './components/MentorsTable';

const MentorCoordinatorOverview = () => {
    const { data, isLoading, refetch } = useProfileQuery({});
    if (isLoading) {
        return <Spinner />
    }
    const mentors = data?.data?.assignedMentors || [];
    const allStudents = mentors.reduce((acc: any[], mentor: any) => {
        if (mentor.assignedStudents) {
            return [...acc, ...mentor.assignedStudents];
        }
        return acc;
    }, []);

    return (
        <div className="">
            <StatsCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <MentorTable />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <StudentDetails students={allStudents} refetch={refetch} />
                    <RecentActivity />
                </div>
            </div>
        </div>
    );
};

export default MentorCoordinatorOverview;