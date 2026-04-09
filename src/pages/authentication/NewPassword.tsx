import { Button, ConfigProvider, Form, Input } from 'antd';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { errorType } from './Login';
import { useResetPasswordMutation } from '../../redux/apiSlices/authSlice';
import { useEffect } from 'react';
import AuthSidebar from '../../components/ui/AuthSidebar';

const NewPassword = () => {
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    const [resetPassword, { isError, isSuccess, error, data }] = useResetPasswordMutation();

    useEffect(() => {
        if (isSuccess) {
            if (data) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    text: data?.message,
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    navigate('/login');
                    window.location.reload();
                });
            }
        }
        if (isError) {
            const errorMessage = (error as errorType)?.data?.errorMessages
                ? (error as errorType)?.data?.errorMessages.map((msg: { message: string }) => msg?.message).join('\n')
                : (error as errorType)?.data?.message || 'Something went wrong. Please try again.';

            Swal.fire({
                text: errorMessage,
                icon: 'error',
            });
        }
    }, [isSuccess, isError, error, data, navigate]);

    interface NewPasswordFormValues {
        new_password: string;
        confirm_password: string;
    }

    const onFinish = async (values: NewPasswordFormValues) => {
        await resetPassword({
            token: token,
            password: values.new_password,
            confirmPassword: values.confirm_password,
        });
    };

    return (
        <section className="min-h-screen grid lg:grid-cols-2 items-center bg-[#F8FAFC]">
            <AuthSidebar backgroundImage="/assets/images/auth/new-pass.jpg" />
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
                    <div>
                        <div className="bg-white w-[630px] rounded-lg shadow-lg p-10 ">
                            <div className="text-primaryText max-w-md mx-auto space-y-3 text-center ">
                                <h1 className="text-3xl   text-center mt-2 text-[#000000] font-bold">
                                    Set a new password
                                </h1>
                                <p>Create a new password. Ensure it differs from previous ones for security</p>
                            </div>

                            <Form
                                name="normal_NewPassword"
                                className="NewPassword-form"
                                layout="vertical"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    label={
                                        <label htmlFor="password" className="block text-primaryText mb-1 text-lg">
                                            New Password
                                        </label>
                                    }
                                    name="new_password"
                                    rules={[{ required: true, message: 'Please input new password!' }]}
                                >
                                    <Input.Password placeholder="KK!@#$15856" className=" h-12 px-6" />
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <label htmlFor="password" className="block text-primaryText mb-1 text-lg">
                                            Confirm Password
                                        </label>
                                    }
                                    name="confirm_password"
                                    rules={[{ required: true, message: 'Please input confirm password!' }]}
                                >
                                    <Input.Password placeholder="KK!@#$15856" className="h-12 px-6" />
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
                                        Update Password
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </ConfigProvider>
            </div>
        </section>
    );
};

export default NewPassword;
