import React from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';
import { X } from 'lucide-react';
import { useAddMentorMutation } from '../../../redux/apiSlices/admin/adminMentorsApi';
import { toast } from 'sonner';

interface AddMentorModalProps {
    open: boolean;
    onCancel: () => void;
    refetch: () => void;
}

const AddMentorModal: React.FC<AddMentorModalProps> = ({ open, onCancel, refetch }) => {
    const [form] = Form.useForm();
    const [addMentor, { isLoading }] = useAddMentorMutation();

    const onFinish = async (values: any) => {
        try {
            toast.promise(addMentor({ data: { ...values, role: 'MENTOR' } }).unwrap(), {
                loading: 'Creating mentor...',
                success: (res: any) => {
                    if (res?.success) {
                        refetch();
                        form.resetFields();
                        onCancel();
                    }
                    return res?.message || 'Mentor created successfully';
                },
                error: (err: any) => err?.data?.message || err?.message || 'Failed to create mentor',
            });
        } catch (error: any) {
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

    return (
        <Modal
            title={<span className="text-xl font-semibold text-gray-800">Create Mentor Profile</span>}
            open={open}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            footer={null}
            closeIcon={<X size={20} />}
            width={800}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="mt-6"
                initialValues={{ role: 'MENTOR', gender: 'Male', havealaptop: true }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <Form.Item
                        label={<span className="font-semibold text-gray-700">First Name</span>}
                        name="firstName"
                        rules={[{ required: true, message: 'Please input first name!' }]}
                    >
                        <Input placeholder="Enter first name" className="h-11 rounded-md" />
                    </Form.Item>
                    <Form.Item
                        label={<span className="font-semibold text-gray-700">Last Name</span>}
                        name="lastName"
                        rules={[{ required: true, message: 'Please input last name!' }]}
                    >
                        <Input placeholder="Enter last name" className="h-11 rounded-md" />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <Form.Item
                        label={<span className="font-semibold text-gray-700">Email</span>}
                        name="email"
                        rules={[
                            { required: true, message: 'Please input email!' },
                            { type: 'email', message: 'Please enter a valid email!' },
                        ]}
                    >
                        <Input placeholder="Enter email address" className="h-11 rounded-md" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-semibold text-gray-700">Contact Number</span>}
                        name="contactNumber"
                        rules={[{ required: true, message: 'Please input contact number!' }]}
                    >
                        <Input placeholder="Enter contact number" className="h-11 rounded-md" />
                    </Form.Item>
                    {/* <Form.Item
                        label={<span className="font-semibold text-gray-700">Highest Education</span>}
                        name="highestEducation"
                    >
                        <Input placeholder="e.g. Master's in CS" className="h-11 rounded-md" />
                    </Form.Item> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <Form.Item
                        label={<span className="font-semibold text-gray-700">Gender</span>}
                        name="gender"
                        rules={[{ required: true, message: 'Please select gender!' }]}
                    >
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
                    <Form.Item label={<span className="font-semibold text-gray-700">Role</span>} name="role">
                        <Input disabled className="h-11 rounded-md" />
                    </Form.Item>
                </div>

                <Form.Item label={<span className="font-semibold text-gray-700">job Title</span>} name="jobTitle">
                    <Input placeholder="Enter job title" className="h-11 rounded-md" />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <Form.Item
                        label={<span className="font-semibold text-gray-700">Password</span>}
                        name="password"
                        rules={[
                            { required: true, message: 'Please input password!' },
                            { min: 8, message: 'Password must be at least 8 characters!' },
                        ]}
                    >
                        <Input.Password placeholder="Enter password" title="Password" className="h-11 rounded-md" />
                    </Form.Item>
                    <Form.Item
                        label={<span className="font-semibold text-gray-700">Confirm Password</span>}
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Confirm password"
                            title="Confirm Password"
                            className="h-11 rounded-md"
                        />
                    </Form.Item>
                </div>

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
                        Create Mentor
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddMentorModal;
