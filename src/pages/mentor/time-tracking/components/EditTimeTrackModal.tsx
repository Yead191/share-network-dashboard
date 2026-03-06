import { Modal, Form, Input, DatePicker, Button, Select, InputNumber } from 'antd';
import { useUpdateTimeTrackingMutation } from '../../../../redux/apiSlices/mentor/timeTrackingApi';
import { toast } from 'sonner';
import { useEffect } from 'react';
import dayjs from 'dayjs';

interface EditTimeTrackModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignedStudents: any[];
    data: any;
}

const SESSION_TYPES = [
    '1-on-1 Session',
    'Group Session',
    'Code Review',
    'Project Discussion',
    'Career Guidance',
    'Technical Support',
    'Other',
];

const EditTimeTrackModal = ({ isOpen, onClose, assignedStudents, data }: EditTimeTrackModalProps) => {
    const [form] = Form.useForm();
    const [updateTimeTracking, { isLoading }] = useUpdateTimeTrackingMutation();

    useEffect(() => {
        if (data && isOpen) {
            form.setFieldsValue({
                studentId: data.studentId?._id || data.studentId,
                startTime: data.startTime ? dayjs(data.startTime) : undefined,
                endTime: data.endTime ? dayjs(data.endTime) : undefined,
                spentHours: data.spentHours,
                timeType: data.timeType,
                comments: data.comments,
            });
        }
    }, [data, isOpen, form]);

    const onFinish = async (values: any) => {
        const payload = {
            id: data._id,
            ...values,
            startTime: values.startTime.toISOString(),
            endTime: values.endTime.toISOString(),
        };

        try {
            await updateTimeTracking(payload).unwrap();
            toast.success('Time track updated successfully');
            onClose();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update time track');
        }
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            title={
                <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                    Edit Time Track
                </div>
            }
            width={600}
            centered
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4 pt-4">
                <Form.Item
                    name="studentId"
                    label={<span className="font-semibold text-gray-700">Student (Optional)</span>}
                >
                    <Select
                        placeholder="Select a student (optional)"
                        className="h-11 rounded-lg"
                        options={assignedStudents.map((student) => ({
                            label: `${student.firstName} ${student.lastName}`,
                            value: student._id,
                        }))}
                        allowClear
                    />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        name="startTime"
                        label={<span className="font-semibold text-gray-700">Start Date *</span>}
                        rules={[{ required: true, message: 'Please select start time!' }]}
                    >
                        <DatePicker
                            showTime
                            className="w-full h-11 rounded-lg"
                            placeholder="dd/mm/yyyy"
                            format="DD/MM/YYYY HH:mm"
                        />
                    </Form.Item>

                    <Form.Item
                        name="endTime"
                        label={<span className="font-semibold text-gray-700">End Date *</span>}
                        rules={[{ required: true, message: 'Please select end time!' }]}
                    >
                        <DatePicker
                            showTime
                            className="w-full h-11 rounded-lg"
                            placeholder="dd/mm/yyyy"
                            format="DD/MM/YYYY HH:mm"
                        />
                    </Form.Item>

                    <Form.Item
                        name="spentHours"
                        label={<span className="font-semibold text-gray-700">Hours *</span>}
                        rules={[{ required: true, message: 'Please input spent hours!' }]}
                    >
                        <InputNumber min={0} step={0.5} className="w-full h-11 rounded-lg" placeholder="0" />
                    </Form.Item>

                    <Form.Item
                        name="timeType"
                        label={<span className="font-semibold text-gray-700">Session Type *</span>}
                        rules={[{ required: true, message: 'Please select session type!' }]}
                    >
                        <Select
                            placeholder="Select type"
                            className="h-11 rounded-lg"
                            options={SESSION_TYPES.map((type) => ({
                                label: type,
                                value: type,
                            }))}
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    name="comments"
                    label={<span className="font-semibold text-gray-700">Notes (Optional)</span>}
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Describe what was discussed or accomplished..."
                        className="rounded-xl border-gray-200 pt-3"
                    />
                </Form.Item>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        className="flex-1 h-12 rounded-xl font-semibold border-gray-200 hover:bg-gray-50 transition-colors"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        className="flex-1 h-12 rounded-xl font-bold bg-primary border-none hover:opacity-90 transition-opacity text-white"
                    >
                        Update Time
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default EditTimeTrackModal;
