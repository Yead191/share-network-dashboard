import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Select, Spin } from 'antd';
import { X } from 'lucide-react';
import { useUpdateMentorMutation } from '../../../redux/apiSlices/admin/adminStudentApi';
import { toast } from 'sonner';
import { useGetAdminMentorsQuery } from '../../../redux/apiSlices/admin/adminMentorsApi';

interface AssignMentorModalProps {
    open: boolean;
    onCancel: () => void;
    student: any;
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
    refetch,
    userGroups,
    userTracks,
    isUserGroupsLoading,
    isUserTracksLoading,
}) => {
    const [form] = Form.useForm();
    const [updateMentor, { isLoading: isUpdating }] = useUpdateMentorMutation();

    const [allMentors, setAllMentors] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [hasMore, setHasMore] = useState(true);

    const { data: mentorsApi, isFetching: isMentorsLoading } = useGetAdminMentorsQuery({
        page,
        limit: 10,
        searchTerm
    }, { skip: !open });

    const selectedGroups = Form.useWatch('userGroup', form);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (open) {
            setPage(1);
            setSearchTerm('');
            if (student?.mentorId) {
                // mentorId could be an object or an ID string
                const initialMentor = typeof student.mentorId === 'object' ? student.mentorId : null;
                if (initialMentor) {
                    setAllMentors([initialMentor]);
                } else {
                    setAllMentors([]);
                }
            } else {
                setAllMentors([]);
            }
        }
    }, [open, student]);

    // Handle incoming data
    useEffect(() => {
        if (mentorsApi?.data?.mentors) {
            const newMentors = mentorsApi.data.mentors;
            setAllMentors(prev => {
                if (page === 1) {
                    const combined = [...newMentors];
                    const currentMentor = typeof student?.mentorId === 'object' ? student.mentorId : null;
                    if (currentMentor) {
                        const mentorId = currentMentor._id;
                        if (!combined.some(m => m._id === mentorId)) {
                            combined.unshift(currentMentor);
                        }
                    }
                    return combined;
                }
                const existingIds = new Set(prev.map(m => m._id));
                const uniqueNew = newMentors.filter((m: any) => !existingIds.has(m._id));
                return [...prev, ...uniqueNew];
            });
        }
    }, [mentorsApi, page, student]);

    // Update hasMore separately
    useEffect(() => {
        if (mentorsApi?.data?.pagination) {
            const { total } = mentorsApi.data.pagination;
            setHasMore(allMentors.length < total);
        }
    }, [allMentors.length, mentorsApi]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setPage(1);
    };

    const handlePopupScroll = (e: any) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 10 && hasMore && !isMentorsLoading) {
            setPage(prev => prev + 1);
        }
    };

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
                        filterOption={false}
                        onSearch={handleSearch}
                        onPopupScroll={handlePopupScroll}
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                {isMentorsLoading && (
                                    <div className="flex justify-center p-2 border-t">
                                        <Spin size="small" />
                                    </div>
                                )}
                            </>
                        )}
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
            </Form>
        </Modal>
    );
};

export default AssignMentorModal;
