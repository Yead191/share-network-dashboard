import { useState } from "react";
import { Tag } from "antd";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import moment from "moment";
import ScheduleModal from "./ScheduleModal";
import { UsergroupAddOutlined } from "@ant-design/icons";

const StudentSchedule = ({
  student,
  schedule,
}: {
  student: any;
  schedule: any;
}) => {
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scheduleData = schedule?.data || [];
  const handleOpenDetails = (item: any) => {
    setSelectedSchedule(item);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-emerald-500" />
          <h3 className="font-bold text-gray-800">Class Schedule</h3>
        </div>
        <div className="flex gap-2">
          {student.userGroup &&
            student.userGroup.length > 0 &&
            student.userGroup.map((group: any) => (
              <Tag key={group._id} icon={<UsergroupAddOutlined />} color="green">
                {group.name}
              </Tag>
            ))}
          <Tag
            color="green"
            className="m-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border-none bg-emerald-50 text-emerald-700"
          >
            {scheduleData.length} Classes
          </Tag>
        </div>
      </div>
      <div className="flex-1 max-h-[260px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {scheduleData.length > 0 ? (
          scheduleData.map((item: any) => (
            <div
              key={item._id}
              onClick={() => handleOpenDetails(item)}
              className="group flex gap-3 p-3 rounded-xl border border-gray-50 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all cursor-pointer"
            >
              {/* Date Badge */}
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-50 flex flex-col items-center justify-center border border-gray-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                <span className="text-xs font-bold text-gray-400 group-hover:text-emerald-500 leading-none mb-0.5">
                  {moment(item.classDate).format("MMM")}
                </span>
                <span className="text-lg font-black text-gray-700 group-hover:text-emerald-600 leading-none">
                  {moment(item.classDate).format("DD")}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-[13px] font-bold text-gray-800 truncate group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h4>
                  {((item.studentAssigned && item.studentAssigned.length > 0) ||
                    (item.studentId && item.studentId.length > 0)) && (
                    <span className="text-[9px] font-bold bg-purple-50 text-purple-600 border border-purple-100 rounded-full px-2 py-0.5 shrink-0">
                      Individual
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 text-nowrap">
                    <Clock size={10} />
                    <span>{moment(item.classDate).format("hh:mm A")}</span>
                  </div>
                  <span className="w-1 h-1 bg-gray-200 rounded-full" />
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 truncate">
                    {item.virtualClass ? (
                      <>
                        <Video size={10} className="text-green-500" />
                        <span className="text-green-600 font-medium">
                          Virtual
                        </span>
                      </>
                    ) : (
                      <>
                        <MapPin size={10} />
                        <span className="truncate">{item.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <Calendar size={20} className="text-gray-300" />
            </div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              No classes scheduled
            </p>
          </div>
        )}
      </div>

      {/* Schedule Detail Modal */}
      <ScheduleModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedSchedule={selectedSchedule}
      />
    </div>
  );
};

export default StudentSchedule;
