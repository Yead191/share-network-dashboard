"use client"
import { Modal, Button, Input, Select, Form } from 'antd';
import { IoCloseOutline } from 'react-icons/io5';
import { useCreateResourseMutation, useGetUserGroupsQuery, useGetUserGroupsTrackQuery, useUpdateResourseMutation } from '../../../redux/apiSlices/teacher/resourceSlice';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Dragger from 'antd/es/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';

interface CreateResourceModalProps {
    visible: boolean;
    onClose: () => void;
    initialValues?: any;
    refetch: () => void;
}

const CreateResourceModal: React.FC<CreateResourceModalProps> = ({ visible, onClose, initialValues, refetch }) => {
    const [form] = Form.useForm();
    const { data: userGroups } = useGetUserGroupsQuery({ page: 1, limit: 10 });
    const { data: userGroupsTrack } = useGetUserGroupsTrackQuery({ page: 1, limit: 10 });
    const [file, setFile] = useState<any | null>(null);
    const [createResourse] = useCreateResourseMutation();
    const [updateResource] = useUpdateResourseMutation();
    // console.log(file); 

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [visible, initialValues, form]);

    const onFinish = async (values: Record<string, any>) => {
        try {
            const formdata = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === 'markAsAssigned') {
                        formdata.append(key, String(!!value));
                    } else {
                        formdata.append(key, String(value));
                    }
                }
            });

            if (file) {
                formdata.append('file', file);
            }

            const mutation = initialValues?._id
                ? updateResource({ id: initialValues._id, data: formdata }).unwrap()
                : createResourse(formdata).unwrap();

            toast.promise(mutation, {
                loading: initialValues?._id ? 'Updating material...' : 'Creating material...',
                success: (res: any) => {
                    // console.log(res);
                    if (res?.success) {
                        refetch();
                        form.resetFields();
                        setFile(null);
                        onClose();
                    }
                    return res?.message || 'Material saved successfully';
                },
                error: (err: any) => err?.message || 'Failed to save material',
            });
        } catch (error: any) {
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };
    // sf
    return (
        <Modal
            open={visible}
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            footer={null}
            closeIcon={<IoCloseOutline size={24} className="text-gray-500" />}
            width={700}
            centered
            title={
                <span className="text-xl font-semibold text-gray-800">
                    {initialValues ? 'Edit Resources' : 'Create New Resources'}
                </span>
            }
            className="create-resource-modal"
        >
            <Form form={form} layout="vertical" className="mt-6" onFinish={onFinish}>
                <Form.Item
                    name="title"
                    label={<span className="font-semibold text-gray-700">Title</span>}
                    rules={[{ required: true, message: 'Please enter a title' }]}
                >
                    <Input placeholder="Enter title" className="h-[42px] rounded-lg border-gray-200" />
                </Form.Item>


                <div className="flex gap-6">
                    <Form.Item
                        name="type"
                        label={<span className="font-semibold text-gray-700">Type</span>}
                        className="flex-1"
                        rules={[{ required: true, message: 'Please select a type' }]}
                    >
                        <Select placeholder="Select" className="h-[42px] rounded-lg border-gray-200">
                            <Select.Option value="PDF">PDF</Select.Option>
                            <Select.Option value="LINK">Link</Select.Option>
                            <Select.Option value="VIDEO">Video</Select.Option>
                            <Select.Option value="AUDIO">Audio</Select.Option>
                            <Select.Option value="DOCX">Docx</Select.Option>

                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="targetAudience"
                        label={<span className="font-semibold text-gray-700">Target Audience</span>}
                        className="flex-1"
                        rules={[{ required: true, message: 'Please select a type' }]}
                    >
                        <Select placeholder="Select" className="h-[42px] rounded-lg border-gray-200">
                            <Select.Option value="STUDENT">Student</Select.Option>
                            <Select.Option value="MENTOR">Mentor</Select.Option>
                            <Select.Option value="TEACHER">Teacher</Select.Option>
                            <Select.Option value="COORDINATOR">Coordinator</Select.Option>

                        </Select>
                    </Form.Item>


                </div>
                <Form.Item
                    name="contentUrl"
                    label={<span className="font-semibold text-gray-700">Content URL</span>}
                    className="flex-1"
                >
                    <Input placeholder="https://..." className="h-[42px] rounded-lg border-gray-200" />
                </Form.Item>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Form.Item
                        label={<span className="font-semibold text-gray-700 text-base">Targeted Groups</span>}
                        name="userGroup"
                        rules={[{ required: true, message: 'Please select a group' }]}
                    >
                        <Select placeholder="Select groups" className="custom-select-full rounded-lg min-h-[44px]">
                            {userGroups?.data?.map((group: any) => (
                                <Select.Option key={group._id} value={group._id}>
                                    {group.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.userGroup !== currentValues.userGroup}
                    >
                        {({ getFieldValue }) => {
                            const selectedGroupId = getFieldValue('userGroup');
                            const skillPathGroup = userGroups?.data?.find((g: any) => g.name === 'Skill Path');
                            const isSkillPathSelected = selectedGroupId === skillPathGroup?._id;
                            return (
                                <Form.Item
                                    label={<span className="font-semibold text-gray-700 text-base">Target Track</span>}
                                    name="userGroupTrack"
                                >
                                    <Select
                                        placeholder="Select track"
                                        disabled={!isSkillPathSelected}
                                        className="h-11 custom-select-full rounded-lg"
                                    >
                                        {userGroupsTrack?.data?.map((track: any) => (
                                            <Select.Option key={track._id} value={track._id}>
                                                {track.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                </div>
                <Form.Item
                    name="file"
                    label={<span className="text-sm font-semibold text-gray-700">Upload PDF</span>}
                >
                    <Dragger
                        className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-indigo-400 transition-colors"
                        height={180}
                        accept=".pdf"
                        beforeUpload={(file) => {
                            const isLt10M = file.size / 1024 / 1024 < 10;
                            if (!isLt10M) {
                                toast.error('File must be smaller than 10MB!');
                                return false;
                            }
                            setFile(file); // Set raw file directamente
                            return false; // Stop automatic upload
                        }}
                        onRemove={() => setFile(null)}
                        maxCount={1}
                    >
                        <div className="flex flex-col items-center justify-center py-5 px-4 text-center">
                            <InboxOutlined className="text-5xl text-indigo-500 mb-4" />
                            <p className="text-lg font-medium text-gray-700 mb-1">Click or drag PDF file here</p>
                            <p className="text-sm text-gray-500">Only PDF files are supported • Max 10 MB</p>
                        </div>
                    </Dragger>
                </Form.Item>

                <div className="flex justify-end mt-4">
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="bg-[#22C55E] hover:bg-[#16a34a] border-none px-8 h-[42px] rounded-lg font-semibold"
                    >
                        {initialValues ? 'Save Changes' : 'Create Event'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default CreateResourceModal;
