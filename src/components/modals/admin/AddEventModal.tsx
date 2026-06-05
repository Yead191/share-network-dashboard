import { Modal, Input, Select, DatePicker, Form, Button, Spin, Radio, Checkbox } from 'antd';
import { useEffect, } from 'react';
import { X } from 'lucide-react';
import dayjs from 'dayjs';
import { useAddEventsMutation, useUpdateEventsMutation } from '../../../redux/apiSlices/admin/adminEventsApi';
import { useGetStudentsQuery } from '../../../redux/apiSlices/admin/adminStudentApi';
import { toast } from 'sonner';

interface AddEventModalProps {
    open: boolean;
    onCancel: () => void;
    refetch: () => void;
    selectedEvent?: any;
    userGroups?: any[];
    isGroupsLoading?: boolean;
}

const AddEventModal = ({
    open,
    onCancel,
    refetch,
    selectedEvent,
    userGroups,
    isGroupsLoading,
}: AddEventModalProps) => {
    const [form] = Form.useForm();
    const [addEvent, { isLoading: isAdding }] = useAddEventsMutation();
    const [updateEvent, { isLoading: isUpdating }] = useUpdateEventsMutation();

    const selectedGroup = Form.useWatch('targetGroup', form);
    const invitationType = Form.useWatch('invitationType', form);

    const { data: studentsApi, isFetching: isStudentsLoading } = useGetStudentsQuery(
        {
            selectedGroup: selectedGroup,
            page: 0,
            limit: 0,
        },
        { skip: !open || (invitationType === 'all' && !selectedEvent) },
    );

    const students = studentsApi?.data?.data || [];

    useEffect(() => {
        if (open && selectedEvent) {
            form.setFieldsValue({
                title: selectedEvent.title,
                description: selectedEvent.description,
                date: selectedEvent.date ? dayjs(selectedEvent.date) : undefined,
                location: selectedEvent.location,
                type: selectedEvent.type,
                invitationType: selectedEvent.students?.length > 0 ? 'selective' : 'all',
                targetGroup: selectedEvent.targetGroup?._id || selectedEvent.targetGroup,
                targetUser: selectedEvent.targetUser?._id || selectedEvent.targetUser,
                students: selectedEvent.students ? selectedEvent.students.map((s: any) => s._id || s) : undefined,
                status: selectedEvent.status,
            });
        } else if (open && !selectedEvent) {
            form.resetFields();
            form.setFieldsValue({ invitationType: 'selective' });
        }
    }, [open, selectedEvent, form]);

    const onFinish = async (values: any) => {
        try {
            const finalData = {
                ...values,
                date: values.date ? dayjs(values.date).format('YYYY-MM-DD HH:mm') : undefined,
                ...(values.invitationType !== 'all' && { studentAssigned: values.students }),
            };

            const mutation = selectedEvent?._id
                ? updateEvent({ id: selectedEvent._id, data: finalData }).unwrap()
                : addEvent(finalData).unwrap();

            toast.promise(mutation, {
                loading: selectedEvent?._id ? 'Updating event...' : 'Creating event...',
                success: (res: any) => {
                    if (res?.success) {
                        refetch();
                        onCancel();
                        form.resetFields();
                    }
                    return res?.message || `Event ${selectedEvent?._id ? 'updated' : 'created'} successfully`;
                },
                error: (err: any) => err?.message || `Failed to ${selectedEvent?._id ? 'update' : 'create'} event`,
            });
        } catch (error: any) {
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

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
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">
                    {selectedEvent?._id ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button
                    onClick={() => {
                        onCancel();
                        form.resetFields();
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
                requiredMark={false}
                className="space-y-4"
            >
                <Form.Item
                    name="title"
                    label={<span className="text-sm font-semibold text-gray-700">Title</span>}
                    rules={[{ required: true, message: 'Please enter title' }]}
                >
                    <Input placeholder="Enter title" className="h-11 rounded-lg border-gray-200" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label={<span className="text-sm font-semibold text-gray-700">Description</span>}
                >
                    <Input.TextArea
                        placeholder="Write description..."
                        className="rounded-lg border-gray-200"
                        rows={4}
                    />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        name="date"
                        label={<span className="text-sm font-semibold text-gray-700">Event Date & Time</span>}
                        rules={[{ required: true, message: 'Please select date and time' }]}
                    >
                        <DatePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            className="w-full h-11 rounded-lg border-gray-200"
                        />
                    </Form.Item>
                    <Form.Item
                        name="location"
                        label={<span className="text-sm font-semibold text-gray-700">Location</span>}
                        rules={[{ required: true, message: 'Please enter location' }]}
                    >
                        <Input placeholder="Enter location" className="h-11 rounded-lg border-gray-200" />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        name="type"
                        label={<span className="text-sm font-semibold text-gray-700">Type</span>}
                        rules={[{ required: true, message: 'Please select type' }]}
                    >
                        <Select placeholder="Select type" className="w-full h-11">
                            <Select.Option value="workshop">workshop</Select.Option>
                            <Select.Option value="webinar">webinar</Select.Option>
                            <Select.Option value="seminar">seminar</Select.Option>
                            <Select.Option value="other">other</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="status" label={<span className="text-sm font-semibold text-gray-700">Status</span>} initialValue="active">
                        <Select
                            placeholder="Select status"
                            className="w-full h-11 rounded-lg border-gray-200"
                            options={[
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' },
                            ]}
                        />
                    </Form.Item>

                </div>
                <div>
                    <Form.Item
                        name="invitationType"
                        label={<span className="text-sm font-semibold text-gray-700">Invitation Type</span>}
                        initialValue="selective"
                    >
                        <Radio.Group className="flex flex-col gap-2 mt-2">
                            <Radio value="all">Invite all students</Radio>
                            <Radio value="selective">Invite by groups or individual</Radio>
                        </Radio.Group>
                    </Form.Item>
                </div>

                {invitationType === 'selective' && (
                    <div className="">
                        <Form.Item
                            label={<span className="font-bold text-gray-700">Filter by Group (Optional)</span>}
                            name="targetGroup"
                        >
                            <Select
                                placeholder="Choose groups"
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                                loading={isGroupsLoading}
                                options={userGroups?.map((g: any) => ({
                                    label: g.name,
                                    value: g._id,
                                }))}
                                allowClear
                                onChange={() => form.setFieldValue('students', [])}
                            />
                        </Form.Item>


                    </div>
                )}

                {invitationType === 'selective' && (
                    <div className='relative'>
                        <Form.Item
                            name="students"
                            label={<span className="text-sm font-semibold text-gray-700">Select Students (optional)</span>}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Choose students"
                                className="w-full"
                                loading={isStudentsLoading}
                                style={{ height: 'auto', minHeight: '44px' }}
                                options={
                                    students?.map((student: any) => ({
                                        value: student?._id,
                                        label: `${student?.firstName} ${student?.lastName} (${student?.email})`,
                                    })) || []
                                }
                                filterOption={(input, option) =>
                                    String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                        <div className="flex flex-col justify-end pb-4 absolute top-0 right-0">
                            <Checkbox
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        form.setFieldValue(
                                            'students',
                                            students.map((s: any) => s._id),
                                        );
                                    } else {
                                        form.setFieldValue('students', []);
                                    }
                                }}
                            >
                                Select All Students
                            </Checkbox>
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-4 ">
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="bg-[#22C55E] text-white px-8 py-5 rounded-lg font-semibold hover:!bg-[#1ea34d] border-none flex items-center justify-center h-11"
                        disabled={isAdding || isUpdating}
                    >
                        {isAdding || isUpdating ? (
                            <Spin size="small" />
                        ) : selectedEvent?._id ? (
                            'Update Event'
                        ) : (
                            'Create Event'
                        )}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddEventModal;
