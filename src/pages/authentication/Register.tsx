import { Button, ConfigProvider, Form, FormProps, Input, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AuthSidebar from '../../components/ui/AuthSidebar';
import { useSignupMutation } from '../../redux/apiSlices/authSlice';
import { toast } from 'sonner';

interface RegisterFormValues {
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    gender: string;
    password?: string;
    confirmPassword?: string;
}

const Register = () => {
    const navigate = useNavigate();
    const [signup] = useSignupMutation();
    const [form] = Form.useForm();

    const onFinish: FormProps<RegisterFormValues>['onFinish'] = async (values) => {
        if (values.password !== values.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const data = {
            ...values,
            role: "STUDENT",
            status: "PENDING",
            verified: true,
        };

        try {
            toast.promise(signup(data).unwrap(), {
                loading: 'Creating account...',
                success: (res) => {
                    navigate('/login');
                    return res.message || 'Registration successful! Please login.';
                },
                error: (err) => err?.data?.message || err?.data?.errorMessages?.[0]?.message || 'Registration failed',
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="min-h-screen grid lg:grid-cols-2 items-center bg-[#F8FAFC]">
            <AuthSidebar backgroundImage="/assets/images/auth/login.jpg" />

            {/* Right Side: Register Form */}
            <div className="flex items-center justify-center p-10 overflow-y-auto max-h-screen">
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
                    <div className="bg-white w-[540px] rounded-2xl shadow-xl p-12 my-8">
                        <div className="text-center mb-10">
                            <h1 className="text-[32px] text-[#000000] font-bold mb-2">Create Account</h1>
                            <p className="text-[#64748B] text-lg font-normal">Join the Share Network App as a Student</p>
                        </div>

                        <Form
                            form={form}
                            name="register"
                            layout="vertical"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            {/* Dummy inputs to catch browser auto-fill */}
                            <input type="text" style={{ display: 'none' }} name="dummy-email" />
                            <input type="password" style={{ display: 'none' }} name="dummy-password" />

                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item
                                    label={<span className="text-[#1E293B] font-semibold text-base">First Name</span>}
                                    name="firstName"
                                    rules={[{ required: true, message: 'First name is required!' }]}
                                >
                                    <Input placeholder="Enter First Name" autoComplete="off" />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="text-[#1E293B] font-semibold text-base">Last Name</span>}
                                    name="lastName"
                                    rules={[{ required: true, message: 'Last name is required!' }]}
                                >
                                    <Input placeholder="Enter Last Name" autoComplete="off" />
                                </Form.Item>
                            </div>

                            <Form.Item
                                label={<span className="text-[#1E293B] font-semibold text-base">Email</span>}
                                name="email"
                                rules={[
                                    { required: true, message: 'Email is required!' },
                                    { type: 'email', message: 'Please enter a valid email!' }
                                ]}
                            >
                                <Input placeholder="Enter Email" />
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-[#1E293B] font-semibold text-base">Contact Number</span>}
                                name="contactNumber"
                                rules={[{ required: true, message: 'Contact number is required!' }]}
                            >
                                <Input placeholder="Enter Contact Number" autoComplete="off" />
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-[#1E293B] font-semibold text-base">Gender</span>}
                                name="gender"
                                rules={[{ required: true, message: 'Please select gender!' }]}
                            >
                                <Select placeholder="Select Gender">
                                    <Select.Option value="Male">Male</Select.Option>
                                    <Select.Option value="Female">Female</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-[#1E293B] font-semibold text-base">Password</span>}
                                name="password"
                                rules={[{ required: true, message: 'Password is required!' }]}
                            >
                                <Input.Password placeholder="*************" autoComplete="new-password" />
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-[#1E293B] font-semibold text-base">Confirm Password</span>}
                                name="confirmPassword"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: 'Confirm password is required!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The two passwords do not match!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="*************" autoComplete="new-password" />
                            </Form.Item>

                            <Form.Item className="mb-4">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    className="h-[52px] text-lg font-semibold bg-[#66D978] hover:bg-[#58C469] border-none shadow-md shadow-green-200"
                                >
                                    Sign Up
                                </Button>
                            </Form.Item>

                            <div className="text-center text-[#64748B] text-base">
                                Already have an account?{' '}
                                <Link to="/login" className="text-[#66D978] font-semibold hover:underline">
                                    Login
                                </Link>
                            </div>
                        </Form>
                    </div>
                </ConfigProvider>
            </div>
        </section>
    );
};

export default Register;
