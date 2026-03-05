import React from 'react';
import { Modal, Button, Form, Select } from 'antd';
import { X } from 'lucide-react';
import { useGetUserGroupsQuery } from '../../../redux/apiSlices/admin/adminStudentApi';

interface FilterMentorModalProps {
    open: boolean;
    onCancel: () => void;
    onFilter: (groupId: string | undefined) => void;
    initialGroupId?: string;
}

const FilterMentorModal: React.FC<FilterMentorModalProps> = ({ open, onCancel, onFilter, initialGroupId }) => {
    const [form] = Form.useForm();
    const { data: groupsApi, isLoading } = useGetUserGroupsQuery({});
    const groups = groupsApi?.data || [];

    const onFinish = (values: { userGroup: string | undefined }) => {
        onFilter(values.userGroup);
        onCancel();
    };

    const handleReset = () => {
        form.resetFields();
        onFilter(undefined);
        onCancel();
    };

    return (
        <Modal
            title={<span className="text-xl font-semibold text-[#18212d]">Filter Mentors</span>}
            open={open}
            onCancel={onCancel}
            footer={null}
            closeIcon={<X size={20} />}
            width={500}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="mt-4"
                initialValues={{ userGroup: initialGroupId }}
            >
                <Form.Item label={<span className="font-semibold text-gray-700">Group</span>} name="userGroup">
                    <Select
                        placeholder="Select a group"
                        className="w-full"
                        allowClear
                        loading={isLoading}
                        style={{ height: '44px' }}
                        options={groups?.map((group: any) => ({
                            label: group.name,
                            value: group._id,
                        }))}
                        filterOption={(input, option) =>
                            (option?.label ? String(option.label) : '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>

                <div className="flex justify-end gap-3 mt-6">
                    <Button onClick={handleReset} className="px-6 h-11 border-gray-300 rounded-md">
                        Reset
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="px-8 h-11 bg-[#52c41a] border-none hover:bg-[#73d13d] rounded-md font-semibold"
                    >
                        Apply Filter
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default FilterMentorModal;
