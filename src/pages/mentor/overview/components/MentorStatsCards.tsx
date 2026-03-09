import { Card, Progress } from 'antd';
import { Users, Target } from 'lucide-react';
import { useGetMentorOverviewQuery } from '../../../../redux/apiSlices/mentor/mentorOverviewApi';

const MentorStatsCards = () => {
    const { data } = useGetMentorOverviewQuery(undefined);
    const mentorData = data?.data || [];
    // console.log(mentorData);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Assigned Students */}
            <Card className="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-400 text-sm font-medium mb-1">Assigned Students</p>
                        <h3 className="text-3xl font-bold text-gray-800">{mentorData?.assignedStudents?.length}</h3>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-500">
                        <Users size={24} />
                    </div>
                </div>
            </Card>

            {/* Weekly Goal */}
            <Card className="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-gray-400 text-sm font-medium">Weekly Goal</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg text-green-500">
                        <Target size={24} />
                    </div>
                </div>
                <div className="mt-4">
                    <Progress
                        percent={mentorData?.totalHours ? Math.min(Math.round((mentorData.totalHours / 10) * 100), 100) : 0}
                        showInfo={false}
                        strokeColor="#7c3aed"
                        trailColor="#f3f4f6"
                        strokeWidth={12}
                    />
                    <p className="text-[10px] text-gray-400 mt-1 text-center font-medium">{mentorData?.totalHours?.toFixed(1) || 0}/10 Hours Mentored</p>
                </div>
            </Card>

            {/* Next Session */}
            {/* <Card className="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-400 text-sm font-medium mb-1">Next Session</p>
                        <h3 className="text-2xl font-bold text-gray-800">Today, 4:00 PM</h3>
                    </div>
                    <div className="bg-orange-50 p-2 rounded-lg text-orange-500">
                        <Calendar size={24} />
                    </div>
                </div>
            </Card> */}
        </div>
    );
};

export default MentorStatsCards;
