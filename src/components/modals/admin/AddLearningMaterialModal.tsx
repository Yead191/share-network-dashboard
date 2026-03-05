import { Modal, Input, Select, Checkbox, Form, Button, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAddMaterialsMutation, useUpdateMaterialsMutation } from '../../../redux/apiSlices/admin/adminMaterialsApi';
import { toast } from 'sonner';
import { useGetAllUserGroupTracksQuery } from '../../../redux/apiSlices/userGroupTrackSlice';
import Dragger from 'antd/es/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
interface AddLearningMaterialModalProps {
    open: boolean;
    onCancel: () => void;
    refetch: () => void;
    selectedMaterial: any;
}

const AddLearningMaterialModal = ({ open, onCancel, refetch, selectedMaterial }: AddLearningMaterialModalProps) => {
    const [form] = Form.useForm();
    const [addMaterial, { isLoading }] = useAddMaterialsMutation();
    const [editMaterial, { isLoading: isEditLoading }] = useUpdateMaterialsMutation();
    const { data: userGroupTracks } = useGetAllUserGroupTracksQuery(undefined, { skip: !open });
    const [file, setFile] = useState<any | null>(null);
    useEffect(() => {
        if (open && selectedMaterial) {
            form.setFieldsValue({
                title: selectedMaterial?.title,
                description: selectedMaterial?.description,
                type: selectedMaterial?.type,
                contentUrl: selectedMaterial?.url,
                targetAudience: selectedMaterial?.targetAudience,
                targertGroup: selectedMaterial?.target?._id || selectedMaterial?.target,
                markAsAssigned: selectedMaterial?.status === 'Active',
            });
        } else if (open && !selectedMaterial) {
            form.resetFields();
        }
    }, [open, selectedMaterial, form]);

    const onFinish = async (values: Record<string, any>) => {
        try {

            const finalData = {
                ...values,
                markAsAssigned: !!values.markAsAssigned,
            };
            const formdata = new FormData();
            for(const key in finalData){
                formdata.append(key, String(finalData[key as keyof typeof finalData]));
            }
            if (file) {
                formdata.append('file', file.file.originFileObj);
            }
            const mutation = selectedMaterial?._id
                ? editMaterial({ id: selectedMaterial._id, data: formdata }).unwrap()
                : addMaterial(formdata).unwrap();

            toast.promise(mutation, {
                loading: selectedMaterial?._id ? 'Updating material...' : 'Creating material...',

                success: (res: any) => {
                    if (res?.success) {
                        refetch();
                        form.resetFields();
                        setFile(null);
                        onCancel();
                    }
                    return (
                        res?.message || `Class schedule ${selectedMaterial?._id ? 'updated' : 'created'} successfully`
                    );
                },
                error: (err: any) =>
                    err?.message || `Failed to ${selectedMaterial?._id ? 'update' : 'create'} class schedule`,
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
                        rows={5}
                    />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item name="type" label={<span className="text-sm font-semibold text-gray-700">Type</span>}>
                        <Select placeholder="Select" className="w-full h-11">
                            <Select.Option value="PDF">PDF</Select.Option>
                            <Select.Option value="DOCX">DOCX</Select.Option>
                            <Select.Option value="VIDEO">VIDEO</Select.Option>
                            <Select.Option value="AUDIO">AUDIO</Select.Option>
                            <Select.Option value="LINK">LINK</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="contentUrl"
                        label={<span className="text-sm font-semibold text-gray-700">Content URL</span>}
                    >
                        <Input placeholder="https://..." className="h-11 rounded-lg border-gray-200" />
                    </Form.Item>
                </div>
                <div className="">
                    <Form.Item name="file" label={<span className="text-sm font-semibold text-gray-700">Upload PDF</span>}>
                        <Dragger
                            className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-indigo-400 transition-colors"
                            height={180}
                            accept=".pdf"
                            onChange={(v)=>setFile(v)}
                        >
                            <div className="flex flex-col items-center justify-center py-5 px-4 text-center">
                                <InboxOutlined className="text-5xl text-indigo-500 mb-4" />
                                <p className="text-lg font-medium text-gray-700 mb-1">Click or drag PDF file here</p>
                                <p className="text-sm text-gray-500">Only PDF files are supported • Max 10 MB</p>
                            </div>
                        </Dragger>
                    </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        name="targetAudience"
                        label={<span className="text-sm font-semibold text-gray-700">Target Audience</span>}
                    >
                        <Select placeholder="Select" className="w-full h-11">
                            <Select.Option value="STUDENT">STUDENT</Select.Option>
                            <Select.Option value="MENTOR">MENTOR</Select.Option>
                            <Select.Option value="TEACHER">TEACHER</Select.Option>
                            <Select.Option value="COORDINATOR">COORDINATOR</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="targertGroup"
                        label={<span className="text-sm font-semibold text-gray-700">Target Group</span>}
                    >
                        <Select
                            placeholder="Select group"
                            className="w-full h-11"
                            options={userGroupTracks?.data?.map((track: any) => ({
                                value: track._id,
                                label: track.name,
                            }))}
                        />
                    </Form.Item>
                </div>

                <Form.Item name="markAsAssigned" valuePropName="checked">
                    <Checkbox className="text-gray-600">Mark as Assigned</Checkbox>
                </Form.Item>

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

export default AddLearningMaterialModal;
