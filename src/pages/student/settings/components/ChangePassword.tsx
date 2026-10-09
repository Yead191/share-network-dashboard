import { Button, Form, Input } from 'antd';
import { useChangePasswordMutation } from '../../../../redux/apiSlices/authSlice';
import { toast } from 'sonner';
import { ShieldCheck, KeyRound, Lock } from 'lucide-react';

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
        <div className="max-w-2xl mx-auto py-2">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10">
                {/* Header */}
                <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-slate-100">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold shrink-0">
                        <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Security & Password</h2>
                        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                            Update your login password to maintain account security
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                    className="space-y-4"
                >
                    <Form.Item
                        label={<span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Current Password</span>}
                        name="oldPassword"
                        rules={[{ required: true, message: 'Please enter your current password' }]}
                    >
                        <Input.Password
                            placeholder="Enter current password"
                            className="rounded-xl border-slate-200 hover:border-emerald-400 focus:border-emerald-500 h-12 text-slate-800"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">New Password</span>}
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Please enter a new password' },
                            { min: 6, message: 'Password must be at least 6 characters' },
                        ]}
                    >
                        <Input.Password
                            placeholder="At least 6 characters"
                            className="rounded-xl border-slate-200 hover:border-emerald-400 focus:border-emerald-500 h-12 text-slate-800"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Confirm New Password</span>}
                        name="confirmPassword"
                        rules={[{ required: true, message: 'Please confirm your new password' }]}
                    >
                        <Input.Password
                            placeholder="Re-enter new password"
                            className="rounded-xl border-slate-200 hover:border-emerald-400 focus:border-emerald-500 h-12 text-slate-800"
                        />
                    </Form.Item>

                    {/* Password Tips Callout */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 mt-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Password Security Tips</span>
                        </div>
                        <ul className="text-xs text-slate-500 space-y-1 pl-6 list-disc">
                            <li>Must be at least 6 characters long</li>
                            <li>Include uppercase letters, numbers, and special symbols for stronger protection</li>
                            <li>Avoid using easily guessable personal info</li>
                        </ul>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            icon={<Lock className="w-4 h-4 mr-1 inline-block" />}
                            className="h-12 px-8 rounded-xl font-bold shadow-sm hover:shadow-md transition-all bg-[#66D978] hover:bg-[#58c769] border-none text-slate-900"
                        >
                            Update Password
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}
