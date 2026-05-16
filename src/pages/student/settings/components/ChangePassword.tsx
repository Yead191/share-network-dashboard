import { Button, Form, Input } from 'antd';
import { useChangePasswordMutation } from '../../../../redux/apiSlices/authSlice';
import { toast } from 'sonner';

export default function ChangePassword() {
    const [form] = Form.useForm();
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const onFinish = async (values: any) => {
        if (values.newPassword !== values.confirmPassword) {
            return toast.error('New password and confirm password do not match');
        }

        try {
            const res = await changePassword({
                currentPassword: values.oldPassword,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword,
            }).unwrap();
            toast.success(res.message || 'Password changed successfully');
            form.resetFields();
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to change password');
        }
    };

    return (
        <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-[#1E293B] mb-6">Change Password</h2>
            <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} className="space-y-4">
                <Form.Item
                    label={<span className="text-[#64748B] font-medium">Old Password</span>}
                    name="oldPassword"
                    rules={[{ required: true, message: 'Please enter your current password' }]}
                >
                    <Input.Password
                        placeholder="*************"
                        size="large"
                        className="rounded-lg border-[#E2E8F0] h-12"
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="text-[#64748B] font-medium">New Password</span>}
                    name="newPassword"
                    rules={[
                        { required: true, message: 'Please enter a new password' },
                        { min: 6, message: 'Password must be at least 6 characters' },
                    ]}
                >
                    <Input.Password
                        placeholder="*************"
                        size="large"
                        className="rounded-lg border-[#E2E8F0] h-12"
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="text-[#64748B] font-medium">Confirm New Password</span>}
                    name="confirmPassword"
                    rules={[{ required: true, message: 'Please confirm your new password' }]}
                >
                    <Input.Password
                        placeholder="*************"
                        size="large"
                        className="rounded-lg border-[#E2E8F0] h-12"
                    />
                </Form.Item>

                <Form.Item className="pt-4">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        size="large"
                        className="h-12 px-8 bg-[#3BB77E] hover:bg-[#2eaa6b] border-none rounded-lg font-semibold shadow-md shadow-green-100"
                    >
                        Update Password
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
