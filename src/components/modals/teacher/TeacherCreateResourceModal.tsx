import { Modal, Input, Select, Checkbox, Form, Button, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { X, Inbox } from 'lucide-react';
import { useCreateResourseMutation, useUpdateResourseMutation } from '../../../redux/apiSlices/teacher/resourceSlice';
import { toast } from 'sonner';
import Dragger from 'antd/es/upload/Dragger';

interface TeacherCreateResourceModalProps {
    open: boolean;
    onCancel: () => void;
    refetch: () => void;
    selectedMaterial?: any;
    teacherUserGroup?: string;
    teacherUserGroupTrack?: string;
}

const TeacherCreateResourceModal = ({
    open,
    onCancel,
    refetch,
    selectedMaterial,
    teacherUserGroup,
    teacherUserGroupTrack,
}: TeacherCreateResourceModalProps) => {
    const [form] = Form.useForm();
    const [createResource, { isLoading }] = useCreateResourseMutation();
    const [updateResource, { isLoading: isEditLoading }] = useUpdateResourseMutation();
    const [file, setFile] = useState<any | null>(null);

    useEffect(() => {
        if (open && selectedMaterial) {
            form.setFieldsValue({
                title: selectedMaterial?.title,
                description: selectedMaterial?.description,
                type: selectedMaterial?.type,
                contentUrl: selectedMaterial?.url,
                targeteAudience: selectedMaterial?.targetAudience,
                markAsAssigned: selectedMaterial?.status === 'Active',
            });
        } else if (open && !selectedMaterial) {
            form.resetFields();
            setFile(null);
        }
    }, [open, selectedMaterial, form]);

    const onFinish = async (values: Record<string, any>) => {
        try {
            const formdata = new FormData();

            Object.entries(values).forEach(([key, value]) => {
                if (key !== 'file' && value !== undefined && value !== null && value !== '') {
                    if (key === 'markAsAssigned') {
                        formdata.append(key, String(!!value));
                    } else {
                        formdata.append(key, String(value));
                    }
                }
            });

            // Auto-append teacher's group and track
            if (teacherUserGroup) {
                formdata.append('targertGroup', teacherUserGroup);
            }
            if (teacherUserGroupTrack) {
                formdata.append('targetTrack', teacherUserGroupTrack);
            }

            if (!selectedMaterial?._id) {
                formdata.append('markAsAssigned', 'true');
            }

            if (file) {
                formdata.append('file', file);
            }

            const mutation = selectedMaterial?._id
                ? updateResource({ id: selectedMaterial._id, data: formdata }).unwrap()
                : createResource(formdata).unwrap();

            toast.promise(mutation, {
                loading: selectedMaterial?._id ? 'Updating material...' : 'Creating material...',
                success: (res: any) => {
                    if (res?.success) {
                        refetch();
                        form.resetFields();
                        setFile(null);
                        onCancel();
                    }
                    return res?.message || 'Material saved successfully';
                },
                error: (err: any) => err?.message || 'Failed to save material',
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
                    {selectedMaterial?._id ? 'Update' : 'Add New'} Learning Material
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
                    <Form.Item name="type" label={<span className="text-sm font-semibold text-gray-700">Type</span>}>
                        <Select placeholder="Select Resource Type" className="w-full h-11">
                            <Select.Option value="LECTURE">Lecture</Select.Option>
                            <Select.Option value="SLIDES">Slides</Select.Option>
                            <Select.Option value="MATERIAL">Material</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="contentUrl"
                        label={<span className="text-sm font-semibold text-gray-700">Content URL</span>}
                    >
                        <Input placeholder="https://..." className="h-11 rounded-lg border-gray-200" />
                    </Form.Item>
                </div>

                <div>
                    <Form.Item
                        name="file"
                        label={<span className="text-sm font-semibold text-gray-700">Upload File (PDF/DOCX/etc.)</span>}
                    >
                        <Dragger
                            className="border-gray-300 rounded-xl bg-gray-50 hover:border-indigo-400 transition-colors"
                            height={180}
                            beforeUpload={(file) => {
                                const isLt10M = file.size / 1024 / 1024 < 10;
                                if (!isLt10M) {
                                    toast.error('File must be smaller than 10MB!');
                                    return false;
                                }
                                setFile(file);
                                return false;
                            }}
                            onRemove={() => setFile(null)}
                            maxCount={1}
                        >
                            <div className="flex flex-col items-center justify-center py-5 px-4 text-center">
                                <Inbox className="text-5xl text-indigo-500 mb-4" />
                                <p className="text-lg font-medium text-gray-700 mb-1">Click or drag file here</p>
                                <p className="text-sm text-gray-500">Max 10 MB</p>
                            </div>
                        </Dragger>
                    </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        name="targeteAudience"
                        label={<span className="text-sm font-semibold text-gray-700">Target Audience</span>}
                        rules={[{ required: true, message: 'Please select audience' }]}
                    >
                        <Select placeholder="Select" className="w-full h-11">
                            <Select.Option value="STUDENT">STUDENT</Select.Option>
                            <Select.Option value="MENTOR">MENTOR</Select.Option>
                            <Select.Option value="TEACHER">TEACHER</Select.Option>
                            <Select.Option value="COORDINATOR">COORDINATOR</Select.Option>
                        </Select>
                    </Form.Item>
                </div>

                {selectedMaterial?._id && (
                    <Form.Item name="markAsAssigned" valuePropName="checked">
                        <Checkbox className="text-gray-600">Mark as Assigned</Checkbox>
                    </Form.Item>
                )}

                <div className="flex justify-end pt-4">
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="bg-[#22C55E] text-white px-8 py-5 rounded-lg font-semibold hover:!bg-[#1ea34d] border-none flex items-center justify-center h-11"
                    >
                        {isLoading || isEditLoading ? (
                            <Spin />
                        ) : selectedMaterial?._id ? (
                            'Update Material'
                        ) : (
                            'Create Material'
                        )}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default TeacherCreateResourceModal;
