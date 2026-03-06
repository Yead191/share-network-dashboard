import React, { useEffect } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';
import { X } from 'lucide-react';
import { useUpdateAdminMentorMutation } from '../../../redux/apiSlices/admin/adminMentorsApi';
import { toast } from 'sonner';

interface EditMentorModalProps {
    open: boolean;
    onCancel: () => void;
    mentor: any;
    students: any[];
    refetch: () => void;
}

const EditMentorModal: React.FC<EditMentorModalProps> = ({ open, onCancel, mentor, students, refetch }) => {
    const [form] = Form.useForm();
    const [updateMentor, { isLoading }] = useUpdateAdminMentorMutation();

    useEffect(() => {
        if (mentor) {
            form.setFieldsValue({
                ...mentor,
                mobileNumber: mentor.mobileNumber || mentor.contactNumber,
                assignedStudents: mentor.assignedStudents?.[0]?._id || undefined,
                careerDirections: mentor.careerDirections || [],
            });
        }
    }, [mentor, form]);

    const onFinish = async (values: any) => {
        try {
            toast.promise(updateMentor({ id: mentor._id, data: values }).unwrap(), {
                loading: 'Updating mentor...',
                success: (res: any) => {
                    if (res?.success) {
                        form.resetFields();
                        refetch();
                        onCancel();
                    }
                    return res?.message || 'Mentor updated successfully';
                },
                error: (err: any) => err?.data?.message || err?.message || 'Failed to update mentor',
            });
        } catch (error: any) {
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

    return (
        <Modal
            title={<span className="text-xl font-semibold text-[#18212d]">Edit Mentor</span>}
            open={open}
            onCancel={onCancel}
            footer={null}
            closeIcon={<X size={20} />}
            width={750}
            centered
        >
            <Form form={form} layout="vertical" className="mt-4" onFinish={onFinish}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <Form.Item label={<span className="font-semibold text-gray-700">First Name</span>} name="firstName">
                        <Input placeholder="Enter first name" className="h-11 rounded-md" />
                    </Form.Item>
                    <Form.Item label={<span className="font-semibold text-gray-700">Last Name</span>} name="lastName">
                        <Input placeholder="Enter last name" className="h-11 rounded-md" />
                    </Form.Item>
                </div>

                <Form.Item label={<span className="font-semibold text-gray-700">Email</span>} name="email">
                    <Input placeholder="Enter email" className="h-11 rounded-md" />
                </Form.Item>

                <Form.Item
                    label={<span className="font-semibold text-gray-700">Assign Student</span>}
                    name="assignedStudents"
                >
                    <Select
                        placeholder="Select a student"
                        className="w-full"
                        allowClear
                        style={{ height: '44px' }}
                        options={students?.map((student: any) => ({
                            label: `${student.firstName} ${student.lastName} (${student.email})`,
                            value: student._id,
                        }))}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>

                <div className="">
                    <Form.Item label={<span className="font-semibold text-gray-700">Phone</span>} name="mobileNumber">
                        <Input placeholder="Enter phone" className="h-11 rounded-md" />
                    </Form.Item>
                    {/* <Form.Item label={<span className="font-semibold text-gray-700">vNumber</span>} name="vNumber">
                        <Input placeholder="Enter vNumber" className="h-11 rounded-md" />
                    </Form.Item> */}

                    <Form.Item
                        label={<span className="font-semibold text-gray-700">Professional Title</span>}
                        name="professionalTitle"
                    >
                        <Input placeholder="Enter title" className="h-11 rounded-md" />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-x-6">
                    <Form.Item label={<span className="font-semibold text-gray-700">Gender</span>} name="gender">
                        <Select
                            placeholder="Select gender"
                            className="h-11 rounded-md"
                            options={[
                                { label: 'Male', value: 'Male' },
                                { label: 'Female', value: 'Female' },
                                { label: 'Other', value: 'Other' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label={<span className="font-medium text-gray-700">Status</span>} name="status">
                        <Select
                            placeholder="Select status"
                            className="h-11 rounded-md"
                            options={[
                                { label: 'Pending', value: 'Pending' },
                                { label: 'Active', value: 'Active' },
                                { label: 'Non-active', value: 'Non-active' },
                                { label: 'Alumni/Graduated', value: 'Alumni/Graduated' },
                            ]}
                        />
                    </Form.Item>
                </div>
                <Form.Item
                    label={<span className="font-semibold text-gray-700">Job Title</span>}
                    name="careerDirections"
                >
                    <Select
                        mode="multiple"
                        placeholder="Select job title"
                        className="h-11 rounded-md w-full"
                        options={[
                            { label: 'App development', value: 'App development' },
                            { label: 'AI (Artificial Intelligence)', value: 'AI (Artificial Intelligence)' },
                            { label: 'Cybersecurity', value: 'Cybersecurity' },
                        ]}
                    />
                </Form.Item>

                <Form.Item label={<span className="font-semibold text-gray-700">Address</span>} name="address">
                    <Input placeholder="Enter address" className="h-11 rounded-md" />
                </Form.Item>

                <Form.Item label={<span className="font-semibold text-gray-700">About</span>} name="about">
                    <Input.TextArea placeholder="Enter about info" rows={4} className="rounded-md" />
                </Form.Item>

                <div className="flex justify-end gap-3 mt-6">
                    <Button onClick={onCancel} className="px-8 h-11 border-gray-300 rounded-md">
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        className="px-8 h-11 bg-[#52c41a] border-none hover:bg-[#73d13d] rounded-md font-semibold"
                    >
                        Update Mentor
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default EditMentorModal;
