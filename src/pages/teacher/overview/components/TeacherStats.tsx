import { FaUsers, FaCalendarAlt, FaBookOpen, FaChartLine } from 'react-icons/fa';
import { teacherStatsData } from '../../../../constants/teacher-data';
import { useGetOverViewTeacherQuery } from '../../../../redux/apiSlices/teacher/homeSlice';
;

const iconMap: Record<string, React.ReactNode> = {
    users: <FaUsers className="text-blue-500 text-2xl" />,
    calendar: <FaCalendarAlt className="text-orange-500 text-2xl" />,
    book: <FaBookOpen className="text-purple-500 text-2xl" />,
    chart: <FaChartLine className="text-red-500 text-2xl" />,
};

const TeacherStats = () => {
  const { data, isLoading, isFetching } = useGetOverViewTeacherQuery();

  const newData = teacherStatsData.map((item) => {
    if (item.id === 1) {
      return { ...item, count: data?.data.totalStudent || 0 };
    } else if (item.id === 2) {
      return { ...item, count: data?.data.totalClass || 0 };
    } else if (item.id === 3) {
      return { ...item, count: data?.data.totalAssignment || 0 };
    }
    return item;
  });

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
            {iconMap[stat.iconType] || null}
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
