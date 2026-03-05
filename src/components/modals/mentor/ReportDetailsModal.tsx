import { Modal, Table } from 'antd';

interface ReportDetailsModalProps {
    open: boolean;
    onCancel: () => void;
    data: any;
}

const ReportDetailsModal = ({ open, onCancel, data }: ReportDetailsModalProps) => {
    const skillProgressData = data?.goalSheet
        ? [
              {
                  key: '1',
                  skill: data.goalSheet.skillName,
                  planned: `${data.goalSheet.plannedProgress}%`,
                  actual: `${data.goalSheet.actualProgress}%`,
              },
          ]
        : [];

    const skillColumns = [
        { title: 'Skill Name', dataIndex: 'skill', key: 'skill' },
        { title: 'Planned Progress', dataIndex: 'planned', key: 'planned', align: 'right' as const },
        { title: 'Actual Progress', dataIndex: 'actual', key: 'actual', align: 'right' as const },
    ];

    return (
        <Modal
            title={<span className="text-xl font-bold">Weekly Reporting Details</span>}
            open={open}
            onCancel={onCancel}
            footer={false}
            width={700}
            className="rounded-2xl overflow-hidden"
            centered
        >
            <div className="space-y-6 pt-3">
                <section>
                    <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-600 w-1/3">
                                        Student Name
                                    </td>
                                    <td className="px-4 py-3 text-gray-800">
                                        {data?.studentId?.firstName + ' ' + data?.studentId?.lastName || 'N/A'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-600">Duration</td>
                                    <td className="px-4 py-3 text-gray-800">
                                        {data?.weekStartDate
                                            ? `${new Date(data.weekStartDate).toLocaleDateString()} - ${new Date(data.weekEndDate).toLocaleDateString()}`
                                            : 'N/A'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-600">Attendance</td>
                                    <td
                                        className={`px-4 py-3 font-semibold ${data?.isPresent ? 'text-green-500' : 'text-red-500'}`}
                                    >
                                        {data?.isPresent ? 'Present' : 'Absent'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-600">Hard Outcomes</td>
                                    <td className="px-4 py-3 text-gray-800">
                                        <div className="flex flex-wrap gap-1">
                                            {data?.achievedHardOutcomes?.map((outcome: string, idx: number) => (
                                                <span
                                                    key={idx}
                                                    className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs"
                                                >
                                                    {outcome}
                                                </span>
                                            )) || 'None'}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-600">
                                        Soft Skill Improvements
                                    </td>
                                    <td className="px-4 py-3 text-gray-800">
                                        <div className="flex flex-wrap gap-1">
                                            {data?.softSkillImprovements?.map((skill: string, idx: number) => (
                                                <span
                                                    key={idx}
                                                    className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-xs"
                                                >
                                                    {skill}
                                                </span>
                                            )) || 'None'}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Skill Progress</h3>
                    <div className="border border-blue-100 rounded-xl overflow-hidden">
                        <Table
                            dataSource={skillProgressData}
                            columns={skillColumns}
                            pagination={false}
                            size="small"
                            bordered
                        />
                    </div>
                </section>

                <section className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-semibold mb-2 text-gray-800">Work This Week</h3>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600">
                            {data?.whatDidYouWorkOnThisWeek || 'No data provided'}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold mb-2 text-gray-800">Student Progress</h3>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600">
                            {data?.whatProgressDidTheStudentMake || 'No data provided'}
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-sm font-semibold mb-2 text-gray-800">Achievements & Improvements</h3>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600">
                        {data?.highLightAchivementsAndImprove || 'No data provided'}
                    </div>
                </section>

                <section className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-semibold mb-2 text-gray-800">Plan For Next Week</h3>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600">
                            {data?.planForNextWeek || 'No data provided'}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold mb-2 text-gray-800">Objectives</h3>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600">
                            {data?.objectives || 'No data provided'}
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-sm font-semibold mb-2 text-gray-800">Comments</h3>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600 min-h-[60px]">
                        {data?.comments || <p className="text-gray-400 italic">No comments provided.</p>}
                    </div>
                </section>
            </div>
        </Modal>
    );
};

export default ReportDetailsModal;
