import { Input, Modal, Progress } from 'antd';
import { X } from 'lucide-react';
import moment from 'moment';

interface WeeklyReportDetailsModalProps {
    open: boolean;
    onCancel: () => void;
    data: any;
}

const WeeklyReportDetailsModal = ({ open, onCancel, data }: WeeklyReportDetailsModalProps) => {
    return (
        <Modal
            title={null}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={700}
            closeIcon={null}
            centered
            styles={{
                content: {
                    padding: '24px',
                    borderRadius: '16px',
                },
            }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Weekly Reporting Details</h2>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Weekly Report</h3>
                    <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600 w-1/3">
                                        Student Name
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-800 font-medium">
                                        {data?.studentName || 'N/A'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">Duration</td>
                                    <td className="px-5 py-3.5 text-gray-800">
                                        {data?.summaryDuration || (data?.weekStartDate ? `${moment(data.weekStartDate).format('DD/MM/YYYY')} - ${moment(data.weekEndDate).format('DD/MM/YYYY')}` : 'N/A')}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">Attendance</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`${data?.isPresent ? 'text-green-500' : 'text-red-500'} font-semibold`}>
                                            {data?.attendance}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">
                                        Hard Outcomes
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-800">
                                        {data?.achievedHardOutcomes?.join(', ') || 'N/A'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">Improvement</td>
                                    <td className="px-5 py-3.5 text-gray-800">
                                        {data?.softSkillImprovements?.join(', ') || 'N/A'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-5 py-3.5 bg-gray-50/50 font-medium text-gray-600">
                                        Skill Tracked
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-800">
                                        {data?.goalSheet?.skillName || 'N/A'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Skill Progress</h3>
                    <div className="space-y-4">
                        <div className=" ">
                            <p className="font-medium pb-2">Skill Name</p>
                            <Input
                                value={data?.goalSheet?.skillName}
                                readOnly
                                className="h-11  shadow-none"
                                style={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}
                            />
                        </div>

                        <div className="flex gap-6 w-full">
                            <div className="flex flex-col w-full ">
                                <p className="font-medium">Planed Progress</p>
                                <Progress percent={data?.goalSheet?.plannedProgress} />
                            </div>

                            <div className="flex flex-col w-full ">
                                <p className="font-medium">Actual Progress</p>
                                <Progress percent={data?.goalSheet?.actualProgress} />
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Concerns & Comments</h3>
                    <div className="p-4 bg-white rounded-xl min-h-[120px] border border-gray-100 shadow-inner">
                        <textarea
                            className="w-full h-full bg-transparent border-none outline-none resize-none text-gray-800 text-sm placeholder:italic"
                            placeholder="Enter concerns or comments here..."
                            readOnly
                            value={data?.comments ?? "N/A"}
                        ></textarea>
                    </div>
                </section>
            </div>
        </Modal>
    );
};

export default WeeklyReportDetailsModal;
