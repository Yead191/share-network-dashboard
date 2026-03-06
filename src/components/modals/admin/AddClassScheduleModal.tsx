import { Modal, Input, Select, DatePicker, TimePicker, Checkbox, Form, Spin } from 'antd';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import {
    useAddClassScheduleMutation,
    useUpdateClassScheduleMutation,
} from '../../../redux/apiSlices/admin/adminClassScheduleApi';
import { toast } from 'sonner';
import { useGetAllUserGroupsQuery } from '../../../redux/apiSlices/userGroupSlice';
import { useGetAllUserGroupTracksQuery } from '../../../redux/apiSlices/userGroupTrackSlice';
// import { useGetTeachersQuery } from '../../../redux/apiSlices/admin/adminTeachersApi';

interface AddClassScheduleModalProps {
    open: boolean;
    onCancel: () => void;
    refetch: () => void;
    selectedSchedule?: any;
}

const AddClassScheduleModal = ({ open, onCancel, refetch, selectedSchedule }: AddClassScheduleModalProps) => {
    const [form] = Form.useForm();
    const [addClass, { isLoading }] = useAddClassScheduleMutation();
    const [editClass, { isLoading: isEditLoading }] = useUpdateClassScheduleMutation();
    const { data: userGroups } = useGetAllUserGroupsQuery(undefined, { skip: !open });
    const { data: userGroupTracks } = useGetAllUserGroupTracksQuery(undefined, { skip: !open });
    // const { data: teachersData } = useGetTeachersQuery({ page: 1, limit: 100, searchTerm: '' }, { skip: !open });

    useEffect(() => {
        if (open && selectedSchedule) {
            form.setFieldsValue({
                teacher: selectedSchedule?.teacher,
                title: selectedSchedule?.title,
                description: selectedSchedule?.description,
                userGroup: selectedSchedule?.userGroup?.map((group: any) => group._id),
                userGroupTrack: selectedSchedule?.userGroupTrack?._id,
                date: selectedSchedule?.classDate ? dayjs(selectedSchedule.classDate) : undefined,
                time: selectedSchedule?.classDate ? dayjs(selectedSchedule.classDate) : undefined,
                virtualClass: selectedSchedule?.virtualClass,
                location: selectedSchedule?.location,
            });
        } else if (open && !selectedSchedule) {
            form.resetFields();
        }
    }, [open, selectedSchedule, form]);

    const onFinish = async (values: any) => {
        try {
            const { date, time, ...rest } = values;
            // Combine date and time into a single ISO timestamp
            let classDate;
            if (date && time) {
                const combined = dayjs(date)
                    .set('hour', dayjs(time).hour())
                    .set('minute', dayjs(time).minute())
                    .set('second', dayjs(time).second());
                classDate = combined.toISOString();
            }

            const finalData = {
                ...rest,
                classDate,
                published: true,
                status: true,
            };

            const mutation = selectedSchedule?._id
                ? editClass({ id: selectedSchedule._id, data: finalData }).unwrap()
                : addClass({ data: finalData }).unwrap();

            toast.promise(mutation, {
                loading: selectedSchedule?._id ? 'Updating class schedule...' : 'Creating class schedule...',
                success: (res: any) => {
                    if (res?.success) {
                        refetch();
                        form.resetFields();
                        onCancel();
                    }
                    return (
                        res?.message || `Class schedule ${selectedSchedule?._id ? 'updated' : 'created'} successfully`
                    );
                },
                error: (err: any) =>
                    err?.message || `Failed to ${selectedSchedule?._id ? 'update' : 'create'} class schedule`,
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
                    {selectedSchedule?._id ? 'Edit Class Schedule' : 'Add New Class Schedule'}
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
                initialValues={{ published: true, status: true }}
            >
                {/* <Form.Item
                    name="teacher"
                    label={<span className="text-sm font-semibold text-gray-700">Assign Teacher</span>}
                    rules={[{ required: true, message: 'Please select a teacher' }]}
                >
                    <Select
                        placeholder="Select teacher"
                        className="w-full h-11"
                        options={teachersData?.data?.map((teacher: any) => ({
                            value: teacher._id,
                            label: `${teacher.firstName} ${teacher.lastName}`,
                        }))}
                    />
                </Form.Item> */}
                <Form.Item
                    name="title"
                    label={<span className="text-sm font-semibold text-gray-700">Class Title</span>}
                    rules={[{ required: true, message: 'Please enter class title' }]}
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
                        name="userGroup"
                        label={<span className="text-sm font-semibold text-gray-700">Target Group</span>}
                    >
                        <Select
                            placeholder="Select group"
                            className="w-full h-11"
                            mode="multiple"
                            options={userGroups?.data?.map((group: any) => ({
                                value: group._id,
                                label: group.name,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        name="userGroupTrack"
                        label={<span className="text-sm font-semibold text-gray-700">Target Track</span>}
                    >
                        <Select
                            placeholder="Select Track"
                            className="w-full h-11"
                            options={userGroupTracks?.data?.map((track: any) => ({
                                value: track._id,
                                label: track.name,
                            }))}
                        />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item name="date" label={<span className="text-sm font-semibold text-gray-700">Date</span>}>
                        <DatePicker className="w-full h-11 rounded-lg border-gray-200" />
                    </Form.Item>
                    <Form.Item name="time" label={<span className="text-sm font-semibold text-gray-700">Time</span>}>
                        <TimePicker className="w-full h-11 rounded-lg border-gray-200" format="HH:mm A" />
                    </Form.Item>
                </div>

                <div>
                    <Form.Item name="virtualClass" valuePropName="checked" className="mb-2">
                        <Checkbox>Virtual Class</Checkbox>
                    </Form.Item>
                    <Form.Item
                        name="location"
                        label={<span className="text-sm font-semibold text-gray-700">Location</span>}
                    >
                        <Input placeholder="Enter location" className="h-11 rounded-lg border-gray-200" />
                    </Form.Item>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-[#22C55E] text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-[#1ea34d] transition-colors"
                    >
                        {isLoading || isEditLoading ? (
                            <Spin />
                        ) : selectedSchedule?._id ? (
                            'Update Class'
                        ) : (
                            'Schedule Class'
                        )}
                    </button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddClassScheduleModal;
