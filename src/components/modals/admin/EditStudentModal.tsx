import React, { useEffect } from 'react';
import { Modal, Button, Form, Select, Row, Col, Input } from 'antd';
import { X } from 'lucide-react';
import { useUpdateStudentMutation } from '../../../redux/apiSlices/admin/adminStudentApi';
import { toast } from 'sonner';

interface EditStudentModalProps {
    open: boolean;
    onCancel: () => void;
    student: any;
    refetch: () => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({ open, onCancel, student, refetch }) => {
    const [form] = Form.useForm();
    const [updateStudent, { isLoading }] = useUpdateStudentMutation();

    useEffect(() => {
        if (student) {
            form.setFieldsValue({
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                contactNumber: student.contactNumber,
                vNumber: student.vNumber,
                highestEducation: student.highestEducation,
                verified: student.verified,
                gender: student.gender,
                status: student.status,
            });
        }
    }, [student, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const promise = updateStudent({ id: student._id, data: values }).unwrap();

            toast.promise(promise, {
                loading: 'Updating student...',
                success: (res) => {
                    if (res?.success) {
                        refetch();
                        onCancel();
                        form.resetFields();
                        return res?.message || 'Student updated successfully!';
                    }
                },
                error: (err: any) => err?.data?.message || 'Failed to update student',
            });
            await promise;
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <Modal
            title={<span className="text-2xl font-bold text-gray-800">Edit Student</span>}
            open={open}
            onCancel={onCancel}
            footer={[
                <Button
                    key="cancel"
                    onClick={onCancel}
                    className="px-10 h-10 border-gray-100 text-gray-600 rounded-md font-medium"
                >
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    loading={isLoading}
                    className="px-10 h-10 bg-[#52c41a] border-none hover:bg-[#73d13d] rounded-md font-medium"
                >
                    Update Student
                </Button>,
            ]}
            closeIcon={<X size={20} />}
            width={700}
            centered
        >
            <Form form={form} layout="vertical" className="mt-8">
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label={<span className="font-bold text-gray-700">First Name</span>} name="firstName">
                            <Input
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<span className="font-bold text-gray-700">Last Name</span>} name="lastName">
                            <Input
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label={<span className="font-bold text-gray-700">Email</span>} name="email">
                            <Input
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<span className="font-bold text-gray-700">Contact Number</span>}
                            name="contactNumber"
                        >
                            <Input
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    {/* <Col span={12}>
                        <Form.Item label={<span className="font-bold text-gray-700">V Number</span>} name="vNumber">
                            <Input
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Form.Item>
                    </Col> */}
                    <Col span={24}>
                        <Form.Item
                            label={<span className="font-bold text-gray-700">Highest Education</span>}
                            name="highestEducation"
                        >
                            <Input
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label={<span className="font-bold text-gray-700">Gender</span>} name="gender">
                            <Select
                                placeholder="Select gender"
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                                options={[
                                    { label: 'Male', value: 'Male' },
                                    { label: 'Female', value: 'Female' },
                                    { label: 'Other', value: 'Other' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<span className="font-bold text-gray-700">Status</span>} name="status">
                            <Select
                                placeholder="Select status"
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                                options={[
                                    { label: 'Pending', value: 'Pending' },
                                    { label: 'Active', value: 'Active' },
                                    { label: 'Non-active', value: 'Non-active' },
                                    { label: 'Alumni/Graduated', value: 'Alumni/Graduated' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default EditStudentModal;
