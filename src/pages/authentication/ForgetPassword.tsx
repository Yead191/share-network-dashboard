import { Button, ConfigProvider, Form, FormProps, Input } from 'antd';
import { useNavigate } from 'react-router';
import AuthSidebar from '../../components/ui/AuthSidebar';

interface ForgetPasswordFormValues {
    email: string;
}

const ForgetPassword = () => {
    const navigate = useNavigate();
    const onFinish: FormProps<ForgetPasswordFormValues>['onFinish'] = (values) => {
        localStorage.setItem('forgetEmail', JSON.stringify(values.email));
        navigate('/verify-otp');
    };

    return (
        <section className="min-h-screen grid lg:grid-cols-2 items-center bg-[#F8FAFC]">
            <AuthSidebar backgroundImage="/assets/images/auth/forget.png" />
            <div className="flex items-center justify-center p-10">
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: '#66D978',

                            colorBgContainer: '#F1F4F9',
                        },
                        components: {
                            Input: {
                                borderRadius: 10,
                                colorBorder: 'transparent',
                                colorPrimaryBorder: 'transparent',
                                hoverBorderColor: 'transparent',
                                controlOutline: 'none',
                                activeBorderColor: 'transparent',
                            },
                        },
                    }}
                >
                    <div className="bg-white w-[630px] rounded-lg shadow-lg p-10 ">
                        <div className="text-primaryText space-y-3 text-center">
                            <h1 className="text-3xl  text-[#000000] font-bold text-center mt-2">Forget Password</h1>
                        </div>

                        <Form
                            name="normal_ForgetPassword"
                            className="ForgetPassword-form"
                            layout="vertical"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label={
                                    <label htmlFor="email" className="block text-primaryText mb-1 text-lg">
                                        Email
                                    </label>
                                }
                                name="email"
                                rules={[{ required: true, message: 'Please input your email!' }]}
                            >
                                <Input placeholder="Enter your email address" type="email" className="h-12" />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{
                                        height: 45,
                                        width: '100%',
                                        fontWeight: 500,
                                    }}
                                >
                                    Send Code
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </ConfigProvider>
            </div>
        </section>
    );
};

export default ForgetPassword;
