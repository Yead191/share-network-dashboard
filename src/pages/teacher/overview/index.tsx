import TeacherStats from './components/TeacherStats';
import UpcomingClasses from './components/UpcomingClasses';
// import PendingReviews from './components/PendingReviews';
import RecentActivity from './components/RecentActivity';

function TeacherOverview() {
    return (
        <div className="">
            <TeacherStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="h-full">
                    <UpcomingClasses />
                </div>
                <div className="h-full bg-white  p-4 rounded-2xl shadow-sm border border-gray-50 ">
                    {/* <PendingReviews />  */}
                    <RecentActivity />
                </div>
            </div>

            <div>
                {/* <RecentActivity />  */}
            </div>
        </div>
    );
}

export default TeacherOverview;
