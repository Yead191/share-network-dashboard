import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Upload, Button, Switch, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useGetUserGroupsQuery, useGetUserGroupsTrackQuery } from '../../../../redux/apiSlices/teacher/resourceSlice';

interface CreateAssignmentModalProps {
    open: boolean;
    onCancel: () => void;
    onFinish: (values: any) => void;
    setFile: (file: any) => void;
    initialValues?: any;
    mode: 'create' | 'edit';
}

const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
    open,
    onCancel,
    onFinish,
    initialValues,
    mode,
    setFile,
}) => {
    const { data: userGroups } = useGetUserGroupsQuery({ page: 1, limit: 10 });
    const { data: userGroupsTrack } = useGetUserGroupsTrackQuery({ page: 1, limit: 10 });
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialValues) {
                const isUrl = initialValues.attachment?.startsWith('http');
                form.setFieldsValue({
                    ...initialValues,
                    dueDate: initialValues.dueDate ? dayjs(initialValues.dueDate) : null,
                    userGroup: initialValues.targets?.map((t: any) => t._id),
                    userGroupTrack: initialValues?.type?._id,
                    totalPoint: initialValues.points,
                    published: initialValues.published,
                    attachmentType: isUrl ? 'url' : 'file',
                    attachmentUrl: isUrl ? initialValues.attachment : undefined,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, mode, initialValues, form]);

    const handleSubmit = () => {
        form.validateFields()
            .then((values) => {
                onFinish({
                    ...values,
                    dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD HH:mm') : null,
                    id: mode === 'edit' ? initialValues.key : undefined,
                });
                onCancel();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title={
                <span className="text-xl font-bold text-gray-800">
                    {mode === 'edit' ? 'Edit Assignment' : 'Create New Assignment'}
                </span>
            }
            open={open}
            onCancel={onCancel}
            footer={null}
            width={700}
            centered
            closeIcon={<PlusOutlined className="rotate-45" />}
        >
            <Form form={form} layout="vertical" className="mt-6">
                <Form.Item
                    label={<span className="font-semibold text-gray-700 text-base">Title</span>}
                    name="title"
                    rules={[{ required: true, message: 'Please enter a title' }]}
                >
                    <Input placeholder="Enter title" className="h-11 rounded-lg bg-gray-50 border-gray-100" />
                </Form.Item>

                <Form.Item
                    label={<span className="font-semibold text-gray-700 text-base">Description</span>}
                    name="description"
                    rules={[{ required: true, message: 'Please enter a description' }]}
                >
                    <Input.TextArea
                        placeholder="Write description..."
                        rows={4}
                        className="rounded-lg bg-gray-50 border-gray-100 py-3"
                    />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        label={<span className="font-semibold text-gray-700 text-base">Published</span>}
                        name="published"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        label={<span className="font-semibold text-gray-700 text-base">Status</span>}
                        name="status"
                        initialValue="PENDING"
                    >
                        <Select className="h-11 custom-select-full rounded-lg">
                            <Select.Option value="PENDING">Pending</Select.Option>
                            <Select.Option value="IN_PROGRESS">In Progress</Select.Option>
                            <Select.Option value="COMPLETED">Completed</Select.Option>
                        </Select>
                    </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Form.Item
                        label={<span className="font-semibold text-gray-700 text-base">Targeted Groups</span>}
                        name="userGroup"
                        rules={[{ required: true, message: 'Please select a group' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select groups"
                            className="custom-select-full rounded-lg !h-[44px]"
                        >
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        label={<span className="font-semibold text-gray-700 text-base">Due Date</span>}
                        name="dueDate"
                        rules={[{ required: true, message: 'Please select a due date' }]}
                    >
                        <DatePicker
                            placeholder="YYYY-MM-DD HH:mm"
                            className="w-full h-11 rounded-lg bg-gray-50 border-gray-100"
                            format="YYYY-MM-DD HH:mm"
                            showTime={{ format: 'HH:mm' }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={<span className="font-semibold text-gray-700 text-base">Total Points</span>}
                        name="totalPoint"
                        initialValue={100}
                    >
                        <Input type="number" placeholder="100" className="h-11 rounded-lg bg-gray-50 border-gray-100" />
                    </Form.Item>
                </div>

                <div className="mt-4">
                    <Form.Item
                        label={<span className="font-semibold text-gray-700 text-base">Attachment Type</span>}
                        name="attachmentType"
                        initialValue="file"
                    >
                        <Radio.Group className="flex gap-4">
                            <Radio value="file">File Upload</Radio>
                            <Radio value="url">Assignment URL</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.attachmentType !== currentValues.attachmentType
                        }
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('attachmentType') === 'file' ? (
                                <Form.Item
                                    label={<span className="font-semibold text-gray-700 text-base">Upload File</span>}
                                    name="attachment"
                                >
                                    <Upload.Dragger
                                        maxCount={1}
                                        beforeUpload={() => false}
                                        onChange={(info) => {
                                            if (info.file.status === 'removed') {
                                                setFile(null);
                                            } else if (info.fileList.length > 0) {
                                                setFile(
                                                    info.fileList[0].originFileObj ||
                                                        info.file.originFileObj ||
                                                        info.file,
                                                );
                                            }
                                        }}
                                        className="rounded-xl border-dashed border-2 border-gray-200 bg-gray-50 py-4"
                                    >
                                        <p className="ant-upload-text text-gray-400 font-medium text-sm">
                                            Choose file (PDF/Images/Docs)
                                        </p>
                                    </Upload.Dragger>
                                </Form.Item>
                            ) : (
                                <Form.Item
                                    label={
                                        <span className="font-semibold text-gray-700 text-base">Assignment URL</span>
                                    }
                                    name="attachmentUrl"
                                    rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
                                >
                                    <Input
                                        placeholder="https://example.com/assignment"
                                        className="h-11 rounded-lg bg-gray-50 border-gray-100"
                                    />
                                </Form.Item>
                            )
                        }
                    </Form.Item>
                </div>

                <div className="flex justify-end mt-8">
                    <Button
                        type="primary"
                        className="bg-[#21C35D] hover:bg-[#1da950] h-12 px-10 rounded-xl font-bold text-lg border-none"
                        onClick={handleSubmit}
                    >
                        {mode === 'edit' ? 'Update Assignment' : 'Create Assignment'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default CreateAssignmentModal;
