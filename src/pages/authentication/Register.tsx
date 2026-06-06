import { Button, ConfigProvider, Form, FormProps, Input, Select, DatePicker, Checkbox } from 'antd';
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
    dob: any;
    highestEducation: string;
    vNumber: string;
    about: string;
    careerDirections: string[];
    havealaptop: boolean;
    linkedInProfile: string;
    githubProfile: string;
    PortfolioWebsite: string;
    address: string;
    zip_code: string;
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

        const { dob, confirmPassword, ...rest } = values;

        const data = {
            ...rest,
            dob: dob ? dob.format('YYYY-MM-DD') : undefined,
            role: "STUDENT",
            status: "PENDING",
            verified: true,
        };

        try {
            // console.log(data)
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
        <section className="h-screen grid lg:grid-cols-2 items-center bg-[#F8FAFC]">
            <AuthSidebar backgroundImage="/assets/images/auth/login.jpg" />

            {/* Right Side: Register Form */}
            <div className="flex items-center justify-center ">
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
                            DatePicker: {
                                controlHeight: 48,
                                colorBorder: '#E2E8F0',
                                borderRadius: 10,
                            },
                            Button: {
                                controlHeight: 48,
                                borderRadius: 10,
                            },
                            Checkbox: {
                                colorPrimary: '#66D978',
                                borderRadius: 4,
                            }
                        },
                    }}
                >
                    <div className="bg-white w-[720px] rounded-2xl shadow-xl p-10 overflow-y-auto max-h-[calc(100vh-4rem)]">
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

                            <h3 className="text-lg font-bold text-[#1E293B] mb-4 border-b pb-2">Personal Information</h3>
                            <div className="grid grid-cols-2 gap-x-6">
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
                                        <Select.Option value="Other">Other</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label={<span className="text-[#1E293B] font-semibold text-base">Date of Birth</span>}
                                    name="dob"
                                    rules={[{ required: true, message: 'Date of birth is required!' }]}
                                >
                                    <DatePicker className="w-full" placeholder="Select DOB" />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="text-[#1E293B] font-semibold text-base">Highest Education</span>}
                                    name="highestEducation"
                                    rules={[{ required: true, message: 'Education is required!' }]}
                                >
                                    <Select placeholder="Select Education">
                                        <Select.Option value="High School">High School</Select.Option>
                                        <Select.Option value="Bachelor">Bachelor's Degree</Select.Option>
                                        <Select.Option value="Master">Master's Degree</Select.Option>
                                        <Select.Option value="PhD">PhD</Select.Option>
                                        <Select.Option value="Other">Other</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label={<span className="text-[#1E293B] font-semibold text-base">V-Number</span>}
                                    name="vNumber"
                                // rules={[{ required: true, message: 'V-Number is required!' }]}
                                >
                                    <Input placeholder="Enter V-Number" />
                                </Form.Item>
                            </div>

                            <h3 className="text-lg font-bold text-[#1E293B] mt-8 mb-4 border-b pb-2">Motivation & Profile</h3>
                            <div className="grid grid-cols-1 gap-y-2">
                                <Form.Item
                                    label={<span className="text-[#1E293B] font-semibold text-base">About</span>}
                                    name="about"
                                // rules={[{ required: true, message: 'About is required!' }]}
                                >
                                    <Input.TextArea placeholder="Tell us about yourself" rows={4} />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-medium text-gray-700">Career Directions</span>}
                                    name="careerDirections"
                                >
                                    <Checkbox.Group className="w-full">
                                        <div className="grid grid-cols-2 gap-2.5">
                                            {[
                                                'I have no idea yet',
                                                'Frontend development (HTML/CSS/Javascript)',
                                                'App development',
                                                'Game development',
                                                'AI (Artificial Intelligence)',
                                                'Cybersecurity',
                                                'Web design / UXD (User experience design)',
                                                'Tester',
                                                'UI/UX',
                                                'Data Analyst'
                                            ].map((direction) => (
                                                <div key={direction}>
                                                    <Checkbox value={direction}>{direction}</Checkbox>
                                                </div>
                                            ))}
                                        </div>
                                    </Checkbox.Group>
                                </Form.Item>

                                <Form.Item name="havealaptop" valuePropName="checked">
                                    <Checkbox>
                                        <span className="text-[#1E293B] font-semibold text-base">I have a laptop</span>
                                    </Checkbox>
                                </Form.Item>
                            </div>

                            <h3 className="text-lg font-bold text-[#1E293B] mt-8 mb-4 border-b pb-2">Portfolio & Socials</h3>
                            <div className="grid grid-cols-2 gap-x-6">
                                <Form.Item
                                    label={<span className="text-[#1E293B] font-semibold text-base">LinkedIn Profile</span>}
                                    name="linkedInProfile"
                                // rules={[{ required: true, message: 'LinkedIn profile is required!' }]}
                                >
                                    <Input placeholder="https://linkedin.com/in/..." />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="text-[#1E293B] font-semibold text-base">GitHub Profile</span>}
                                    name="githubProfile"
                                // rules={[{ required: true, message: 'GitHub profile is required!' }]}
                                >
                                    <Input placeholder="https://github.com/..." />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="text-[#1E293B] font-semibold text-base">Portfolio Website</span>}
                                    name="PortfolioWebsite"
                                    className="col-span-2"
                                >
                                    <Input placeholder="https://yourportfolio.com" />
                                </Form.Item>
                            </div>

                            <h3 className="text-lg font-bold text-[#1E293B] mt-8 mb-4 border-b pb-2">Address</h3>
                            <div className="grid grid-cols-2 gap-x-6">
                                <Form.Item
                                    label={<span className="text-[#1E293B] font-semibold text-base">Address</span>}
                                    name="address"
                                    className="col-span-2"
                                    rules={[{ required: true, message: 'Address is required!' }]}
                                >
                                    <Input.TextArea placeholder="Enter full address" rows={2} />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="text-[#1E293B] font-semibold text-base">Zip Code</span>}
                                    name="zip_code"
                                    rules={[{ required: true, message: 'Zip code is required!' }]}
                                >
                                    <Input placeholder="Enter Zip Code" />
                                </Form.Item>
                            </div>

                            <h3 className="text-lg font-bold text-[#1E293B] mt-8 mb-4 border-b pb-2">Security</h3>
                            <div className="grid grid-cols-2 gap-x-6">
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
                            </div>

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
