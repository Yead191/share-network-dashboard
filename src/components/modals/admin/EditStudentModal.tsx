import React, { useEffect } from 'react';
import { Modal, Button, Form, Select, Row, Col, Input, Checkbox } from 'antd';
import { X } from 'lucide-react';
import {
    useUpdateStudentMutation,
    useGetUserGroupsQuery,
    useGetUserTracksQuery,
} from '../../../redux/apiSlices/admin/adminStudentApi';
import { toast } from 'sonner';
import dayjs from 'dayjs';

interface EditStudentModalProps {
    open: boolean;
    onCancel: () => void;
    student: any;
    refetch: () => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({ open, onCancel, student, refetch }) => {
    const [form] = Form.useForm();
    const [updateStudent, { isLoading }] = useUpdateStudentMutation();
    const { data: userGroupsApi } = useGetUserGroupsQuery({});
    const { data: userTracksApi } = useGetUserTracksQuery({});
    const userGroups = userGroupsApi?.data || [];
    const userTracks = userTracksApi?.data || [];

    useEffect(() => {
        if (student) {
            form.setFieldsValue({
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                contactNumber: student.contactNumber,
                vNumber: student.vNumber,
                highestEducation: student.highestEducation,
                gender: student.gender,
                status: student.status,
                userGroup: student.userGroup?.map((g: any) => g._id || g),
                userGroupTrack: student.userGroupTrack?._id || student.userGroupTrack,
                about: student.about,
                birthDate: student.birthDate ? dayjs(student.birthDate) : null,
                programmingExperience: student.programmingExperience,
                note: student.note,
                careerDirections: student.careerDirections,
                aviliableHours: student.aviliableHours,
                havealaptop: student.havealaptop ? 'Yes' : 'No',
                city: student.address?.split(', ')[0] || '',
                zipCode: student.zipCode,
                streetAddress: student.address?.split(', ').slice(1).join(', ') || '',
                contactPerson: student.contactPerson,
                linkedInProfile: student.linkedInProfile,
                githubProfile: student.githubProfile,
                PortfolioWebsite: student.PortfolioWebsite,
                adminNote: student.adminNote,
            });
        }
    }, [student, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const processedValues = {
                ...values,
                havealaptop: values.havealaptop === 'Yes',
                address: `${values.city}, ${values.streetAddress}`,
                birthDate: values.birthDate ? values.birthDate.toISOString() : null,
            };

            const promise = updateStudent({ id: student._id, data: processedValues }).unwrap();

            toast.promise(promise, {
                loading: 'Updating student...',
                success: (res) => {
                    if (res?.success) {
                        refetch();
                        onCancel();
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
            title={<span className="text-[22px] font-semibold text-gray-800">Edit Student</span>}
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel} className="px-10 h-10 border-gray-100 text-gray-600 rounded-md">
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
            <Form form={form} layout="vertical" className="mt-4 max-h-[70vh] px-4 overflow-y-auto  custom-scrollbar">
                {/* Basic Info */}
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label={<span className="font-medium text-gray-700">First Name</span>}
                            name="firstName"
                        >
                            <Input
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<span className="font-medium text-gray-700">Last Name</span>} name="lastName">
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
                        <Form.Item label={<span className="font-medium text-gray-700">Email</span>} name="email">
                            <Input
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<span className="font-medium text-gray-700">Contact Number</span>}
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
                    <Col span={12}>
                        <Form.Item label={<span className="font-medium text-gray-700">Group</span>} name="userGroup">
                            <Select
                                placeholder="Select Group"
                                mode="multiple"
                                className="h-11 rounded-md"
                                options={userGroups.map((g: any) => ({ label: g.name, value: g._id }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<span className="font-medium text-gray-700">Track</span>}
                            name="userGroupTrack"
                        >
                            <Select
                                placeholder="Select track"
                                className="h-11 rounded-md"
                                options={userTracks.map((t: any) => ({ label: t.name, value: t._id }))}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label={<span className="font-medium text-gray-700">About</span>} name="about">
                    <Input.TextArea
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="rounded-md"
                        variant="filled"
                        style={{ backgroundColor: '#f9f9f9' }}
                    />
                </Form.Item>

                <Row gutter={24}>
                    <Col span={12}>
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
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<span className="font-medium text-gray-700">Gender</span>} name="gender">
                            <Select
                                className="h-11 rounded-md"
                                options={[
                                    { label: 'Male', value: 'Male' },
                                    { label: 'Female', value: 'Female' },
                                    { label: 'Other', value: 'Other' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label={<span className="font-medium text-gray-700">Highest Education</span>}
                    name="highestEducation"
                >
                    <Select
                        placeholder="Select high school"
                        className="h-11 rounded-md"
                        options={[
                            { label: 'High School', value: 'High School' },
                            { label: 'Associate Degree', value: 'Associate Degree' },
                            { label: 'Bachelor Degree', value: 'Bachelor Degree' },
                            { label: 'Master Degree', value: 'Master Degree' },
                            { label: 'PhD', value: 'PhD' },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="font-medium text-gray-700">Career Directions</span>}
                    name="careerDirections"
                >
                    <Checkbox.Group className="w-full">
                        <Row gutter={[16, 16]}>
                            {[
                                'I have no idea yet',
                                'Frontend development (HTML/CSS/Javascript)',
                                'App development',
                                'Game development',
                                'AI (Artificial Intelligence)',
                                'Cybersecurity',
                                'Web design / UXD (User experience design)',
                                'Tester',
                            ].map((direction) => (
                                <Col span={12} key={direction}>
                                    <Checkbox value={direction}>{direction}</Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label={<span className="font-medium text-gray-700">Hours per Week</span>}
                            name="aviliableHours"
                        >
                            <Select
                                placeholder="20+ hours"
                                className="h-11 rounded-md"
                                options={[
                                    { label: '10-20 hours', value: '10-20' },
                                    { label: '20+ hours', value: '20+' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<span className="font-medium text-gray-700">Has Laptop</span>}
                            name="havealaptop"
                        >
                            <Select
                                className="h-11 rounded-md"
                                options={[
                                    { label: 'Yes', value: 'Yes' },
                                    { label: 'No', value: 'No' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Address Information */}
                <h3 className="font-semibold text-gray-800 text-lg mb-4">Address Information</h3>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label={<span className="font-medium text-gray-700">City</span>} name="city">
                            <Input
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<span className="font-medium text-gray-700">Zip Code</span>} name="zipCode">
                            <Input
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    label={<span className="font-medium text-gray-700">Street Address</span>}
                    name="streetAddress"
                >
                    <Input className="h-11 rounded-md" variant="filled" style={{ backgroundColor: '#f9f9f9' }} />
                </Form.Item>

                {/* Administrative Information */}
                <h3 className="font-semibold text-gray-800 text-lg mb-4">Administrative Information</h3>
                <Form.Item label={<span className="font-medium text-gray-700">V-Number</span>} name="vNumber">
                    <Input className="h-11 rounded-md" variant="filled" style={{ backgroundColor: '#f9f9f9' }} />
                </Form.Item>
                <Form.Item label={<span className="font-medium text-gray-700">Notes</span>} name="note">
                    <Input.TextArea
                        rows={4}
                        placeholder="Enter notes..."
                        className="rounded-md"
                        variant="filled"
                        style={{ backgroundColor: '#f9f9f9' }}
                    />
                </Form.Item>

                {/* Socials */}
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label={<span className="font-medium text-gray-700">LinkedIn</span>}
                            name="linkedInProfile"
                        >
                            <Input
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={<span className="font-medium text-gray-700">GitHub</span>}
                            name="githubProfile"
                        >
                            <Input
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={<span className="font-medium text-gray-700">Portfolio</span>}
                            name="PortfolioWebsite"
                        >
                            <Input
                                className="h-11 rounded-md"
                                variant="filled"
                                style={{ backgroundColor: '#f9f9f9' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default EditStudentModal;
