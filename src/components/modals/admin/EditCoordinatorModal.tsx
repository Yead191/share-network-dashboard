import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { X } from 'lucide-react';
import { useUpdateCoordinatorMutation } from '../../../redux/apiSlices/admin/adminCoordinatorApi';
import { toast } from 'sonner';

interface EditCoordinatorModalProps {
    open: boolean;
    onCancel: () => void;
    refetch: () => void;
    coordinator: any | null;
    mentors: any[] | null;
}

const EditCoordinatorModal: React.FC<EditCoordinatorModalProps> = ({
    open,
    onCancel,
    refetch,
    coordinator,
    mentors,
}) => {
    const [form] = Form.useForm();
    const [updateCoordinator, { isLoading }] = useUpdateCoordinatorMutation();

    useEffect(() => {
        if (open && coordinator) {
            form.setFieldsValue({
                firstName: coordinator.firstName,
                lastName: coordinator.lastName,
                email: coordinator.email,
                contactNumber: coordinator.contactNumber,
                gender: coordinator.gender,
                status: coordinator.status,
                assignedMentors: coordinator.assignedMentors?.map((m: any) => m._id) || [],
            });
        }
    }, [open, coordinator, form]);

    const handleSubmit = async (values: any) => {
        try {
            if (!coordinator?._id) return;

            const res = await updateCoordinator({ id: coordinator._id, data: values }).unwrap();

            if (res?.success) {
                toast.success(res?.message || 'Coordinator updated successfully');
                refetch();
                onCancel();
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update coordinator');
        }
    };

    const handleModalCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">Edit Coordinator</h2>
                    <button
                        onClick={handleModalCancel}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
            }
            open={open}
            onCancel={handleModalCancel}
            footer={null}
            closeIcon={null}
            width={600}
            className="custom-modal"
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please enter first name' }]}
                    >
                        <Input size="large" placeholder="Enter first name" />
                    </Form.Item>

                    <Form.Item name="lastName" label="Last Name">
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
                        <Input size="large" placeholder="Enter email address" disabled />
                    </Form.Item>

                    <Form.Item name="contactNumber" label="Contact Number">
                        <Input size="large" placeholder="Enter contact number" />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item name="gender" label="Gender">
                        <Select size="large" placeholder="Select gender">
                            <Select.Option value="Male">Male</Select.Option>
                            <Select.Option value="Female">Female</Select.Option>
                            <Select.Option value="Other">Other</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="status" label="Status">
                        <Select size="large" placeholder="Select status">
                            <Select.Option value="PENDING">Pending</Select.Option>
                            <Select.Option value="ACTIVE">Active</Select.Option>
                            <Select.Option value="NON_ACTIVE">Non-Active</Select.Option>
                            <Select.Option value="ALUMNI_GRADUATED">Alumni/Graduated</Select.Option>
                        </Select>
                    </Form.Item>
                </div>

                <div className="w-full">
                    <Form.Item name="assignedMentors" label="Assign Mentors">
                        <Select
                            mode="multiple"
                            size="large"
                            showSearch
                            placeholder="Select mentors to assign"
                            filterOption={(input, option) =>
                                (option?.label ?? '')?.toString().toLowerCase().includes(input.toLowerCase())
                            }
                            options={
                                mentors?.map((mentor) => ({
                                    value: mentor._id,
                                    label: `${mentor.firstName} ${mentor.lastName}`,
                                })) || []
                            }
                            className="w-full"
                        />
                    </Form.Item>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                    <Button onClick={handleModalCancel} className="h-10 px-6 font-medium border-gray-200">
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        className="h-10 px-6 font-medium bg-[#52c41a] hover:bg-[#73d13d] border-none"
                    >
                        Save Changes
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default EditCoordinatorModal;
