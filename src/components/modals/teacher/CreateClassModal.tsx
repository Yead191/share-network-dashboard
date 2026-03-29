import { Modal, Button, Input, DatePicker, Checkbox, Form, Select, Radio } from 'antd';
import { IoCloseOutline } from 'react-icons/io5';
import dayjs from 'dayjs';
import { useGetUserGroupsQuery, useGetUserGroupsTrackQuery } from '../../../redux/apiSlices/teacher/resourceSlice';
import { useGetStudentsQuery } from '../../../redux/apiSlices/admin/adminStudentApi';

interface CreateClassModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (values: any) => void;
    initialValues?: any;
    isLoading: boolean;
}

const CreateClassModal: React.FC<CreateClassModalProps> = ({ visible, onClose, onSave, initialValues, isLoading }) => {
    const [form] = Form.useForm();
    const { data: userGroups } = useGetUserGroupsQuery({ page: 1, limit: 10 });
    const { data: userGroupsTrack } = useGetUserGroupsTrackQuery({ page: 1, limit: 10 });
    const { data: studentsApi } = useGetStudentsQuery({ page: 0, limit: 0 });
    const students = studentsApi?.data?.data
    const handleOk = () => {
        form.validateFields().then((values) => {
            const processedValues = {
                ...values,
                userGroup: values.userGroup ? [values.userGroup] : [],
            };
            console.log(processedValues);
            onSave(processedValues);
            form.resetFields();
            onClose();
        });
    };

    if (visible && initialValues) {
        const selectionType = (initialValues.studentId?.length > 0 || initialValues.students?.length > 0) ? 'student' : 'group';

        const userGroupValue = Array.isArray(initialValues.userGroup)
            ? initialValues.userGroup[0]
            : initialValues.userGroup;

        form.setFieldsValue({
            ...initialValues,
            userGroup: userGroupValue,
            selectionType,
            date: initialValues.date ? dayjs(new Date(initialValues.date)) : null,
        });
    }

    return (
        <Modal
            open={visible}
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            footer={null}
            closeIcon={<IoCloseOutline size={24} className="text-gray-500" />}
            width={700}
            centered
            title={
                <span className="text-xl font-semibold text-gray-800">
                    {initialValues ? 'Edit Class' : 'Create New Class'}
                </span>
            }
            className="create-class-modal"
        >
            <Form form={form} layout="vertical" className="mt-6" initialValues={{ virtualClass: false, selectionType: 'group' }}>
                <Form.Item
                    name="title"
                    label={<span className="font-semibold text-gray-700">Title</span>}
                    rules={[{ required: true, message: 'Please enter a title' }]}
                >
                    <Input placeholder="Enter title" className="h-[42px] rounded-lg border-gray-200" />
                </Form.Item>

                <Form.Item name="description" label={<span className="font-semibold text-gray-700">Description</span>}>
                    <Input.TextArea
                        placeholder="Write description..."
                        rows={4}
                        className="rounded-lg border-gray-200"
                    />
                </Form.Item>

                <div className="flex gap-6">
                    <Form.Item
                        name="date"
                        label={<span className="font-semibold text-gray-700">Class Date</span>}
                        className="flex-1"
                        rules={[{ required: true, message: 'Please select a date' }]}
                    >
                        <DatePicker className="w-full h-[42px] rounded-lg border-gray-200" />
                    </Form.Item>

                    <Form.Item
                        name="location"
                        label={<span className="font-semibold text-gray-700">Location</span>}
                        className="flex-1"
                    >
                        <Input placeholder="Enter Location" className="h-[42px] rounded-lg border-gray-200" />
                    </Form.Item>
                </div>

                <Form.Item name="selectionType" label={<span className="font-semibold text-gray-700">Select Type</span>}>
                    <Radio.Group>
                        <Radio value="group">Group</Radio>
                        <Radio value="student">Student</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.selectionType !== currentValues.selectionType}
                >
                    {({ getFieldValue }) => {
                        const selectionType = getFieldValue('selectionType');

                        if (selectionType === 'group') {
                            return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <Form.Item
                                        label={<span className="font-semibold text-gray-700 text-base">Targeted Groups</span>}
                                        name="userGroup"
                                        rules={[{ required: true, message: 'Please select a group' }]}
                                    >
                                        <Select
                                            placeholder="Select groups"
                                            className="custom-select-full rounded-lg min-h-[44px]"
                                        >
                                            {userGroups?.data?.map((group: any) => (
                                                <Select.Option key={group._id} value={group._id}>
                                                    {group.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prevValues, currentValues) => prevValues.userGroup !== currentValues.userGroup}
                                    >
                                        {({ getFieldValue }) => {
                                            const selectedGroupId = getFieldValue('userGroup');
                                            const skillPathGroup = userGroups?.data?.find((g: any) => g.name === 'Skill Path');
                                            const isSkillPathSelected = selectedGroupId === skillPathGroup?._id;
                                            return (
                                                <Form.Item
                                                    label={<span className="font-semibold text-gray-700 text-base">Target Track</span>}
                                                    name="userGroupTrack"
                                                >
                                                    <Select
                                                        placeholder="Select track"
                                                        disabled={!isSkillPathSelected}
                                                        className="h-11 custom-select-full rounded-lg"
                                                    >
                                                        {userGroupsTrack?.data?.map((track: any) => (
                                                            <Select.Option key={track._id} value={track._id}>
                                                                {track.name}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            );
                                        }}
                                    </Form.Item>
                                </div>
                            );
                        }

                        if (selectionType === 'student') {
                            return (
                                <Form.Item
                                    name="studentId"
                                    label={<span className="text-sm font-semibold text-gray-700">Select individual Students</span>}
                                >
                                    <Select
                                        showSearch
                                        mode="multiple"
                                        placeholder="Choose students"
                                        className="h-11 custom-select-full rounded-lg"
                                        style={{ height: 'auto', minHeight: '44px' }}
                                        options={
                                            students?.map((student: any) => ({
                                                value: student?._id,
                                                label: `${student?.firstName} ${student?.lastName} (${student?.email})`,
                                            })) || []
                                        }
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                                        }
                                    />
                                </Form.Item>
                            );
                        }

                        return null;
                    }}
                </Form.Item>

                <div className="flex justify-between items-center mt-4">
                    <Form.Item name="virtualClass" valuePropName="checked" noStyle>
                        <Checkbox className="text-gray-600 font-medium">Virtual Class</Checkbox>
                    </Form.Item>

                    <Button
                        type="primary"
                        onClick={handleOk}
                        loading={isLoading}
                        className="bg-[#22C55E] hover:bg-[#16a34a] border-none px-8 h-[42px] rounded-lg font-semibold"
                    >
                        {initialValues ? 'Save Changes' : 'Create Class'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default CreateClassModal;
