import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import { X, Plus, Trash2 } from 'lucide-react';
import { useCreateGoalMutation } from '../../../redux/apiSlices/admin/adminStudentApi';
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
}

const CreateGoalModal: React.FC<CreateGoalModalProps> = ({ open, onCancel, refetch, studentId }) => {
    const [form] = Form.useForm();
    const [createGoal, { isLoading: isCreating }] = useCreateGoalMutation();
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    useEffect(() => {
        if (open) {
            form.setFieldsValue({
                goals: [{ title: '', description: '' }],
            });
            setIsSubmitDisabled(true);
        } else {
            form.resetFields();
        }
    }, [open, form]);

    const handleValuesChange = () => {
        const values = form.getFieldsValue();
        const goals = values.goals || [];

        const hasEmptyFields = goals.some((goal: GoalData) => !goal.title?.trim() || !goal.description?.trim());

        setIsSubmitDisabled(hasEmptyFields || goals.length === 0);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const action = createGoal;
            const loadingMsg = 'Creating goals...';
            const successMsg = 'Goals created successfully!';

            const cleanedData = values.goals.map((goal: any) => ({
                title: goal.title,
                description: goal.description,
            }));

            console.log(cleanedData, 'form data');

            toast.promise(action({ studentId, data: cleanedData }).unwrap(), {
                loading: loadingMsg,
                success: (res) => {
                    form.resetFields();
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

    return (
        <Modal
            title={<span className="text-xl font-semibold text-[#18212d]">Create New Goals</span>}
            open={open}
            onCancel={onCancel}
            footer={[
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
                        isSubmitDisabled ? 'bg-gray-100 text-gray-400' : 'bg-[#63d97d] hover:bg-[#52c41a] text-white'
                    }`}
                >
                    Create Goals
                </Button>,
            ]}
            closeIcon={<X size={20} />}
            width={750}
            centered
        >
            <Form form={form} layout="vertical" className="mt-6" onValuesChange={handleValuesChange}>
                <Form.List name="goals">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }, index) => (
                                <div
                                    key={key}
                                    className={`p-4 rounded-lg border border-gray-100 bg-gray-50/30 mb-6 relative transition-all`}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                            Goal {index + 1}
                                        </h3>
                                        {fields.length > 1 && (
                                            <Button
                                                type="text"
                                                danger
                                                size="small"
                                                icon={<Trash2 size={16} />}
                                                onClick={() => {
                                                    remove(name);
                                                    // Force button re-validation after removal
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
                                        label={<span className="font-semibold text-gray-700">Goal Title</span>}
                                        name={[name, 'title']}
                                        rules={[{ required: true, message: 'Goal title is required' }]}
                                        className="mb-4"
                                    >
                                        <Input
                                            placeholder="Enter Goal Title"
                                            className="h-11 rounded-md border-gray-200 focus:border-[#63d97d] focus:ring-1 focus:ring-[#63d97d]/20 transition-all"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        label={<span className="font-semibold text-gray-700">Description</span>}
                                        name={[name, 'description']}
                                        rules={[{ required: true, message: 'Description is required' }]}
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

                            {fields.length < 3 && (
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
                                    Add Goal
                                </Button>
                            )}
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default CreateGoalModal;
