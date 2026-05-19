import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, Spin, Checkbox } from 'antd';
import { X } from 'lucide-react';
import { useGetMentorsQuery, useUpdateCoordinatorMutation, useLazyGetMentorsQuery } from '../../../redux/apiSlices/admin/adminCoordinatorApi';
import { toast } from 'sonner';

interface EditCoordinatorModalProps {
    open: boolean;
    onCancel: () => void;
    refetch: () => void;
    coordinator: any | null;
    userGroups: any[] | null;
    isUserGroupsLoading: boolean;
}

const EditCoordinatorModal: React.FC<EditCoordinatorModalProps> = ({
    open,
    onCancel,
    refetch,
    coordinator,
    userGroups,
    isUserGroupsLoading,
}) => {
    const [form] = Form.useForm();
    const [updateCoordinator, { isLoading }] = useUpdateCoordinatorMutation();
    const [triggerGetMentors] = useLazyGetMentorsQuery();

    const [allMentors, setAllMentors] = useState<any[]>([]);
    const [mentorsCache, setMentorsCache] = useState<Record<string, any>>({});
    const [isFetchingAll, setIsFetchingAll] = useState(false);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [hasMore, setHasMore] = useState(true);

    const { data: mentorsApi, isFetching: isMentorsLoading } = useGetMentorsQuery({
        page,
        limit: 10,
        searchTerm,
        company: coordinator?.company,
    }, { skip: !open });

    const assignedMentors = Form.useWatch('assignedMentors', form) || [];
    const totalMentorsCount = mentorsApi?.data?.pagination?.total || 0;
    const isAllSelected = totalMentorsCount > 0 && assignedMentors.length === totalMentorsCount;

    // Reset state when modal opens/closes
    useEffect(() => {
        if (open) {
            setPage(1);
            setSearchTerm('');
            if (coordinator?.assignedMentors) {
                setAllMentors(coordinator.assignedMentors);
                const initialCache: Record<string, any> = {};
                coordinator.assignedMentors.forEach((m: any) => {
                    initialCache[m._id] = m;
                });
                setMentorsCache(initialCache);
            } else {
                setAllMentors([]);
                setMentorsCache({});
            }
        }
    }, [open, coordinator]);

    // Cache newly loaded mentors
    useEffect(() => {
        if (mentorsApi?.data?.mentors) {
            const newMentors = mentorsApi.data.mentors;
            setMentorsCache(prev => {
                const next = { ...prev };
                newMentors.forEach((m: any) => {
                    next[m._id] = m;
                });
                return next;
            });
        }
    }, [mentorsApi]);

    // Handle incoming data
    useEffect(() => {
        if (mentorsApi?.data?.mentors) {
            const newMentors = mentorsApi.data.mentors;
            setAllMentors(prev => {
                if (page === 1) {
                    const combined = [...newMentors];
                    const currentSelectedIds = form.getFieldValue('assignedMentors') || [];
                    currentSelectedIds.forEach((id: string) => {
                        const m = mentorsCache[id] || coordinator?.assignedMentors?.find((item: any) => item._id === id);
                        if (m && !combined.some(item => item._id === id)) {
                            combined.unshift(m);
                        }
                    });
                    return combined;
                }
                const existingIds = new Set(prev.map(m => m._id));
                const uniqueNew = newMentors.filter((m: any) => !existingIds.has(m._id));
                return [...prev, ...uniqueNew];
            });
        }
    }, [mentorsApi, page, coordinator, mentorsCache, form]);

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

    const handleSelectAllChange = async (e: any) => {
        const checked = e.target.checked;
        if (checked) {
            setIsFetchingAll(true);
            try {
                const res = await triggerGetMentors({
                    page: 1,
                    limit: 10000,
                    company: coordinator?.company,
                }).unwrap();

                if (res?.data?.mentors) {
                    const fetchedMentors = res.data.mentors;
                    const mentorIds = fetchedMentors.map((m: any) => m._id);

                    setMentorsCache(prev => {
                        const next = { ...prev };
                        fetchedMentors.forEach((m: any) => {
                            next[m._id] = m;
                        });
                        return next;
                    });

                    setAllMentors(prev => {
                        const existingIds = new Set(prev.map(m => m._id));
                        const uniqueNew = fetchedMentors.filter((m: any) => !existingIds.has(m._id));
                        return [...prev, ...uniqueNew];
                    });

                    form.setFieldsValue({
                        assignedMentors: mentorIds,
                    });
                }
            } catch (error) {
                toast.error('Failed to fetch all mentors');
            } finally {
                setIsFetchingAll(false);
            }
        } else {
            form.setFieldsValue({
                assignedMentors: [],
            });
        }
    };

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
                userGroup: coordinator.userGroup?.map((g: any) => g._id) || [],
                company: coordinator.company,
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
            centered
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
                            {/* <Select.Option value="PENDING">Pending</Select.Option> */}
                            <Select.Option value="ACTIVE">Active</Select.Option>
                            <Select.Option value="NON_ACTIVE">Non-Active</Select.Option>
                            <Select.Option value="RESERVE">Reserve </Select.Option>
                        </Select>
                    </Form.Item>
                </div>
                <Form.Item label={<span className="font-semibold text-gray-700">Company Name</span>} name="company">
                    <Input placeholder="Enter Company Name" className="h-11 rounded-md" />
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
                        mode="multiple"
                        style={{ backgroundColor: '#f9f9f9' }}
                        loading={isUserGroupsLoading}
                        options={userGroups?.map((g: any) => ({
                            label: g.name,
                            value: g._id,
                        }))}
                        allowClear
                    />
                </Form.Item>
                <div className="w-full">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">Assign Mentors</span>
                        <Checkbox
                            checked={isAllSelected}
                            onChange={handleSelectAllChange}
                            disabled={isMentorsLoading || isFetchingAll}
                            className="font-normal text-sm text-gray-600"
                        >
                            Select All Mentors ({coordinator?.company ? coordinator?.company : ''} {totalMentorsCount}) {isFetchingAll && <Spin size="small" className="ml-2" />}
                        </Checkbox>
                    </div>
                    <Form.Item name="assignedMentors">
                        <Select
                            mode="multiple"
                            size="large"
                            showSearch
                            placeholder="Select mentors to assign"
                            filterOption={false}
                            onSearch={handleSearch}
                            onPopupScroll={handlePopupScroll}
                            options={
                                allMentors?.map((mentor: any) => ({
                                    value: mentor._id,
                                    label: `${mentor.firstName} ${mentor.lastName}`,
                                })) || []
                            }
                            className="w-full"
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
