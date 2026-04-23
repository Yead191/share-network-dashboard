import { Modal, Input, DatePicker, TimePicker, Checkbox, Form, Spin, Upload, Button } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { X, Upload as UploadIcon } from 'lucide-react';
import { getImageUrl } from '../../../utils/getImageUrl';
import {
    useAddClassTeacherMutation,
    useUpdateClassTeacherMutation,
} from '../../../redux/apiSlices/teacher/homeSlice';
import { toast } from 'sonner';

interface TeacherCreateClassModalProps {
    open: boolean;
    onCancel: () => void;
    refetch: () => void;
    selectedSchedule?: any;
    teacherUserGroup?: string;
    teacherUserGroupTrack?: string;
}

const TeacherCreateClassModal = ({ open, onCancel, refetch, selectedSchedule, teacherUserGroup, teacherUserGroupTrack }: TeacherCreateClassModalProps) => {
    const [form] = Form.useForm();
    const [addClass, { isLoading }] = useAddClassTeacherMutation();
    const [editClass, { isLoading: isEditLoading }] = useUpdateClassTeacherMutation();
    const [fileList, setFileList] = useState<any[]>([]);

    useEffect(() => {
        if (open && selectedSchedule) {
            form.setFieldsValue({
                title: selectedSchedule?.title,
                description: selectedSchedule?.description,
                date: selectedSchedule?.classDate ? dayjs(selectedSchedule.classDate) : undefined,
                time: selectedSchedule?.classDate ? dayjs(selectedSchedule.classDate) : undefined,
                virtualClass: selectedSchedule?.virtualClass,
                location: selectedSchedule?.location,
                slideUrl: selectedSchedule?.slideUrl,
            });
            if (selectedSchedule?.file) {
                setFileList([
                    {
                        uid: '-1',
                        name: selectedSchedule.file.split('/').pop() || 'existing-file',
                        status: 'done',
                        url: getImageUrl(selectedSchedule.file),
                    },
                ]);
            } else {
                setFileList([]);
            }
        } else if (open && !selectedSchedule) {
            form.resetFields();
            setFileList([]);
        }
    }, [open, selectedSchedule, form]);

    const onFinish = async (values: any) => {
        try {
            const { date, time, slideUrl, file: ignoreFileField, ...rest } = values;
            
            let classDate;
            if (date && time) {
                const combined = dayjs(date)
                    .set('hour', dayjs(time).hour())
                    .set('minute', dayjs(time).minute())
                    .set('second', dayjs(time).second());
                classDate = combined.toISOString();
            }

            const formData = new FormData();

            Object.entries(rest).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    formData.append(key, String(value));
                }
            });

            if (classDate) {
                formData.append('classDate', classDate);
            }
            if (slideUrl) {
                formData.append('slideUrl', slideUrl);
            }
            
            if (teacherUserGroup) {
                formData.append('userGroup[0]', teacherUserGroup);
            }
            
            if (teacherUserGroupTrack) {
                formData.append('userGroupTrack', teacherUserGroupTrack);
            }

            formData.append('published', 'true');
            formData.append('status', 'true');

            // Handle file upload/removal
            const newFile = fileList[0]?.originFileObj;
            if (newFile) {
                formData.append('file', newFile);
            } else if (fileList.length === 0 && selectedSchedule?.file) {
                // If the user removed the existing file
                formData.append('file', 'null');
            }

            let result: any;
            if (selectedSchedule?._id) {
                result = await editClass({ id: selectedSchedule._id, data: formData });
            } else {
                result = await addClass(formData);
            }

            if (result?.error) {
                toast.error(result.error?.data?.message || `Failed to ${selectedSchedule?._id ? 'update' : 'create'} class`);
            } else {
                toast.success(result?.data?.message || `Class ${selectedSchedule?._id ? 'updated' : 'created'} successfully`);
                refetch();
                form.resetFields();
                onCancel();
            }

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
                initialValues={{ virtualClass: false }}
            >
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
                    <Form.Item name="date" label={<span className="text-sm font-semibold text-gray-700">Date</span>} rules={[{ required: true, message: 'Please select date' }]}>
                        <DatePicker className="w-full h-11 rounded-lg border-gray-200" />
                    </Form.Item>
                    <Form.Item name="time" label={<span className="text-sm font-semibold text-gray-700">Time</span>} rules={[{ required: true, message: 'Please select time' }]}>
                        <TimePicker className="w-full h-11 rounded-lg border-gray-200" format="hh:mm A" use12Hours />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item name="virtualClass" valuePropName="checked" className="mb-0 flex items-center h-full">
                        <Checkbox>Virtual Class</Checkbox>
                    </Form.Item>
                    <Form.Item
                        name="location"
                        label={<span className="text-sm font-semibold text-gray-700">Location</span>}
                    >
                        <Input placeholder="Enter location" className="h-11 rounded-lg border-gray-200" />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <Form.Item
                        name="slideUrl"
                        label={<span className="text-sm font-semibold text-gray-700">Slide / Content URL</span>}
                    >
                        <Input placeholder="https://..." className="h-11 rounded-lg border-gray-200" />
                    </Form.Item>

                    <Form.Item
                        name="file"
                        label={<span className="text-sm font-semibold text-gray-700">Lecture Material</span>}
                    >
                        <Upload
                            accept=".pdf,.doc,.docx"
                            fileList={fileList}
                            onChange={({ fileList }) => {
                                setFileList(fileList.slice(-1));
                            }}
                            beforeUpload={(uploadedFile) => {
                                const isValidType =
                                    uploadedFile.type === "application/pdf" ||
                                    uploadedFile.type === "application/msword" ||
                                    uploadedFile.type ===
                                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

                                if (!isValidType) {
                                    toast.error("Only PDF and DOC/DOCX files are allowed!");
                                    return Upload.LIST_IGNORE;
                                }
                                return false;
                            }}
                            maxCount={1}
                            className="w-full"
                        >
                            {fileList.length < 1 && (
                                <Button className="w-full h-11 rounded-lg border-gray-200 flex items-center justify-center gap-2">
                                    <UploadIcon size={16} /> Select File
                                </Button>
                            )}
                        </Upload>
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

export default TeacherCreateClassModal;
