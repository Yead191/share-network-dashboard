import React from 'react';
import { Modal, Button, Form, Input, Select, Row, Col } from 'antd';
import { X } from 'lucide-react';
import { useAddTeacherMutation } from '../../../redux/apiSlices/admin/adminTeachersApi';
import { toast } from 'sonner';

interface AddTeacherModalProps {
    open: boolean;
    onCancel: () => void;
    refetch: () => void;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ open, onCancel, refetch }) => {
    const [form] = Form.useForm();
    const [addTeacher, { isLoading }] = useAddTeacherMutation();

    const onFinish = async (values: any) => {
        try {
            toast.promise(addTeacher({ data: { ...values, role: 'TEACHER' } }).unwrap(), {
                loading: 'Creating teacher...',
                success: (res: any) => {
                    if (res?.success) {
                        refetch();
                        form.resetFields();
                        onCancel();
                    }
                    return res?.message || 'Teacher created successfully';
                },
                error: (err: any) => err?.message || 'Failed to create teacher',
            });
        } catch (error: any) {
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

    return (
        <Modal
            title={<span className="text-xl font-semibold text-gray-800">Create Teacher Profile</span>}
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
                initialValues={{ role: 'TEACHER', gender: 'Male' }}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label={<span className="font-semibold text-gray-700">First Name</span>}
                            name="firstName"
                            rules={[{ required: true, message: 'Please input first name!' }]}
                        >
                            <Input placeholder="Enter first name" className="h-11 rounded-md" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<span className="font-semibold text-gray-700">Last Name</span>}
                            name="lastName"
                            rules={[{ required: true, message: 'Please input last name!' }]}
                        >
                            <Input placeholder="Enter last name" className="h-11 rounded-md" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={24}>
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
                        {/* <Form.Item label={<span className="font-semibold text-gray-700">vNumber</span>} name="vNumber">
                            <Input placeholder="Enter vNumber (optional)" className="h-11 rounded-md" />
                        </Form.Item> */}
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label={<span className="font-semibold text-gray-700">Contact Number</span>}
                            name="contactNumber"
                            rules={[{ required: true, message: 'Please input contact number!' }]}
                        >
                            <Input placeholder="Enter contact number" className="h-11 rounded-md" />
                        </Form.Item>
                    </Col>
                    {/* <Col span={12}>
                        <Form.Item label={<span className="font-semibold text-gray-700">vNumber</span>} name="vNumber">
                            <Input placeholder="Enter vNumber (optional)" className="h-11 rounded-md" />
                        </Form.Item>
                    </Col> */}
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
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
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<span className="font-semibold text-gray-700">Role</span>} name="role">
                            <Input disabled className="h-11 rounded-md" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
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
                    </Col>
                    <Col span={12}>
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
                    </Col>
                </Row>

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
                        Create Profile
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddTeacherModal;
