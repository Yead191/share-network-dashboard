"use client"
import { Modal, Button, Input, Select, Form, Upload } from 'antd';
import { IoCloseOutline } from 'react-icons/io5';
import { useGetUserGroupsQuery, useGetUserGroupsTrackQuery } from '../../../redux/apiSlices/teacher/resourceSlice';
import { useState } from 'react';

interface CreateResourceModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (values: any) => void;
    initialValues?: any;
}

const CreateResourceModal: React.FC<CreateResourceModalProps> = ({ visible, onClose, onSave, initialValues }) => {
    const [form] = Form.useForm();
    const { data: userGroups } = useGetUserGroupsQuery({ page: 1, limit: 10 });
    const { data: userGroupsTrack } = useGetUserGroupsTrackQuery({ page: 1, limit: 10 }); 
      const [file, setFile] = useState<any | null>(null); 
      console.log(file);
    const handleOk = () => {
        form.validateFields().then((values) => {
            onSave(values);
            form.resetFields();
            onClose();
        });
    };

    if (visible && initialValues) {
        form.setFieldsValue(initialValues);
    }
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
            <Form form={form} layout="vertical" className="mt-6">
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

                <div className="flex justify-end mt-4">
                    <Button
                        type="primary"
                        onClick={handleOk}
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
