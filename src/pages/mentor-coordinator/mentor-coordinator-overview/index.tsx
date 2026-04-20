import StatsCards from './components/StatsCards';
import MentorsTable from './components/MentorsTable';
import StudentDetails from './components/StudentDetails';
import RecentActivity from './components/RecentActivity';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';
import Spinner from '../../../components/shared/Spinner';

const MentorCoordinatorOverview = () => {
    const { data, isLoading } = useProfileQuery({});
    if (isLoading) {
        return <Spinner />
    }
    const mentors = data?.data?.assignedMentors || [];
    return (
        <div className="">
            <StatsCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <MentorsTable data={mentors} />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <StudentDetails />
                    <RecentActivity />
                </div>
            </div>
        </div>
    );
};

export default MentorCoordinatorOverview;