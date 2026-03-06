import { Modal, Input, Select, DatePicker, Form, Button, Spin } from 'antd';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import dayjs from 'dayjs';
import { useGetAllUserGroupsQuery } from '../../../redux/apiSlices/userGroupSlice';
import { useGetAllUserGroupTracksQuery } from '../../../redux/apiSlices/userGroupTrackSlice';
import { useAddEventsMutation, useUpdateEventsMutation } from '../../../redux/apiSlices/admin/adminEventsApi';
import { toast } from 'sonner';

interface AddEventModalProps {
    open: boolean;
    onCancel: () => void;
    refetch: () => void;
    selectedEvent?: any;
}

const AddEventModal = ({ open, onCancel, refetch, selectedEvent }: AddEventModalProps) => {
    const [form] = Form.useForm();
    const [addEvent, { isLoading: isAdding }] = useAddEventsMutation();
    const [updateEvent, { isLoading: isUpdating }] = useUpdateEventsMutation();

    const { data: userGroups } = useGetAllUserGroupsQuery(undefined, { skip: !open });
    const { data: userGroupTracks } = useGetAllUserGroupTracksQuery(undefined, { skip: !open });

    useEffect(() => {
        if (open && selectedEvent) {
            form.setFieldsValue({
                title: selectedEvent.title,
                description: selectedEvent.description,
                date: selectedEvent.date ? dayjs(selectedEvent.date) : undefined,
                location: selectedEvent.location,
                type: selectedEvent.type,
                targetGroup: selectedEvent.targetGroup?._id || selectedEvent.targetGroup,
                targetUser: selectedEvent.targetUser?._id || selectedEvent.targetUser,
            });
        } else if (open && !selectedEvent) {
            form.resetFields();
        }
    }, [open, selectedEvent, form]);

    const onFinish = async (values: any) => {
        try {
            const finalData = {
                ...values,
                date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : undefined,
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
                        label={<span className="text-sm font-semibold text-gray-700">Event Date</span>}
                        rules={[{ required: true, message: 'Please select date' }]}
                    >
                        <DatePicker className="w-full h-11 rounded-lg border-gray-200" />
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
                    <Form.Item
                        name="targetGroup"
                        label={<span className="text-sm font-semibold text-gray-700">Target Group</span>}
                    >
                        <Select
                            placeholder="Select group (optional)"
                            className="w-full h-11"
                            allowClear
                            options={userGroups?.data?.map((group: any) => ({
                                value: group._id,
                                label: group.name,
                            }))}
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    name="targetUser"
                    label={<span className="text-sm font-semibold text-gray-700">Target User (optional)</span>}
                >
                    <Select
                        placeholder="Select specific user (optional)"
                        className="w-full h-11"
                        allowClear
                        options={userGroupTracks?.data?.map((track: any) => ({
                            value: track._id,
                            label: track.name,
                        }))}
                    />
                </Form.Item>

                <div className="flex justify-end pt-4">
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
