import React, { useEffect } from 'react';
import { Modal, Button, Form, Select } from 'antd';
import { X } from 'lucide-react';
import { useUpdateMentorMutation } from '../../../redux/apiSlices/admin/adminStudentApi';
import { toast } from 'sonner';

interface AssignMentorModalProps {
    open: boolean;
    onCancel: () => void;
    student: any;
    allMentors: any;
    isMentorsLoading: boolean;
    refetch: () => void;
    userGroups: any;
    userTracks: any;
    isUserGroupsLoading: boolean;
    isUserTracksLoading: boolean;
}

const AssignMentorModal: React.FC<AssignMentorModalProps> = ({
    open,
    onCancel,
    student,
    allMentors,
    isMentorsLoading,
    refetch,
    userGroups,
    userTracks,
    isUserGroupsLoading,
    isUserTracksLoading,
}) => {
    const [form] = Form.useForm();
    const [updateMentor, { isLoading: isUpdating }] = useUpdateMentorMutation();

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
        if (student) {
            form.setFieldsValue({
                mentorId: student.mentorId?._id || student.mentorId,
                userGroup: student.userGroup?.map((g: any) => g._id) || [],
                userGroupTrack: student.userGroupTrack?._id || student.userGroupTrack,
            });
        } else {
            form.resetFields();
        }
    }, [student, form]);

    const handleAssign = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                mentorId: values.mentorId,
                userGroup: values.userGroup,
                userGroupTrack: values.userGroupTrack,
            };

            toast.promise(updateMentor({ id: student._id, data: payload }).unwrap(), {
                loading: 'Assigning mentor/group/track...',
                success: (res) => {
                    if (res?.success) {
                        form.resetFields();
                        refetch();
                        onCancel();
                        return res?.message || 'Assignment updated successfully!';
                    }
                },
                error: (err: any) => err?.data?.message || 'Failed to update assignment',
            });
        } catch (error) {
            console.error('Assignment failed:', error);
        }
    };

    return (
        <Modal
            title={
                <span className="text-2xl font-bold text-gray-800">
                    Assign Mentor/Group/Track - {student?.firstName} {student?.lastName}
                </span>
            }
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
                    onClick={handleAssign}
                    loading={isUpdating}
                    className="px-10 h-10 bg-[#52c41a] border-none hover:bg-[#73d13d] rounded-md font-medium"
                >
                    Assign
                </Button>,
            ]}
            closeIcon={<X size={20} />}
            width={580}
            centered
        >
            <Form form={form} layout="vertical" className="mt-8 mb-4">
                <Form.Item
                    label={<span className="font-bold text-gray-700">Select Mentor</span>}
                    name="mentorId"
                    rules={[{ required: false, message: 'Please select a mentor' }]}
                >
                    <Select
                        placeholder="Choose a mentor"
                        className="h-11 rounded-md"
                        variant="filled"
                        style={{ backgroundColor: '#f9f9f9' }}
                        loading={isMentorsLoading}
                        options={allMentors?.map((m: any) => ({
                            label: `${m.firstName} ${m.lastName}`,
                            value: m._id,
                        }))}
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        autoClearSearchValue
                    />
                </Form.Item>
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
                        rules={[{ required: true, message: 'Please select a track' }]}
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
            </Form>
        </Modal>
    );
};

export default AssignMentorModal;
