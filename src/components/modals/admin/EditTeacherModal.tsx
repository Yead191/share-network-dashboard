import React, { useEffect } from 'react';
import { Modal, Button, Form, Input, Select, Row, Col } from 'antd';
import { X } from 'lucide-react';
import { useUpdateTeacherMutation } from '../../../redux/apiSlices/admin/adminTeachersApi';
import { toast } from 'sonner';

interface EditTeacherModalProps {
    open: boolean;
    onCancel: () => void;
    teacher: any;
    students: any[];
    refetch: () => void;
    userGroups: any[];
    userTracks: any[];
    isUserGroupsLoading: boolean;
    isUserTracksLoading: boolean;
}

const EditTeacherModal: React.FC<EditTeacherModalProps> = ({
    open,
    onCancel,
    teacher,
    students,
    refetch,
    userGroups,
    userTracks,
    isUserGroupsLoading,
    isUserTracksLoading,
}) => {
    const [form] = Form.useForm();
    const [updateTeacher, { isLoading }] = useUpdateTeacherMutation();
    const selectedGroups = Form.useWatch('userGroup', form);

    const isSkillPathSelected = () => {
        if (!selectedGroups || !userGroups) return false;
        // Handle both single string and array (multiple mode)
        const currentGroups = Array.isArray(selectedGroups) ? selectedGroups : [selectedGroups];
        return currentGroups.some((groupId: string) => {
            const group = userGroups.find((g: any) => g._id === groupId);
            return group?.name === 'Skill Path';
        });
    };
    useEffect(() => {
        if (teacher) {
            form.setFieldsValue({
                ...teacher,
                phone: teacher.mobileNumber || teacher.phone,
                assignedStudents: teacher.assignedStudents?.map((s: any) => s._id) || [],
                userGroup: teacher.userGroup?.map((g: any) => g._id) || [],
                userGroupTrack: teacher.userGroupTrack?._id || teacher.userGroupTrack,
                status: teacher?.status,
            });
        }
    }, [teacher, form]);

    const onFinish = async (values: any) => {
        // console.log(values);

        try {
            toast.promise(
                updateTeacher({
                    id: teacher._id,
                    data: values,
                }).unwrap(),
                {
                    loading: 'Updating teacher...',
                    success: (res: any) => {
                        if (res?.success) {
                            refetch();
                            onCancel();
                        }
                        return res?.message || 'Teacher updated successfully';
                    },
                    error: (err: any) => err?.message || 'Failed to update teacher',
                },
            );
        } catch (error: any) {
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

    return (
        <Modal
            title={<span className="text-xl font-semibold">Edit Teacher</span>}
            open={open}
            onCancel={onCancel}
            footer={null}
            closeIcon={<X size={20} />}
            width={1000}
            centered
        >
            <Form form={form} layout="vertical" className="mt-6" onFinish={onFinish}>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label={<span className="font-semibold text-gray-700">First Name</span>}
                            name="firstName"
                        >
                            <Input placeholder="Enter first name" className="h-11 rounded-md" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<span className="font-semibold text-gray-700">Last Name</span>}
                            name="lastName"
                        >
                            <Input placeholder="Enter last name" className="h-11 rounded-md" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label={<span className="font-semibold text-gray-700">Email</span>} name="email">
                    <Input placeholder="Enter email" className="h-11 rounded-md" />
                </Form.Item>

                <div className="grid grid-cols-2 gap-x-6">
                    <Form.Item
                        label={<span className="font-bold text-gray-700">Select Group</span>}
                        name="userGroup"
                        rules={[{ required: false, message: 'Please select at least one group' }]}
                    >
                        <Select
                            placeholder="Choose groups"
                            className="h-11 rounded-md"
                            variant="filled"
                            style={{ backgroundColor: '#f9f9f9' }}
                            loading={isUserGroupsLoading}
                            options={userGroups?.map((g: any) => ({
                                label: g.name,
                                value: g._id,
                            }))}
                            allowClear
                        />
                    </Form.Item>
                    {isSkillPathSelected() && (
                        <Form.Item
                            label={<span className="font-bold text-gray-700">Select Track</span>}
                            name="userGroupTrack"
                            rules={[{ required: false, message: 'Please select a track' }]}
                        >
                            <Select
                                placeholder="Choose a track"
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                                loading={isUserTracksLoading}
                                options={userTracks?.map((t: any) => ({
                                    label: t.name,
                                    value: t._id,
                                }))}
                                allowClear
                            />
                        </Form.Item>
                    )}
                </div>

                <Form.Item
                    label={<span className="font-semibold text-gray-700">Assign Students</span>}
                    name="assignedStudents"
                >
                    <Select
                        mode="multiple"
                        placeholder="Select students"
                        className="w-full"
                        style={{ height: 'auto', minHeight: '44px' }}
                        options={students?.map((student: any) => ({
                            label: `${student.firstName} ${student.lastName} (${student.email})`,
                            value: student._id,
                        }))}
                        filterOption={(input, option) =>
                            String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>

                <Row gutter={24}>

                    <Col span={12}>
                        {/* <Form.Item label={<span className="font-semibold text-gray-700">vNumber</span>} name="vNumber">
                            <Input placeholder="Enter vNumber" className="h-11 rounded-md" />
                        </Form.Item> */}
                        <Form.Item label={<span className="font-medium text-gray-700">Status</span>} name="status">
                            <Select
                                placeholder="Select status"
                                className="h-11 rounded-md"
                                options={[
                                    { label: 'PENDING', value: 'PENDING' },
                                    { label: 'ACTIVE', value: 'ACTIVE' },
                                    { label: 'NON-ACTIVE', value: 'NON_ACTIVE' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<span className="font-medium text-gray-700">Verified</span>} name="verified">
                            <Select
                                className="h-11 rounded-md"
                                options={[
                                    { label: 'Yes', value: true },
                                    { label: 'No', value: false },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
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
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<span className="font-semibold text-gray-700">Phone</span>}
                            name="mobileNumber"
                        >
                            <Input placeholder="Enter phone" className="h-11 rounded-md" />
                        </Form.Item>
                    </Col>
                </Row>

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
                        Update Teacher
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default EditTeacherModal;
