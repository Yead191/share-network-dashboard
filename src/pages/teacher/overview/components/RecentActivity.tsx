import { FaGraduationCap } from 'react-icons/fa';
import { useGetTeacherActivityQuery } from '../../../../redux/apiSlices/teacher/homeSlice';
import { MdAssignment } from 'react-icons/md';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';

const iconMap: Record<string, React.ReactNode> = {
    graduation: <FaGraduationCap className="text-purple-500 text-xl" />,
    assignment: <MdAssignment className="text-purple-500 text-xl" />,
    class: <LiaChalkboardTeacherSolid className="text-purple-500 text-xl" />
};

const RecentActivity = () => {
    const { data, isLoading, isFetching } = useGetTeacherActivityQuery({ page: 1, limit: 5 });

    const newData =
        data?.data.map((item) => ({
            id: item._id,
            title: item.title,
            subTitle: item.description,
            iconType: item.type.toLowerCase(),
            bgColor: "bg-purple-100",
            date: item.createdAt
        })) || [];

    return (
        <div className="">
            <h2 className="text-lg font-semibold text-gray-600 mb-2 font-heading">Recent Activity</h2>
            <div className="space-y-2">
                {isLoading || isFetching
                    ? Array.from({ length: 5 }).map((_, index) => <ActivitySkeleton key={index} />)
                    : newData.map((activity) => (
                          <div
                              key={activity.id}
                              className="flex items-center space-x-4 p-3 rounded-xl transition-all hover:bg-gray-50"
                          >
                              <div
                                  className={`p-3 rounded-lg ${activity.bgColor} flex items-center justify-center w-10 h-10`}
                              >
                                  {iconMap[activity.iconType] || null}
                              </div>
                              <div className="flex-1 flex justify-between items-center">
                                  <div>
                                      <h3 className="font-medium text-gray-800 text-sm">{activity.title}</h3>
                                      <p className="text-gray-400 text-xs mt-0.5">{activity.subTitle.split('.')[0]}..</p>
                                  </div>
                                  <div>
                                      <p className="text-gray-400 text-xs mt-0.5">
                                          {new Date(activity.date).toLocaleString()}
                                      </p>
                                  </div>
                              </div>
                          </div>
                      ))}
            </div>
        </div>
    );
};

export default RecentActivity;


const ActivitySkeleton = () => {
    return (
        <div className="flex items-center space-x-4 p-3 rounded-xl bg-gray-50 animate-pulse">
            <div className="p-3 rounded-lg bg-gray-200 flex items-center justify-center w-10 h-10"></div>
            <div className="flex-1 flex justify-between items-center">
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 mt-1"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
        </div>
    );
};