import React from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { X } from 'lucide-react';
import { useCreateCoordinatorMutation } from '../../../redux/apiSlices/admin/adminCoordinatorApi';
import { toast } from 'sonner';

interface CreateCoordinatorModalProps {
    open: boolean;
    onCancel: () => void;
    refetch: () => void;
}

const CreateCoordinatorModal: React.FC<CreateCoordinatorModalProps> = ({ open, onCancel, refetch }) => {
    const [form] = Form.useForm();
    const [createCoordinator, { isLoading }] = useCreateCoordinatorMutation();

    const handleSubmit = async (values: any) => {
        try {
            if (values.password !== values.confirmPassword) {
                message.error('Passwords do not match');
                return;
            }

            const { confirmPassword, ...submitData } = values;

            const res = await createCoordinator({ data: submitData }).unwrap();

            if (res?.success) {
                toast.success(res?.message || 'Coordinator created successfully');
                form.resetFields();
                refetch();
                onCancel();
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to create coordinator');
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">Create Coordinator</h2>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
            }
            open={open}
            onCancel={onCancel}
            footer={null}
            closeIcon={null}
            width={600}
            className="custom-modal"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="mt-6"
                initialValues={{ role: 'COORDINATOR' }}
            >
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please enter first name' }]}
                    >
                        <Input size="large" placeholder="Enter first name" />
                    </Form.Item>

                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please enter last name' }]}
                    >
                        <Input size="large" placeholder="Enter last name" />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                            { required: true, message: 'Please enter email' },
                            { type: 'email', message: 'Please enter a valid email' },
                        ]}
                    >
                        <Input size="large" placeholder="Enter email address" />
                    </Form.Item>

                    <Form.Item
                        name="contactNumber"
                        label="Contact Number"
                        rules={[{ required: true, message: 'Please enter contact number' }]}
                    >
                        <Input size="large" placeholder="Enter contact number" />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[{ required: true, message: 'Please select gender' }]}
                    >
                        <Select size="large" placeholder="Select gender">
                            <Select.Option value="Male">Male</Select.Option>
                            <Select.Option value="Female">Female</Select.Option>
                            <Select.Option value="Other">Other</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="role" label="Role" hidden>
                        <Input />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please enter password' }]}
                    >
                        <Input.Password size="large" placeholder="Enter password" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        rules={[{ required: true, message: 'Please confirm password' }]}
                    >
                        <Input.Password size="large" placeholder="Confirm password" />
                    </Form.Item>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                    <Button onClick={onCancel} className="h-10 px-6 font-medium border-gray-200">
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        className="h-10 px-6 font-medium bg-[#52c41a] hover:bg-[#73d13d] border-none"
                    >
                        Create Coordinator
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default CreateCoordinatorModal;
