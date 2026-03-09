import { FaUsers, FaCalendarAlt, FaBookOpen } from 'react-icons/fa';
import { useGetOverViewTeacherQuery } from '../../../../redux/apiSlices/teacher/homeSlice';

const TeacherStats = () => {
  const { data, isLoading, isFetching } = useGetOverViewTeacherQuery();

  const newData = [
    {
      id: 1,
      title: 'My Students',
      count: data?.data.totalStudent ?? 0,
      icon: <FaUsers className="text-blue-500 text-2xl" />,
      bgColor: 'bg-blue-50',
    },
    {
      id: 2,
      title: 'Schedule Class',
      count: data?.data.totalClass ?? 0,
      icon: <FaCalendarAlt className="text-orange-500 text-2xl" />,
      bgColor: 'bg-orange-50',
    },
    {
      id: 3,
      title: 'Learning Material',
      count: data?.data.totalAssignment ?? 0,
      icon: <FaBookOpen className="text-purple-500 text-2xl" />,
      bgColor: 'bg-purple-50',
    },
  ];

  // 🔹 Skeleton UI
  if (isLoading || isFetching) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex items-center space-x-4 animate-pulse"
          >
            <div className="w-14 h-14 bg-gray-200 rounded-xl" />
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-16 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      {newData.map((stat) => (
        <div
          key={stat.id}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex items-center space-x-4 transition-all hover:shadow-md"
        >
          <div className={`p-4 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
            {stat.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 leading-none">
              {stat.count}
            </h2>
            <p className="text-gray-400 text-sm mt-1">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeacherStats;
