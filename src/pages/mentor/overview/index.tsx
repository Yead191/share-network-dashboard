import MentorOverviewHeader from './components/MentorOverviewHeader';
import MentorProfileCard from './components/MentorProfileCard';
import MentorStatsCards from './components/MentorStatsCards';
import StudentGoalsSnapshot from './components/StudentGoalsSnapshot';
import UpcomingEvents from './components/UpcomingEvents';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';
import Spinner from '../../../components/shared/Spinner';
import MentorOverviewResources from './components/MentorOverviewResources';

function MentorOverview() {
    const { data, isLoading } = useProfileQuery({});
    const mentor = data?.data?.data ?? data?.data ?? data;
    const snapshots = mentor?.assignedStudents;

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

            <UpcomingEvents />
        </div>
    );
}

export default MentorOverview;
