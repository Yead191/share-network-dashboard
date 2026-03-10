import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, Tabs } from 'antd';
import { X, Plus, Trash2, CheckCircle, PlusCircle, Edit } from 'lucide-react';
import {
    useCreateGoalMutation,
    useDeleteGoalMutation,
    useUpdateGoalMutation,
} from '../../../redux/apiSlices/admin/adminStudentApi';
import { toast } from 'sonner';

interface GoalData {
    title: string;
    description: string;
}

interface CreateGoalModalProps {
    open: boolean;
    onCancel: () => void;
    refetch: () => void;
    studentId?: string | undefined;
    goals?: any[];
}

const CreateGoalModal: React.FC<CreateGoalModalProps> = ({ open, onCancel, refetch, studentId, goals = [] }) => {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('create');
    const [createGoal, { isLoading: isCreating }] = useCreateGoalMutation();
    const [updateGoal, { isLoading: isUpdating }] = useUpdateGoalMutation();
    const [deleteGoal, { isLoading: isDeleting }] = useDeleteGoalMutation();
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    useEffect(() => {
        if (open) {
            form.setFieldsValue({
                newGoals: [{ title: '', description: '' }],
                existingGoals: goals || [],
            });
            setIsSubmitDisabled(true);
            // Default to Update tab if goals exist, otherwise Create
            if (goals && goals.length > 0) {
                setActiveTab('update');
            } else {
                setActiveTab('create');
            }
        } else {
            form.resetFields();
        }
    }, [open, form, goals]);

    const handleValuesChange = () => {
        const values = form.getFieldsValue();
        const newGoals = values.newGoals || [];

        const hasEmptyFields = newGoals.some((goal: GoalData) => !goal.title?.trim() || !goal.description?.trim());

        setIsSubmitDisabled(hasEmptyFields || newGoals.length === 0);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields(['newGoals']);
            const action = createGoal;
            const loadingMsg = 'Creating goals...';
            const successMsg = 'Goals created successfully!';

            const cleanedData = values.newGoals.map((goal: any) => ({
                title: goal.title,
                description: goal.description,
            }));

            toast.promise(action({ studentId, data: cleanedData }).unwrap(), {
                loading: loadingMsg,
                success: (res) => {
                    form.setFieldsValue({ newGoals: [{ title: '', description: '' }] });
                    refetch();
                    onCancel();
                    return res?.message || successMsg;
                },
                error: (err: any) => err?.data?.message || 'Failed to process goals',
            });
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    const handleUpdate = async (index: number) => {
        try {
            // Validate only the specific goal in the existingGoals list
            await form.validateFields([
                ['existingGoals', index, 'title'],
                ['existingGoals', index, 'description'],
            ]);
            const goal = form.getFieldValue(['existingGoals', index]);

            // Backend expects payload as array
            const payload = [
                {
                    title: goal.title,
                    description: goal.description,
                },
            ];

            toast.promise(updateGoal({ id: goal._id, data: payload }).unwrap(), {
                loading: 'Updating goal...',
                success: (res) => {
                    refetch();
                    return res?.message || 'Goal updated successfully!';
                },
                error: (err: any) => err?.data?.message || 'Failed to update goal',
            });
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    const handleDelete = async (index: number) => {
        try {
            // Validate only the specific goal in the existingGoals list
            await form.validateFields([
                ['existingGoals', index, 'title'],
                ['existingGoals', index, 'description'],
            ]);
            const goal = form.getFieldValue(['existingGoals', index]);
            console.log(goal);
            toast.promise(deleteGoal(goal._id), {
                loading: 'Deleting goal...',
                success: (res) => {
                    refetch();
                    onCancel();
                    return res?.data?.message || 'Goal deleted successfully!';
                },
                error: (err: any) => err?.data?.message || 'Failed to delete goal',
            });
        } catch (error) {
            console.error('Validate Failed:', error);
        }
    };

    return (
        <Modal
            title={<span className="text-xl font-semibold text-[#18212d]">Manage Student Goals</span>}
            open={open}
            onCancel={onCancel}
            footer={
                activeTab === 'create'
                    ? [
                          <Button
                              key="cancel"
                              onClick={onCancel}
                              className="px-6 h-10 border-gray-300 rounded-md font-medium text-gray-500 hover:text-gray-700"
                          >
                              Cancel
                          </Button>,
                          <Button
                              key="submit"
                              type="primary"
                              onClick={handleOk}
                              loading={isCreating}
                              disabled={isSubmitDisabled}
                              className={`px-6 h-10 border-none rounded-md font-medium ${
                                  isSubmitDisabled
                                      ? 'bg-gray-100 text-gray-400'
                                      : 'bg-[#63d97d] hover:bg-[#52c41a] text-white'
                              }`}
                          >
                              Create Goals
                          </Button>,
                      ]
                    : [
                          <Button
                              key="close"
                              onClick={onCancel}
                              className="px-6 h-10 border-gray-300 rounded-md font-medium text-gray-500 hover:text-gray-700"
                          >
                              Close
                          </Button>,
                      ]
            }
            closeIcon={<X size={20} />}
            width={750}
            centered
        >
            <Form form={form} layout="vertical" className="mt-6" onValuesChange={handleValuesChange}>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    className="mt-2"
                    items={[
                        {
                            key: 'create',
                            label: (
                                <span className="flex items-center gap-2 px-2">
                                    <PlusCircle size={18} /> Create New
                                </span>
                            ),
                            children: (
                                <div className="mt-4">
                                    <Form.List name="newGoals">
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }, index) => (
                                                    <div
                                                        key={key}
                                                        className="p-4 rounded-lg border border-gray-100 bg-gray-50/30 mb-6 relative transition-all"
                                                    >
                                                        <div className="flex justify-between items-center mb-4">
                                                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                                                New Goal {index + 1}
                                                            </h3>
                                                            {fields.length > 1 && (
                                                                <Button
                                                                    type="text"
                                                                    danger
                                                                    size="small"
                                                                    icon={<Trash2 size={16} />}
                                                                    onClick={() => {
                                                                        remove(name);
                                                                        setTimeout(handleValuesChange, 0);
                                                                    }}
                                                                    className="flex items-center gap-1 hover:bg-red-50"
                                                                >
                                                                    Remove
                                                                </Button>
                                                            )}
                                                        </div>

                                                        <Form.Item
                                                            {...restField}
                                                            label={
                                                                <span className="font-semibold text-gray-700">
                                                                    Goal Title
                                                                </span>
                                                            }
                                                            name={[name, 'title']}
                                                            rules={[
                                                                { required: true, message: 'Goal title is required' },
                                                            ]}
                                                            className="mb-4"
                                                        >
                                                            <Input
                                                                placeholder="Enter Goal Title"
                                                                className="h-11 rounded-md border-gray-200 focus:border-[#63d97d] focus:ring-1 focus:ring-[#63d97d]/20 transition-all"
                                                            />
                                                        </Form.Item>

                                                        <Form.Item
                                                            {...restField}
                                                            label={
                                                                <span className="font-semibold text-gray-700">
                                                                    Description
                                                                </span>
                                                            }
                                                            name={[name, 'description']}
                                                            rules={[
                                                                { required: true, message: 'Description is required' },
                                                            ]}
                                                            className="mb-0"
                                                        >
                                                            <Input.TextArea
                                                                placeholder="Enter goal description"
                                                                rows={3}
                                                                className="rounded-md border-gray-200 focus:border-[#63d97d] focus:ring-1 focus:ring-[#63d97d]/20 transition-all"
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                ))}

                                                {fields.length < 5 && (
                                                    <Button
                                                        type="dashed"
                                                        onClick={() => {
                                                            add();
                                                            handleValuesChange();
                                                        }}
                                                        block
                                                        icon={<Plus size={18} />}
                                                        className="h-12 border-[#63d97d] text-[#63d97d] hover:text-[#52c41a] hover:border-[#52c41a] transition-all flex items-center justify-center gap-2 font-medium"
                                                    >
                                                        Add Another Goal
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </Form.List>
                                </div>
                            ),
                        },
                        {
                            key: 'update',
                            label: (
                                <span className="flex items-center gap-2 px-2">
                                    <Edit size={18} /> Update Existing
                                </span>
                            ),
                            disabled: !goals || goals.length === 0,
                            children: (
                                <div className="mt-4">
                                    <Form.List name="existingGoals">
                                        {(fields) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }, index) => (
                                                    <div
                                                        key={key}
                                                        className="p-4 rounded-lg border border-gray-100 bg-gray-50/10 mb-6 relative"
                                                    >
                                                        <div className="flex justify-between items-center mb-4">
                                                            <h3 className="text-sm font-bold text-[#63d97d] uppercase tracking-wider">
                                                                Existing Goal {index + 1}
                                                            </h3>
                                                            <div className="flex gap-2 items-center">
                                                                <Button
                                                                    type="text"
                                                                    size="small"
                                                                    icon={<CheckCircle size={16} />}
                                                                    onClick={() => handleUpdate(name)}
                                                                    loading={isUpdating}
                                                                    className="flex items-center gap-1 text-green-600 hover:bg-green-50!"
                                                                >
                                                                    Update changes
                                                                </Button>
                                                                <Button
                                                                    type="text"
                                                                    size="small"
                                                                    icon={<Trash2 size={16} />}
                                                                    danger
                                                                    onClick={() => handleDelete(name)}
                                                                    loading={isDeleting}
                                                                    className="flex items-center gap-1 hover:bg-red-50!"
                                                                />
                                                            </div>
                                                        </div>

                                                        <Form.Item
                                                            {...restField}
                                                            label={
                                                                <span className="font-semibold text-gray-700">
                                                                    Goal Title
                                                                </span>
                                                            }
                                                            name={[name, 'title']}
                                                            rules={[
                                                                { required: true, message: 'Goal title is required' },
                                                            ]}
                                                            className="mb-4"
                                                        >
                                                            <Input className="h-11 rounded-md border-gray-200" />
                                                        </Form.Item>

                                                        <Form.Item
                                                            {...restField}
                                                            label={
                                                                <span className="font-semibold text-gray-700">
                                                                    Description
                                                                </span>
                                                            }
                                                            name={[name, 'description']}
                                                            rules={[
                                                                { required: true, message: 'Description is required' },
                                                            ]}
                                                            className="mb-0"
                                                        >
                                                            <Input.TextArea
                                                                rows={3}
                                                                className="rounded-md border-gray-200"
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </Form.List>
                                </div>
                            ),
                        },
                    ]}
                />
            </Form>
        </Modal>
    );
};

export default CreateGoalModal;
