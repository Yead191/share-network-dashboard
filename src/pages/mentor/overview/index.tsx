import MentorOverviewHeader from './components/MentorOverviewHeader';
import MentorProfileCard from './components/MentorProfileCard';
import MentorStatsCards from './components/MentorStatsCards';
import StudentGoalsSnapshot from './components/StudentGoalsSnapshot';
import WOOPGoals from './components/WOOPGoals';
import UpcomingEvents from './components/UpcomingEvents';
import { useProfileQuery } from '../../../redux/apiSlices/authSlice';
import Spinner from '../../../components/shared/Spinner';

function MentorOverview() {
    const { data, isLoading } = useProfileQuery({});
    const mentor = data?.data?.data ?? data?.data ?? data;
    console.log(mentor);
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
                <WOOPGoals />
            </div>

            <UpcomingEvents />
        </div>
    );
}

export default MentorOverview;
