import { Button, Checkbox, ConfigProvider, Form, FormProps, Input, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AuthSidebar from '../../components/ui/AuthSidebar';
import { useLoginMutation } from '../../redux/apiSlices/authSlice';
import { toast } from 'sonner';
import { useState } from 'react';

export type errorType = {
    data: {
        errorMessages: { message: string }[];
        message: string;
    };
};

interface LoginFormValues {
    role: string;
    email: string;
    password?: string;
    remember?: boolean;
}

const Login = () => {
    const navigate = useNavigate();
    // api call
    const [login] = useLoginMutation();
    const [form] = Form.useForm();
    const [hiddenForget, setHiddenForget] = useState(false);

    const onFinish: FormProps<LoginFormValues>['onFinish'] = async (values) => {
        try {
            toast.promise(login(values).unwrap(), {
                loading: 'Logging in...',
                success: (res) => {
                    // console.log(res);
                    localStorage.setItem('token', res?.data?.accessToken);
                    localStorage.setItem('role', res?.data?.role);
                    const role = res?.data?.role?.toLowerCase();
                    let routeRole = role;
                    if (role === 'super_admin') {
                        routeRole = 'admin';
                    } else if (role === 'coordinator') {
                        routeRole = 'mentor-coordinator';
                    }
                    navigate(`/${routeRole}/overview`);
                    return res.message || 'Login successful';
                },
                error: (err) => err.data.errorMessages[0].message || 'Login failed',
            });
        } catch (error) {
            const err = error as errorType;
            console.log(err.data.errorMessages[0].message);
        }
    };

    const handleValuesChange = (changedValues: any) => {
        if (changedValues.role === 'mentor') {
            setHiddenForget(true);
        } else {
            setHiddenForget(false);
        }
        if (changedValues.role) {
            const roleCredentials: Record<string, { email: string }> = {
                admin: { email: 'azizulsparktech@gmail.com' },
                student: { email: 'woyik33076@helesco.com' },
                mentor: { email: 'bonodej524@gamening.com' },
                teacher: { email: 'teacher@gxuzi.com' },
                'mentor-coordinator': { email: 'matin51126@codgal.com' },
            };

            const creds = roleCredentials[changedValues.role];
            if (creds) {
                form.setFieldsValue({
                    email: creds.email,
                    // password: creds.email === 'segiba3385@gxuzi.com' ? '123456' : '12345678',
                    password: '12345678',
                });
            }
        }
    };

    return (
        <section className="min-h-screen grid grid-cols-2 items-center bg-[#F8FAFC]">
            <AuthSidebar backgroundImage="/assets/images/auth/login.jpg" />

            {/* Right Side: Login Form */}
            <div className="flex items-center justify-center p-10">
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: '#66D978',
                            colorBgContainer: '#fff',
                            borderRadius: 12,
                        },
                        components: {
                            Input: {
                                controlHeight: 48,
                                colorBorder: '#E2E8F0',
                                borderRadius: 10,
                            },
                            Select: {
                                controlHeight: 48,
                                colorBorder: '#E2E8F0',
                                borderRadius: 10,
                            },
                            Button: {
                                controlHeight: 48,
                                borderRadius: 10,
                            },
                        },
                    }}
                >
                    <div className="bg-white w-[540px] rounded-2xl shadow-xl p-12 ">
                        <div className="text-center mb-10">
                            <h1 className="text-[32px] text-[#000000] font-bold mb-2">Login</h1>
                            <p className="text-[#64748B] text-lg font-normal">Access the Share Network App dashboard</p>
                        </div>

                        <Form
                            form={form}
                            name="normal_login"
                            className="login-form"
                            layout="vertical"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onValuesChange={handleValuesChange}
                        >
                            <Form.Item
                                label={<span className="text-[#1E293B] font-semibold text-base">Select your role</span>}
                                name="role"
                                rules={[{ required: true, message: 'Please select your role!' }]}
                            >
                                <Select placeholder="Enter Role">
                                    <Select.Option value="admin">Admin</Select.Option>
                                    <Select.Option value="teacher">Teacher</Select.Option>
                                    <Select.Option value="mentor-coordinator">Mentor Coordinator</Select.Option>
                                    <Select.Option value="mentor">Mentor</Select.Option>
                                    <Select.Option value="student">Student</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-[#1E293B] font-semibold text-base">Email</span>}
                                name="email"
                                rules={[{ required: true, message: 'Please input your email!' }]}
                            >
                                <Input placeholder="Enter Email" type="email" />
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-[#1E293B] font-semibold text-base">Password</span>}
                                name="password"
                                rules={[{ required: true, message: 'Please input your Password!' }]}
                            >
                                <Input.Password placeholder="*************" />
                            </Form.Item>

                            <div className="flex items-center justify-between mb-8">
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox className="text-[#64748B]">Remember Me</Checkbox>
                                </Form.Item>
                                {!hiddenForget && (
                                    <Link
                                        to="/forget-password"
                                        className="text-[#F43F5E] hover:text-[#E11D48] font-medium"
                                    >
                                        Forgot Password?
                                    </Link>
                                )}
                            </div>

                            <Form.Item className="mb-0">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    className="h-[52px] text-lg font-semibold bg-[#66D978] hover:bg-[#58C469] border-none shadow-md shadow-green-200"
                                >
                                    Sign in
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </ConfigProvider>
            </div>
        </section>
    );
};

export default Login;
