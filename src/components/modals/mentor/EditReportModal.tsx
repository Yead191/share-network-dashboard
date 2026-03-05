import { useEffect } from 'react';
import { Modal, Form, Select, DatePicker, Checkbox, Input, Slider, Radio } from 'antd';
import { useUpdateWeeklyReportMutation } from '../../../redux/apiSlices/mentor/weeklyReportApi';
import { toast } from 'sonner';
import dayjs from 'dayjs';

interface EditReportModalProps {
    open: boolean;
    onCancel: () => void;
    data: any;
    assignedStudent: any;
    refetch: () => void;
}

const EditReportModal = ({ open, onCancel, data, assignedStudent, refetch }: EditReportModalProps) => {
    const [updateWeeklyReport] = useUpdateWeeklyReportMutation();
    const [form] = Form.useForm();

    useEffect(() => {
        if (open && data) {
            form.setFieldsValue({
                student: data.studentId?._id || data.studentId,
                startDate: data.weekStartDate ? dayjs(data.weekStartDate) : undefined,
                endDate: data.weekEndDate ? dayjs(data.weekEndDate) : undefined,
                isPresent: data.isPresent ? 'yes' : 'no',
                achievedHardOutcomes: data.achievedHardOutcomes || [],
                softSkillImprovements: data.softSkillImprovements || [],
                whatDidYouWorkOnThisWeek: data.whatDidYouWorkOnThisWeek,
                whatProgressDidTheStudentMake: data.whatProgressDidTheStudentMake,
                highLightAchivementsAndImprove: data.highLightAchivementsAndImprove,
                planForNextWeek: data.planForNextWeek,
                skillName: data.goalSheet?.skillName,
                plannedProgress: data.goalSheet?.plannedProgress,
                actualProgress: data.goalSheet?.actualProgress,
                comments: data.comments,
            });
        }
    }, [open, data, form]);

    const onFinish = async (values: any) => {
        try {
            const formattedValues = {
                id: data?._id,
                ...values,
                weekStartDate: values.startDate?.toISOString(),
                weekEndDate: values.endDate?.toISOString(),
                isPresent: values.isPresent === 'yes',
                goalSheet: {
                    skillName: values.skillName,
                    plannedProgress: values.plannedProgress,
                    actualProgress: values.actualProgress,
                },
                studentId: values.student,
            };

            toast.promise(updateWeeklyReport(formattedValues).unwrap(), {
                loading: 'Updating report...',
                success: (res) => {
                    refetch();
                    onCancel();
                    return res.message || 'Report updated successfully';
                },
                error: (err) => {
                    return err?.data?.message || 'Failed to update report';
                },
            });
        } catch (error) {
            console.error('Failed to update report:', error);
        }
    };

    return (
        <Modal
            title={<span className="text-xl font-bold">Edit Report</span>}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={700}
            className="rounded-2xl overflow-hidden h-[90vh] overflow-y-auto"
            centered
        >
            <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4">
                <Form.Item name="student" label={<span className="font-semibold">Student</span>}>
                    <Select placeholder="Select Student">
                        {assignedStudent?.map((student: any) => (
                            <Select.Option key={student.id || student._id} value={student.id || student._id}>
                                {student?.firstName + ' ' + student?.lastName}
                            </Select.Option>
                        )) || <Select.Option value="">No student assigned</Select.Option>}
                    </Select>
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item name="startDate" label={<span className="font-semibold">Week Start Date</span>}>
                        <DatePicker className="w-full" placeholder="mm/dd/yyyy" format="MM/DD/YYYY" />
                    </Form.Item>
                    <Form.Item name="endDate" label={<span className="font-semibold">Week End Date</span>}>
                        <DatePicker className="w-full" placeholder="mm/dd/yyyy" format="MM/DD/YYYY" />
                    </Form.Item>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-gray-800">Weekly Report</h3>
                    <Form.Item
                        name="isPresent"
                        label={<span className="text-sm font-medium">Was the student present?</span>}
                        initialValue="yes"
                    >
                        <Radio.Group>
                            <Radio value="yes">Yes</Radio>
                            <Radio value="no">No</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name="achievedHardOutcomes"
                        label={
                            <span className="text-sm font-medium">
                                Has the student achieved any of the hard outcomes since the last mentor meeting?
                            </span>
                        }
                    >
                        <Checkbox.Group className="grid grid-cols-3 gap-2">
                            <Checkbox value="Homework">Homework</Checkbox>
                            <Checkbox value="Assignment">Assignment</Checkbox>
                            <Checkbox value="Volunteering">Volunteering</Checkbox>
                            <Checkbox value="Employment">Employment</Checkbox>
                            <Checkbox value="Training">Training</Checkbox>
                        </Checkbox.Group>
                    </Form.Item>

                    <Form.Item
                        name="softSkillImprovements"
                        label={
                            <span className="text-sm font-medium">
                                Has the student made any improvements in any of the following?
                            </span>
                        }
                    >
                        <Checkbox.Group className="grid grid-cols-2 gap-2">
                            <Checkbox value="Communication">Communication</Checkbox>
                            <Checkbox value="Confidence">Confidence</Checkbox>
                            <Checkbox value="Time Management">Time Management</Checkbox>
                            <Checkbox value="Problem Solving">Problem Solving</Checkbox>
                        </Checkbox.Group>
                    </Form.Item>

                    <Form.Item
                        name="whatDidYouWorkOnThisWeek"
                        label={<span className="text-sm font-medium">What did you work on this week?</span>}
                    >
                        <Input.TextArea rows={2} placeholder="Type here..." className="rounded-xl" />
                    </Form.Item>

                    <Form.Item
                        name="whatProgressDidTheStudentMake"
                        label={<span className="text-sm font-medium">What progress did the student make?</span>}
                    >
                        <Input.TextArea rows={2} placeholder="Type here..." className="rounded-xl" />
                    </Form.Item>

                    <Form.Item
                        name="highLightAchivementsAndImprove"
                        label={
                            <span className="text-sm font-medium">
                                Highlight achievements and areas for improvement
                            </span>
                        }
                    >
                        <Input.TextArea rows={2} placeholder="Type here..." className="rounded-xl" />
                    </Form.Item>

                    <Form.Item
                        name="planForNextWeek"
                        label={<span className="text-sm font-medium">Plan for next week</span>}
                    >
                        <Input.TextArea rows={2} placeholder="Type here..." className="rounded-xl" />
                    </Form.Item>
                </div>

                <div className="">
                    <h3 className="font-semibold text-lg text-gray-800 pb-2">Goal Sheet</h3>

                    <Form.Item name="skillName" label={<span className="text-sm font-medium">Skill Name</span>}>
                        <Input placeholder="HTML/CSS Development" className="rounded-lg h-10" />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="plannedProgress"
                            label={
                                <div className="flex justify-between w-full">
                                    <span className="text-sm font-medium">Planned Progress</span>
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prevVal, currVal) =>
                                            prevVal.plannedProgress !== currVal.plannedProgress
                                        }
                                    >
                                        {({ getFieldValue }) => (
                                            <span className="text-sm font-bold ms-1">
                                                {getFieldValue('plannedProgress') || 0}%
                                            </span>
                                        )}
                                    </Form.Item>
                                </div>
                            }
                        >
                            <Slider trackStyle={{ backgroundColor: '#8B5CF6' }} min={0} max={100} />
                        </Form.Item>

                        <Form.Item
                            name="actualProgress"
                            label={
                                <div className="flex justify-between w-full">
                                    <span className="text-sm font-medium">Actual Progress</span>
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prevVal, currVal) =>
                                            prevVal.actualProgress !== currVal.actualProgress
                                        }
                                    >
                                        {({ getFieldValue }) => (
                                            <span className="text-sm font-bold ms-1">
                                                {getFieldValue('actualProgress') || 0}%
                                            </span>
                                        )}
                                    </Form.Item>
                                </div>
                            }
                        >
                            <Slider trackStyle={{ backgroundColor: '#8B5CF6' }} min={0} max={100} />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item name="comments" label={<span className="text-sm font-medium">Comments</span>}>
                    <Input.TextArea rows={2} placeholder="General comments..." className="rounded-xl" />
                </Form.Item>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        className="flex-1 h-11 rounded-xl font-semibold bg-primary text-white border-none hover:opacity-90 transition-opacity"
                    >
                        Save Changes
                    </button>
                </div>
            </Form>
        </Modal>
    );
};

export default EditReportModal;
